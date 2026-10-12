"""FastAPI router defining all REST endpoints for FlowPick RL agent."""
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from .schemas import (
    HealthResponse,
    EnvironmentStateModel,
    AgentStateModel,
    TrainingStatusResponse,
    TrainingConfigRequest,
    EvaluationResponse,
    GridCoordModel,
)
from ..core.state import state

router = APIRouter(prefix="/api", tags=["FlowPick RL"])


@router.get("/health", response_model=HealthResponse)
def get_health():
    """Health check endpoint."""
    return HealthResponse()


@router.get("/environment", response_model=EnvironmentStateModel)
def get_environment():
    """Return current environment layout and state."""
    env = state.env
    return EnvironmentStateModel(
        rows=env.rows,
        cols=env.cols,
        shelves=[GridCoordModel(row=r, col=c) for r, c in sorted(env.shelves)],
        target=GridCoordModel(row=env.target_pos[0], col=env.target_pos[1]),
        dispatch=GridCoordModel(row=env.dispatch_pos[0], col=env.dispatch_pos[1]),
        agentPosition=GridCoordModel(row=env.agent_row, col=env.agent_col),
        hasPackage=env.has_package,
        stepCount=env.step_count,
        maxSteps=env.max_steps,
        path=[GridCoordModel(row=p["row"], col=p["col"]) for p in env.path],
    )


@router.get("/agent", response_model=AgentStateModel)
def get_agent():
    """Return live agent state and sensory telemetry."""
    info = state.trainer.get_agent_state()
    return AgentStateModel(
        position=GridCoordModel(row=info["position"]["row"], col=info["position"]["col"]),
        target=GridCoordModel(row=info["target"]["row"], col=info["target"]["col"]),
        dispatch=GridCoordModel(row=info["dispatch"]["row"], col=info["dispatch"]["col"]),
        hasPackage=info["has_package"],
        availableActions=info["available_actions"],
        currentAction=info["current_action"],
        currentReward=info["current_reward"],
        cumulativeReward=info["cumulative_reward"],
        episode=info["episode"],
        step=info["step"],
        status=info["status"],
        path=[GridCoordModel(row=p["row"], col=p["col"]) for p in info["path"]],
    )


@router.get("/training/status", response_model=TrainingStatusResponse)
def get_training_status():
    """Return central training progress, metrics, and recorded history."""
    metrics_data = state.trainer.get_training_metrics()
    trainer = state.trainer
    return TrainingStatusResponse(
        status=trainer.status,
        episode=trainer.current_episode,
        total_episodes=trainer.total_episodes_target,
        current_reward=trainer.current_reward,
        cumulative_reward=round(trainer.cumulative_reward, 1),
        success_rate=metrics_data["success_rate"],
        average_steps=metrics_data["average_steps"],
        average_reward=metrics_data["average_reward"],
        history=metrics_data["history"],
    )


@router.post("/training/start")
def start_training(config: TrainingConfigRequest):
    """Start or resume background Q-Learning training."""
    result = state.trainer.start_training(
        episodes=config.episodes,
        learning_rate=config.learningRate,
        discount_factor=config.discountFactor,
        epsilon=config.epsilon,
        step_delay_ms=config.simulationSpeedMs,
    )
    return result


@router.post("/training/pause")
def pause_training():
    """Pause currently running training thread."""
    return state.trainer.pause_training()


@router.post("/training/reset")
def reset_training():
    """Reset environment, training state, history, and learned Q-values."""
    return state.trainer.reset_training(clear_q_table=True)


@router.post("/episode/reset", response_model=AgentStateModel)
def reset_episode():
    """Reset only current warehouse episode (preserves training history)."""
    info = state.trainer.reset_episode_only()
    return AgentStateModel(
        position=GridCoordModel(row=info["position"]["row"], col=info["position"]["col"]),
        target=GridCoordModel(row=info["target"]["row"], col=info["target"]["col"]),
        dispatch=GridCoordModel(row=info["dispatch"]["row"], col=info["dispatch"]["col"]),
        hasPackage=info["has_package"],
        availableActions=info["available_actions"],
        currentAction=info["current_action"],
        currentReward=info["current_reward"],
        cumulativeReward=info["cumulative_reward"],
        episode=info["episode"],
        step=info["step"],
        status=info["status"],
        path=[GridCoordModel(row=p["row"], col=p["col"]) for p in info["path"]],
    )


@router.post("/agent/step", response_model=AgentStateModel)
def agent_step():
    """Execute a single step using the Q-Learning agent."""
    info = state.trainer.step_single()
    return AgentStateModel(
        position=GridCoordModel(row=info["position"]["row"], col=info["position"]["col"]),
        target=GridCoordModel(row=info["target"]["row"], col=info["target"]["col"]),
        dispatch=GridCoordModel(row=info["dispatch"]["row"], col=info["dispatch"]["col"]),
        hasPackage=info["has_package"],
        availableActions=info["available_actions"],
        currentAction=info["current_action"],
        currentReward=info["current_reward"],
        cumulativeReward=info["cumulative_reward"],
        episode=info["episode"],
        step=info["step"],
        status=info["status"],
        path=[GridCoordModel(row=p["row"], col=p["col"]) for p in info["path"]],
    )


@router.post("/evaluation/run", response_model=EvaluationResponse)
def run_evaluation():
    """
    Run an evaluation episode with exploration disabled (greedy policy).
    Demonstrates the learned path from start to pickup to dispatch.
    """
    result = state.trainer.run_evaluation()
    return EvaluationResponse(
        success=result["success"],
        steps=result["steps"],
        total_reward=result["total_reward"],
        path=[GridCoordModel(row=p["row"], col=p["col"]) for p in result["path"]],
        actions=result["actions"],
    )


@router.get("/metrics")
def get_metrics():
    """Return aggregated episode metrics and trajectory records."""
    return state.trainer.get_training_metrics()
