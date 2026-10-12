"""Data models and enums for the FlowPick Reinforcement Learning system."""
from enum import IntEnum
from typing import Tuple, NamedTuple


class Action(IntEnum):
    """Discrete action space for the warehouse picking agent."""
    UP = 0
    DOWN = 1
    LEFT = 2
    RIGHT = 3

    @classmethod
    def from_str(cls, name: str) -> "Action":
        mapping = {
            "UP": cls.UP,
            "DOWN": cls.DOWN,
            "LEFT": cls.LEFT,
            "RIGHT": cls.RIGHT,
        }
        return mapping[name.upper()]

    def to_str(self) -> str:
        return self.name


class GridCoord(NamedTuple):
    row: int
    col: int


# State tuple: (agent_row, agent_col, has_package)
State = Tuple[int, int, bool]
