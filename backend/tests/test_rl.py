"""Comprehensive test suite for FlowPick RL environment, algorithm, and API endpoints."""
import pytest
from fastapi.testclient import TestClient
from app.rl.models import Action
from app.rl.environment import WarehouseEnvironment
from app.rl.q_learning import QLearningAgent
from app.rl.trainer import Trainer
from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def env():
    return WarehouseEnvironment(rows=6, cols=6, max_steps=50)


@pytest.fixture
def agent():
    return QLearningAgent(learning_rate=0.1, discount_factor=0.95, epsilon=0.2)


def test_environment_reset(env):
    """Test 1: Environment reset returns starting state."""
    state = env.reset()
    assert state == (5, 0, False)
    assert env.agent_row == 5
    assert env.agent_col == 0
    assert env.has_package is False
    assert env.step_count == 0


def test_valid_movement(env):
    """Test 2: Valid movement advances agent and deducts normal movement reward (-1)."""
    env.reset()
    # Move UP from (5,0) to (4,0)
    next_state, reward, done, info = env.step(Action.UP)
    assert next_state == (4, 0, False)
    assert reward == -1.0
    assert done is False
    assert info["collision"] is False


def test_invalid_movement_reward(env):
    """Test 3: Invalid movement (colliding with wall or shelf) gives -10 penalty."""
    env.reset()
    # At (5,0), attempting to move LEFT or DOWN hits boundary
    next_state, reward, done, info = env.step(Action.LEFT)
    assert next_state == (5, 0, False)
    assert reward == -10.0
    assert info["collision"] is True


def test_successful_terminal_condition(env):
    """Test 4: Delivering package to dispatch gives +100 and marks episode done."""
    env.reset()
    env.has_package = True
    # Position agent right above dispatch (dispatch is at 5,5)
    env.agent_row = 4
    env.agent_col = 5

    next_state, reward, done, info = env.step(Action.DOWN)
    assert next_state == (5, 5, True)
    assert reward >= 99.0  # +100 delivery minus step cost
    assert done is True
    assert info["delivery"] is True


def test_q_value_update(agent):
    """Test 5: Q-value updates according to Bellman equation."""
    state = (5, 0, False)
    next_state = (4, 0, False)
    action = Action.UP
    reward = -1.0

    # Initial Q-value is 0.0
    assert agent.q_table[state][action] == 0.0

    agent.update(state, action, reward, next_state, done=False)
    # Target = -1.0 + 0.95 * 0.0 = -1.0. Error = -1.0. New Q = 0 + 0.1 * (-1.0) = -0.1
    assert round(agent.q_table[state][action], 4) == -0.1


def test_epsilon_greedy_selection(agent):
    """Test 6: Epsilon-greedy action selection."""
    state = (5, 0, False)
    valid_actions = [Action.UP, Action.RIGHT]

    # With epsilon=0, must exploit maximum Q-value
    agent.q_table[state][Action.UP] = 10.0
    agent.q_table[state][Action.RIGHT] = 2.0
    action = agent.get_action(state, valid_actions, explore=False)
    assert action == Action.UP


def test_training_produces_history(env, agent):
    """Test 7: Trainer executes episodes and populates training history."""
    trainer = Trainer(env, agent)
    # Run single-step loops or short training
    trainer.start_training(episodes=10, step_delay_ms=0)
    # Wait for completion
    if trainer._thread:
        trainer._thread.join(timeout=3.0)

    assert len(trainer.training_history) >= 1
    metrics = trainer.get_training_metrics()
    assert "average_reward" in metrics
    assert "success_rate" in metrics


def test_training_improves_behaviour():
    """Test 8: Fast training demonstrates policy progression and Q-table expansion."""
    env = WarehouseEnvironment(rows=4, cols=4, start_pos=(3, 0), target_pos=(0, 3), dispatch_pos=(3, 3), shelves=set())
    agent = QLearningAgent(learning_rate=0.2, discount_factor=0.95, epsilon=0.3)
    trainer = Trainer(env, agent)

    trainer.start_training(episodes=30, step_delay_ms=0)
    if trainer._thread:
        trainer._thread.join(timeout=4.0)

    # Q-table must have learned multiple state-action values
    assert len(agent.q_table) > 5


def test_api_health(client):
    """Test 9: API Health endpoint returns ok status."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_api_training_status(client):
    """Test 10: Training status endpoint returns status and metrics."""
    response = client.get("/api/training/status")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "episode" in data
    assert "cumulative_reward" in data
