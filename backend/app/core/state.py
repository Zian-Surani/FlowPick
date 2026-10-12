"""Global state management for FlowPick singleton instances."""
from ..rl.environment import WarehouseEnvironment
from ..rl.q_learning import QLearningAgent
from ..rl.trainer import Trainer


class GlobalState:
    """Singleton container for environment, agent, and trainer instances."""

    def __init__(self):
        self.env = WarehouseEnvironment()
        self.agent = QLearningAgent()
        self.trainer = Trainer(self.env, self.agent)

    def reset_all(self):
        self.trainer.reset_training(clear_q_table=True)


# Application-level singleton
state = GlobalState()
