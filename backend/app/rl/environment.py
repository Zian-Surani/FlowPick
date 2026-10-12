"""Deterministic 2D Warehouse Grid Environment for FlowPick."""
from typing import List, Set, Tuple, Dict, Any
from .models import Action, GridCoord, State


class WarehouseEnvironment:
    """
    Simplified 2D Warehouse Grid Environment.
    Grid cells contain:
    - Traversable transit aisles
    - Storage racks/shelves (obstacles)
    - Item pickup station (package)
    - Dispatch dock zone
    """

    def __init__(
        self,
        rows: int = 6,
        cols: int = 6,
        start_pos: Tuple[int, int] = (5, 0),
        target_pos: Tuple[int, int] = (0, 4),
        dispatch_pos: Tuple[int, int] = (5, 5),
        shelves: Set[Tuple[int, int]] = None,
        max_steps: int = 60,
    ):
        self.rows = rows
        self.cols = cols
        self.start_pos = start_pos
        self.target_pos = target_pos
        self.dispatch_pos = dispatch_pos
        self.max_steps = max_steps

        # Default shelf obstacles matching FlowPick warehouse layout
        if shelves is None:
            self.shelves: Set[Tuple[int, int]] = {
                (1, 1),
                (1, 2),
                (1, 4),
                (3, 1),
                (3, 3),
                (3, 4),
                (4, 1),
            }
        else:
            self.shelves = set(shelves)

        # Internal state
        self.agent_row = self.start_pos[0]
        self.agent_col = self.start_pos[1]
        self.has_package = False
        self.step_count = 0
        self.path: List[Dict[str, int]] = [{"row": self.agent_row, "col": self.agent_col}]
        self.recent_positions: List[Tuple[int, int]] = [self.start_pos]

    def reset(self) -> State:
        """Reset environment to initial starting state."""
        self.agent_row = self.start_pos[0]
        self.agent_col = self.start_pos[1]
        self.has_package = False
        self.step_count = 0
        self.path = [{"row": self.agent_row, "col": self.agent_col}]
        self.recent_positions = [self.start_pos]
        return self.get_state()

    def get_state(self) -> State:
        """Return hashable discrete state tuple: (agent_row, agent_col, has_package)."""
        return (self.agent_row, self.agent_col, self.has_package)

    def is_valid_position(self, row: int, col: int) -> bool:
        """Check if (row, col) is within grid boundaries and not inside a shelf obstacle."""
        if not (0 <= row < self.rows and 0 <= col < self.cols):
            return False
        if (row, col) in self.shelves:
            return False
        return True

    def get_valid_actions(self) -> List[Action]:
        """Return list of valid actions from the current agent position."""
        valid: List[Action] = []
        transitions = [
            (Action.UP, self.agent_row - 1, self.agent_col),
            (Action.DOWN, self.agent_row + 1, self.agent_col),
            (Action.LEFT, self.agent_row, self.agent_col - 1),
            (Action.RIGHT, self.agent_row, self.agent_col + 1),
        ]
        for act, r, c in transitions:
            if self.is_valid_position(r, c):
                valid.append(act)
        return valid if valid else [Action.UP]

    def step(self, action: Action) -> Tuple[State, float, bool, Dict[str, Any]]:
        """
        Execute one action in the environment.
        Returns:
            next_state: State
            reward: float
            done: bool
            info: dict
        """
        self.step_count += 1
        info: Dict[str, Any] = {
            "collision": False,
            "pickup": False,
            "delivery": False,
            "delay": False,
            "timeout": False,
        }

        # Calculate attempted transition
        dr, dc = 0, 0
        if action == Action.UP:
            dr = -1
        elif action == Action.DOWN:
            dr = 1
        elif action == Action.LEFT:
            dc = -1
        elif action == Action.RIGHT:
            dc = 1

        new_row = self.agent_row + dr
        new_col = self.agent_col + dc

        # Check for invalid move / collision
        if not self.is_valid_position(new_row, new_col):
            # Invalid move: stay in place, penalize -10
            reward = -10.0
            info["collision"] = True
            done = self.step_count >= self.max_steps
            if done:
                info["timeout"] = True
            return self.get_state(), reward, done, info

        # Valid movement step: advance agent position
        self.agent_row = new_row
        self.agent_col = new_col
        pos = (self.agent_row, self.agent_col)
        self.path.append({"row": self.agent_row, "col": self.agent_col})

        # Check for loop / unnecessary delay (revisiting position in last 4 steps)
        is_delayed = pos in self.recent_positions[-4:] if len(self.recent_positions) >= 2 else False
        self.recent_positions.append(pos)

        # Baseline movement cost
        if is_delayed:
            reward = -5.0
            info["delay"] = True
        else:
            reward = -1.0

        # Check pickup milestone
        if not self.has_package and pos == self.target_pos:
            self.has_package = True
            reward += 20.0
            info["pickup"] = True

        # Check delivery milestone at dispatch zone
        done = False
        if self.has_package and pos == self.dispatch_pos:
            reward += 100.0
            info["delivery"] = True
            done = True

        # Check maximum steps cutoff
        if not done and self.step_count >= self.max_steps:
            done = True
            info["timeout"] = True

        return self.get_state(), reward, done, info

    def is_terminal(self) -> bool:
        """Check if environment has reached a terminal condition."""
        delivered = self.has_package and (self.agent_row, self.agent_col) == self.dispatch_pos
        timeout = self.step_count >= self.max_steps
        return delivered or timeout
