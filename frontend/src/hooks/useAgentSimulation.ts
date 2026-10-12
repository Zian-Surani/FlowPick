import { useState, useEffect, useRef, useCallback } from 'react';
import type { AgentState, Action, RewardEvent, EvaluationResult } from '../types/rl';
import { api } from '../services/api';
import { DEFAULT_WAREHOUSE_CONFIG } from '../data/mockData';

export function useAgentSimulation() {
  const env = DEFAULT_WAREHOUSE_CONFIG;

  const [agentState, setAgentState] = useState<AgentState>({
    position: { ...env.agentPosition },
    target: { ...env.target },
    dispatch: { ...env.dispatch },
    hasPackage: false,
    availableActions: ['UP', 'RIGHT'],
    currentAction: null,
    currentReward: 0,
    cumulativeReward: 0,
    episode: 1,
    step: 0,
    status: 'idle',
    path: [{ ...env.agentPosition }],
  });

  const [isRunning, setIsRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(350);
  const [rewardFeed, setRewardFeed] = useState<RewardEvent[]>([]);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [backendConnected, setBackendConnected] = useState<boolean>(true);
  const pollTimerRef = useRef<number | null>(null);

  // Synchronize state with real backend
  const fetchBackendAgent = useCallback(async () => {
    try {
      const data = await api.getAgentState();
      setAgentState({
        position: data.position,
        target: data.target,
        dispatch: data.dispatch,
        hasPackage: data.hasPackage,
        availableActions: data.availableActions as Action[],
        currentAction: data.currentAction as Action | null,
        currentReward: data.currentReward,
        cumulativeReward: data.cumulativeReward,
        episode: data.episode,
        step: data.step,
        status: data.status,
        path: data.path,
      });

      const active = data.status === 'training';
      setIsRunning(active);
      setBackendConnected(true);
    } catch {
      setBackendConnected(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchBackendAgent();
  }, [fetchBackendAgent]);

  // Polling loop when running/training
  useEffect(() => {
    if (isRunning) {
      pollTimerRef.current = window.setInterval(() => {
        fetchBackendAgent();
      }, simulationSpeed);
    } else if (pollTimerRef.current !== null) {
      window.clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }

    return () => {
      if (pollTimerRef.current !== null) {
        window.clearInterval(pollTimerRef.current);
      }
    };
  }, [isRunning, simulationSpeed, fetchBackendAgent]);

  // Controls wired to FastAPI backend
  const start = useCallback(async () => {
    try {
      setIsRunning(true);
      await api.startTraining({
        episodes: 250,
        learningRate: 0.1,
        discountFactor: 0.95,
        epsilon: 0.2,
        simulationSpeedMs: simulationSpeed <= 250 ? 10 : 40,
      });
      await fetchBackendAgent();
    } catch (err) {
      console.error('Error starting backend training:', err);
      setIsRunning(false);
    }
  }, [simulationSpeed, fetchBackendAgent]);

  const pause = useCallback(async () => {
    try {
      setIsRunning(false);
      await api.pauseTraining();
      await fetchBackendAgent();
    } catch (err) {
      console.error('Error pausing backend training:', err);
    }
  }, [fetchBackendAgent]);

  const reset = useCallback(async () => {
    try {
      setIsRunning(false);
      setIsEvaluating(false);
      setEvaluationResult(null);
      await api.resetTraining();
      await fetchBackendAgent();
      setRewardFeed([]);
    } catch (err) {
      console.error('Error resetting backend training:', err);
    }
  }, [fetchBackendAgent]);

  const step = useCallback(async () => {
    try {
      const updated = await api.stepSingle();
      setAgentState({
        position: updated.position,
        target: updated.target,
        dispatch: updated.dispatch,
        hasPackage: updated.hasPackage,
        availableActions: updated.availableActions as Action[],
        currentAction: updated.currentAction as Action | null,
        currentReward: updated.currentReward,
        cumulativeReward: updated.cumulativeReward,
        episode: updated.episode,
        step: updated.step,
        status: updated.status,
        path: updated.path,
      });
    } catch (err) {
      console.error('Error executing single step on backend:', err);
    }
  }, []);

  const evaluate = useCallback(async () => {
    try {
      setIsEvaluating(true);
      const evalRes = await api.runEvaluation();
      setEvaluationResult(evalRes);
      await fetchBackendAgent();
      setIsEvaluating(false);
    } catch (err) {
      console.error('Error running evaluation on backend:', err);
      setIsEvaluating(false);
    }
  }, [fetchBackendAgent]);

  return {
    agentState,
    isRunning,
    simulationSpeed,
    setSimulationSpeed,
    rewardFeed,
    backendConnected,
    isEvaluating,
    evaluationResult,
    start,
    pause,
    reset,
    step,
    evaluate,
    refresh: fetchBackendAgent,
  };
}
