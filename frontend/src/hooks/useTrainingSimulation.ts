import { useState, useEffect, useRef, useCallback } from 'react';
import type { TrainingConfig, TrainingMetrics, EpisodeResult } from '../types/rl';
import { api } from '../services/api';
import { DEFAULT_TRAINING_CONFIG } from '../data/mockData';

export function useTrainingSimulation() {
  const [config, setConfig] = useState<TrainingConfig>({ ...DEFAULT_TRAINING_CONFIG });
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [currentEpisode, setCurrentEpisode] = useState<number>(1);
  const [history, setHistory] = useState<EpisodeResult[]>([]);
  const [metrics, setMetrics] = useState<TrainingMetrics>({
    episode: 1,
    reward: 0,
    averageReward: 0,
    successRate: 0,
    averageSteps: 0,
  });
  const [backendConnected, setBackendConnected] = useState<boolean>(true);
  const pollTimerRef = useRef<number | null>(null);

  // Fetch real training telemetry from FastAPI backend
  const fetchStatus = useCallback(async () => {
    try {
      const data = await api.getTrainingStatus();
      setCurrentEpisode(data.episode);
      setHistory(data.history);
      setMetrics({
        episode: data.episode,
        reward: data.currentReward,
        averageReward: data.averageReward,
        successRate: data.successRate,
        averageSteps: data.averageSteps,
      });

      const active = data.status === 'training';
      setIsTraining(active);
      setBackendConnected(true);
    } catch {
      setBackendConnected(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Polling loop during training
  useEffect(() => {
    if (isTraining) {
      pollTimerRef.current = window.setInterval(() => {
        fetchStatus();
      }, 350);
    } else if (pollTimerRef.current !== null) {
      window.clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }

    return () => {
      if (pollTimerRef.current !== null) {
        window.clearInterval(pollTimerRef.current);
      }
    };
  }, [isTraining, fetchStatus]);

  const startTraining = useCallback(async () => {
    try {
      setIsTraining(true);
      await api.startTraining(config);
      await fetchStatus();
    } catch (err) {
      console.error('Error starting training on backend:', err);
      setIsTraining(false);
    }
  }, [config, fetchStatus]);

  const pauseTraining = useCallback(async () => {
    try {
      setIsTraining(false);
      await api.pauseTraining();
      await fetchStatus();
    } catch (err) {
      console.error('Error pausing training on backend:', err);
    }
  }, [fetchStatus]);

  const resetTraining = useCallback(async () => {
    try {
      setIsTraining(false);
      await api.resetTraining();
      await fetchStatus();
    } catch (err) {
      console.error('Error resetting training on backend:', err);
    }
  }, [fetchStatus]);

  return {
    config,
    setConfig,
    isTraining,
    currentEpisode,
    history,
    metrics,
    backendConnected,
    startTraining,
    pauseTraining,
    resetTraining,
    refresh: fetchStatus,
  };
}
