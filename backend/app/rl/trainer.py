"""Thread-safe background trainer orchestrating the Q-Learning loop."""
import threading
import time
import logging
from typing import Dict, List, Any, Optional
from .models import Action, State
from .environment import WarehouseEnvironment
from .q_learning import QLearningAgent

logger = logging.getLogger("flowpick.trainer")


class Trainer:
    """
    Central training manager for the FlowPick RL system.
    Orchestrates live agent stepping, episode loops, metrics logging,
    and thread-safe state synchronization.
    """

    def __init__(self, env: WarehouseEnvironment, agent: QLearningAgent):
        self.env = env
        self.agent = agent
        self.lock = threading.Lock()

        # Training status: 'idle', 'training', 'paused', 'completed'
        self.status: str = "idle"
        self._stop_event = threading.Event()
        self._pause_event = threading.Event()
        self._thread: Optional[threading.Thread] = None

        # Live telemetry state
        self.current_episode: int = 1
        self.total_episodes_target: int = 200
        self.current_step: int = 0
        self.current_action: Optional[str] = None
        self.current_reward: float = 0.0
        self.cumulative_reward: float = 0.0
        self.step_delay_ms: int = 40  # Speed for visual playback during training

        # Historical episode records
        self.training_history: List[Dict[str, Any]] = []

    def start_training(
        self,
        episodes: int = 200,
        learning_rate: float = 0.1,
        discount_factor: float = 0.95,
        epsilon: float = 0.2,
        step_delay_ms: int = 30,
    ) -> Dict[str, str]:
        """Start or resume background training thread."""
        with self.lock:
            if self.status == "training":
                return {"status": "Training is already in progress"}

            self.total_episodes_target = max(10, episodes)
            self.agent.learning_rate = learning_rate
            self.agent.discount_factor = discount_factor
            self.agent.epsilon = epsilon
            self.step_delay_ms = max(0, step_delay_ms)

            self.status = "training"
            self._stop_event.clear()
            self._pause_event.clear()

        # Launch background worker
        self._thread = threading.Thread(target=self._training_worker, daemon=True)
        self._thread.start()
        logger.info(f"Training started for {self.total_episodes_target} episodes.")
        return {"status": "Training started"}

    def pause_training(self) -> Dict[str, str]:
        """Pause running training loop."""
        with self.lock:
            if self.status == "training":
                self.status = "paused"
                self._pause_event.set()
                logger.info("Training paused.")
                return {"status": "Training paused"}
            return {"status": f"Cannot pause from status: {self.status}"}

    def reset_training(self, clear_q_table: bool = True) -> Dict[str, str]:
        """Reset environment, episode counters, history, and optionally the Q-table."""
        # Stop any active training thread first
        self._stop_event.set()
        self._pause_event.set()

        with self.lock:
            self.status = "idle"
            self.current_episode = 1
            self.current_step = 0
            self.current_action = None
            self.current_reward = 0.0
            self.cumulative_reward = 0.0
            self.training_history.clear()
            self.env.reset()

            if clear_q_table:
                self.agent.reset_q_table()
                logger.info("Environment and Q-table reset.")
            else:
                logger.info("Environment reset (retained learned Q-table).")

        return {"status": "Training state reset"}

    def reset_episode_only(self) -> Dict[str, Any]:
        """Reset only current warehouse episode without clearing history or learned Q-values."""
        with self.lock:
            self.current_step = 0
            self.current_action = None
            self.current_reward = 0.0
            self.cumulative_reward = 0.0
            self.env.reset()
            return self.get_agent_state()

    def step_single(self) -> Dict[str, Any]:
        """Execute a single step using current Q-Learning policy."""
        with self.lock:
            state = self.env.get_state()
            valid_actions = self.env.get_valid_actions()
            action = self.agent.get_action(state, valid_actions, explore=True)

            next_state, reward, done, info = self.env.step(action)
            self.agent.update(state, action, reward, next_state, done)

            self.current_step += 1
            self.current_action = action.name
            self.current_reward = reward
            self.cumulative_reward += reward

            if done:
                # Record completed episode
                self._record_episode_completion(self.current_step, self.cumulative_reward, info.get("delivery", False))
                # Reset for next episode
                self.current_episode += 1
                self.current_step = 0
                self.cumulative_reward = 0.0
                self.env.reset()

            return self.get_agent_state()

    def run_evaluation(self, max_steps: int = 50) -> Dict[str, Any]:
        """
        Execute an evaluation episode using the greedy learned policy (ε = 0).
        Demonstrates the trained agent's converged route to package and dispatch.
        """
        with self.lock:
            state = self.env.reset()
            eval_path: List[Dict[str, int]] = [{"row": state[0], "col": state[1]}]
            eval_actions: List[str] = []
            total_reward: float = 0.0
            steps: int = 0
            success: bool = False

            while steps < max_steps:
                valid_actions = self.env.get_valid_actions()
                # Greedy action selection: explore=False
                action = self.agent.get_action(state, valid_actions, explore=False)
                eval_actions.append(action.name)

                next_state, reward, done, info = self.env.step(action)
                eval_path.append({"row": next_state[0], "col": next_state[1]})
                total_reward += reward
                steps += 1
                state = next_state

                if done:
                    success = info.get("delivery", False)
                    break

            # Synchronize environment view to evaluation end
            self.current_step = steps
            self.current_action = eval_actions[-1] if eval_actions else None
            self.current_reward = reward
            self.cumulative_reward = total_reward

            return {
                "success": success,
                "steps": steps,
                "total_reward": round(total_reward, 2),
                "path": eval_path,
                "actions": eval_actions,
            }

    def _training_worker(self) -> None:
        """Background thread executing the Q-Learning loop across episodes."""
        while self.current_episode <= self.total_episodes_target and not self._stop_event.is_set():
            if self._pause_event.is_set():
                time.sleep(0.1)
                continue

            with self.lock:
                state = self.env.reset()
                self.current_step = 0
                self.cumulative_reward = 0.0
                ep_reward = 0.0
                ep_steps = 0
                is_delivery = False

            done = False
            while not done and not self._stop_event.is_set():
                if self._pause_event.is_set():
                    time.sleep(0.1)
                    continue

                with self.lock:
                    valid = self.env.get_valid_actions()
                    action = self.agent.get_action(state, valid, explore=True)
                    next_state, reward, done, info = self.env.step(action)
                    self.agent.update(state, action, reward, next_state, done)

                    ep_steps += 1
                    ep_reward += reward
                    state = next_state

                    self.current_step = ep_steps
                    self.current_action = action.name
                    self.current_reward = reward
                    self.cumulative_reward = ep_reward
                    is_delivery = info.get("delivery", False)

                # Optional sleep delay for human visualization
                if self.step_delay_ms > 0:
                    time.sleep(self.step_delay_ms / 1000.0)

            with self.lock:
                self._record_episode_completion(ep_steps, ep_reward, is_delivery)
                self.agent.decay_epsilon()
                self.current_episode += 1

        with self.lock:
            if not self._stop_event.is_set():
                self.status = "completed"
                logger.info(f"Training completed for all {self.total_episodes_target} episodes.")

    def _record_episode_completion(self, steps: int, total_reward: float, success: bool) -> None:
        """Record completed episode statistics in history."""
        self.training_history.append({
            "episode": self.current_episode,
            "steps": steps,
            "total_reward": round(total_reward, 1),
            "success": success,
            "epsilon": round(self.agent.epsilon, 3),
        })

    def get_agent_state(self) -> Dict[str, Any]:
        """Return snapshot of live agent telemetry."""
        return {
            "episode": self.current_episode,
            "step": self.current_step,
            "position": {"row": self.env.agent_row, "col": self.env.agent_col},
            "target": {"row": self.env.target_pos[0], "col": self.env.target_pos[1]},
            "dispatch": {"row": self.env.dispatch_pos[0], "col": self.env.dispatch_pos[1]},
            "has_package": self.env.has_package,
            "available_actions": [a.name for a in self.env.get_valid_actions()],
            "current_action": self.current_action,
            "current_reward": self.current_reward,
            "cumulative_reward": round(self.cumulative_reward, 1),
            "status": self.status,
            "path": list(self.env.path),
        }

    def get_training_metrics(self) -> Dict[str, Any]:
        """Compute aggregated metrics over recorded training history."""
        with self.lock:
            history = list(self.training_history)
            count = len(history)

            if count == 0:
                return {
                    "episode": self.current_episode,
                    "reward": 0.0,
                    "average_reward": 0.0,
                    "success_rate": 0,
                    "average_steps": 0.0,
                    "history": [],
                }

            sum_rewards = sum(h["total_reward"] for h in history)
            success_count = sum(1 for h in history if h["success"])
            step_sum = sum(h["steps"] for h in history)

            return {
                "episode": history[-1]["episode"],
                "reward": history[-1]["total_reward"],
                "average_reward": round(sum_rewards / count, 1),
                "success_rate": round((success_count / count) * 100),
                "average_steps": round(step_sum / count, 1),
                "history": history,
            }
