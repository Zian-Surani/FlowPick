"""Pydantic request and response schemas for FlowPick REST API."""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class GridCoordModel(BaseModel):
    row: int
    col: int


class EnvironmentStateModel(BaseModel):
    rows: int
    cols: int
    shelves: List[GridCoordModel]
    target: GridCoordModel
    dispatch: GridCoordModel
    agentPosition: GridCoordModel
    hasPackage: bool
    stepCount: int
    maxSteps: int
    path: List[GridCoordModel]


class AgentStateModel(BaseModel):
    position: GridCoordModel
    target: GridCoordModel
    dispatch: GridCoordModel
    hasPackage: bool
    availableActions: List[str]
    currentAction: Optional[str] = None
    currentReward: float
    cumulativeReward: float
    episode: int
    step: int
    status: str
    path: List[GridCoordModel]


class EpisodeResultModel(BaseModel):
    episode: int
    steps: int
    totalReward: float = Field(alias="total_reward")
    success: bool
    epsilon: float

    model_config = ConfigDict(populate_by_name=True)


class TrainingMetricsModel(BaseModel):
    episode: int
    reward: float
    averageReward: float = Field(alias="average_reward")
    successRate: int = Field(alias="success_rate")
    averageSteps: float = Field(alias="average_steps")

    model_config = ConfigDict(populate_by_name=True)


class TrainingStatusResponse(BaseModel):
    status: str
    episode: int
    totalEpisodes: int = Field(alias="total_episodes")
    currentReward: float = Field(alias="current_reward")
    cumulativeReward: float = Field(alias="cumulative_reward")
    successRate: int = Field(alias="success_rate")
    averageSteps: float = Field(alias="average_steps")
    averageReward: float = Field(alias="average_reward")
    history: List[Dict[str, Any]]

    model_config = ConfigDict(populate_by_name=True)


class TrainingConfigRequest(BaseModel):
    episodes: int = 200
    learningRate: float = Field(default=0.1, alias="learning_rate")
    discountFactor: float = Field(default=0.95, alias="discount_factor")
    epsilon: float = 0.2
    simulationSpeedMs: int = Field(default=30, alias="simulation_speed_ms")

    model_config = ConfigDict(populate_by_name=True)


class EvaluationResponse(BaseModel):
    success: bool
    steps: int
    totalReward: float = Field(alias="total_reward")
    path: List[GridCoordModel]
    actions: List[str]

    model_config = ConfigDict(populate_by_name=True)


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "1.0.0"
    mode: str = "q-learning-backend"
