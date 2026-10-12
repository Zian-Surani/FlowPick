"""Tabular Q-Learning Algorithm Implementation for FlowPick."""
import random
from collections import defaultdict
from typing import Dict, List, Optional
from .models import Action, State


class QLearningAgent:
    """
    Model-Free Off-Policy Temporal Difference Q-Learning Agent.
    Maintains a discrete Q-table mapping (state, action) pairs to expected returns.
    """

    def __init__(
        self,
        learning_rate: float = 0.1,
        discount_factor: float = 0.95,
        epsilon: float = 0.2,
        min_epsilon: float = 0.05,
        epsilon_decay: float = 0.992,
    ):
        self.learning_rate = learning_rate  # α
        self.discount_factor = discount_factor  # γ
        self.epsilon = epsilon  # ε
        self.min_epsilon = min_epsilon
        self.epsilon_decay = epsilon_decay

        # Q-Table: Dict[State, Dict[Action, float]]
        self.q_table: Dict[State, Dict[Action, float]] = defaultdict(
            lambda: {a: 0.0 for a in Action}
        )

    def get_action(
        self,
        state: State,
        valid_actions: Optional[List[Action]] = None,
        explore: bool = True,
    ) -> Action:
        """
        Select an action using ε-greedy policy.
        If explore is False, purely exploits best Q-value (greedy evaluation).
        """
        actions_to_consider = valid_actions if valid_actions else list(Action)

        # Exploration: choose random action
        if explore and random.random() < self.epsilon:
            return random.choice(actions_to_consider)

        # Exploitation: choose action with maximum Q-value
        q_values = self.q_table[state]
        max_q = max(q_values[a] for a in actions_to_consider)

        # Tie-breaking among actions with identical max Q-value
        best_actions = [a for a in actions_to_consider if q_values[a] == max_q]
        return random.choice(best_actions)

    def update(
        self,
        state: State,
        action: Action,
        reward: float,
        next_state: State,
        done: bool,
    ) -> float:
        """
        Perform Bellman Optimality update:
        Q(s, a) ← Q(s, a) + α [ r + γ max_a' Q(s', a') − Q(s, a) ]
        Returns temporal difference error (TD error).
        """
        current_q = self.q_table[state][action]

        if done:
            # Terminal state has zero future return
            td_target = reward
        else:
            # Next state best expected Q-value
            max_next_q = max(self.q_table[next_state].values())
            td_target = reward + self.discount_factor * max_next_q

        td_error = td_target - current_q
        self.q_table[state][action] = current_q + self.learning_rate * td_error
        return td_error

    def decay_epsilon(self) -> None:
        """Gradually decay exploration rate after each episode."""
        if self.epsilon > self.min_epsilon:
            self.epsilon = max(self.min_epsilon, self.epsilon * self.epsilon_decay)

    def reset_q_table(self) -> None:
        """Clear all learned Q-values."""
        self.q_table.clear()

    def get_q_values(self, state: State) -> Dict[str, float]:
        """Return human-readable Q-values for a given state."""
        return {a.name: round(self.q_table[state][a], 4) for a in Action}

    def get_stats(self) -> Dict[str, float]:
        """Return Q-table summary statistics."""
        visited_states = len(self.q_table)
        total_q = sum(sum(actions.values()) for actions in self.q_table.values())
        avg_q = total_q / (visited_states * 4) if visited_states > 0 else 0.0
        return {
            "visited_states": visited_states,
            "epsilon": round(self.epsilon, 4),
            "average_q": round(avg_q, 4),
        }
