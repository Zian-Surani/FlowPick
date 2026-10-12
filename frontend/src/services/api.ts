import type { 
  EnvironmentState, 
  AgentState, 
  TrainingMetrics, 
  TrainingConfig, 
  EpisodeResult,
  EvaluationResult,
  TrainingStatusResponse
} from '../types/rl';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class FlowPickBackendClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status} from ${endpoint}: ${errorText}`);
      }

      return (await response.json()) as T;
    } catch (err) {
      console.warn(`[FlowPick API Warning] ${endpoint}:`, err);
      throw err;
    }
  }

  async getHealth(): Promise<{ status: string; version: string }> {
    return this.request<{ status: string; version: string }>('/api/health');
  }

  async getEnvironmentState(): Promise<EnvironmentState> {
    return this.request<EnvironmentState>('/api/environment');
  }

  private normalizeAgentState(data: any): AgentState {
    return {
      position: data.position ?? { row: 5, col: 0 },
      target: data.target ?? { row: 0, col: 4 },
      dispatch: data.dispatch ?? { row: 5, col: 5 },
      hasPackage: Boolean(data.hasPackage ?? data.has_package),
      availableActions: data.availableActions ?? data.available_actions ?? ['UP', 'RIGHT'],
      currentAction: data.currentAction ?? data.current_action ?? null,
      currentReward: Number(data.currentReward ?? data.current_reward ?? 0),
      cumulativeReward: Number(data.cumulativeReward ?? data.cumulative_reward ?? 0),
      episode: Number(data.episode ?? 1),
      step: Number(data.step ?? 0),
      status: data.status ?? 'idle',
      path: data.path ?? [],
    };
  }

  async getAgentState(): Promise<AgentState> {
    const data = await this.request<any>('/api/agent');
    return this.normalizeAgentState(data);
  }

  async getTrainingStatus(): Promise<TrainingStatusResponse> {
    const res = await this.request<any>('/api/training/status');
    const normalizedHistory: EpisodeResult[] = (res.history || []).map((h: any) => ({
      episode: h.episode,
      steps: h.steps,
      totalReward: h.total_reward ?? h.totalReward ?? 0,
      success: h.success,
      epsilon: h.epsilon ?? 0.05,
    }));

    return {
      status: res.status,
      episode: res.episode,
      totalEpisodes: res.total_episodes ?? res.totalEpisodes ?? 200,
      currentReward: res.current_reward ?? res.currentReward ?? 0,
      cumulativeReward: res.cumulative_reward ?? res.cumulativeReward ?? 0,
      successRate: res.success_rate ?? res.successRate ?? 0,
      averageSteps: res.average_steps ?? res.averageSteps ?? 0,
      averageReward: res.average_reward ?? res.averageReward ?? 0,
      history: normalizedHistory,
    };
  }

  async startTraining(config: TrainingConfig): Promise<{ status: string }> {
    return this.request<{ status: string }>('/api/training/start', {
      method: 'POST',
      body: JSON.stringify({
        episodes: config.episodes,
        learning_rate: config.learningRate,
        discount_factor: config.discountFactor,
        epsilon: config.epsilon,
        simulation_speed_ms: config.simulationSpeedMs,
      }),
    });
  }

  async pauseTraining(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/api/training/pause', {
      method: 'POST',
    });
  }

  async resetTraining(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/api/training/reset', {
      method: 'POST',
    });
  }

  async resetEpisode(): Promise<AgentState> {
    const data = await this.request<any>('/api/episode/reset', {
      method: 'POST',
    });
    return this.normalizeAgentState(data);
  }

  async stepSingle(): Promise<AgentState> {
    const data = await this.request<any>('/api/agent/step', {
      method: 'POST',
    });
    return this.normalizeAgentState(data);
  }

  async runEvaluation(): Promise<EvaluationResult> {
    const res = await this.request<any>('/api/evaluation/run', {
      method: 'POST',
    });
    return {
      success: res.success,
      steps: res.steps,
      totalReward: res.total_reward ?? res.totalReward ?? 0,
      path: res.path || [],
      actions: res.actions || [],
    };
  }

  async getMetrics(): Promise<{ history: EpisodeResult[]; metrics: TrainingMetrics }> {
    const res = await this.getTrainingStatus();
    return {
      history: res.history,
      metrics: {
        episode: res.episode,
        reward: res.currentReward,
        averageReward: res.averageReward,
        successRate: res.successRate,
        averageSteps: res.averageSteps,
      },
    };
  }
}

// Export singleton API service instance connected to FastAPI backend
export const api = new FlowPickBackendClient();
