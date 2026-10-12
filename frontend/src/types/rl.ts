export type Action = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface GridCoord {
  row: number;
  col: number;
}

export type CellType = 'empty' | 'shelf' | 'agent' | 'target' | 'dispatch' | 'path';

export type AgentStatus =
  | 'idle'
  | 'Ready'
  | 'training'
  | 'Training'
  | 'paused'
  | 'completed'
  | 'Complete'
  | 'Delivered'
  | 'Collided';

export interface AgentState {
  position: GridCoord;
  target: GridCoord;
  dispatch: GridCoord;
  hasPackage: boolean;
  availableActions: Action[];
  currentAction: Action | null;
  currentReward: number;
  cumulativeReward: number;
  episode: number;
  step: number;
  status: AgentStatus;
  path: GridCoord[];
}

export interface EnvironmentState {
  rows: number;
  cols: number;
  shelves: GridCoord[];
  target: GridCoord;
  dispatch: GridCoord;
  agentPosition: GridCoord;
  hasPackage: boolean;
  stepCount: number;
  maxSteps: number;
  path?: GridCoord[];
}

export interface RewardEvent {
  type: 'delivery' | 'movement' | 'collision' | 'delay';
  value: number;
  label: string;
  timestamp: number;
}

export interface TrainingMetrics {
  episode: number;
  reward: number;
  averageReward: number;
  successRate: number;
  averageSteps: number;
}

export interface EpisodeResult {
  episode: number;
  steps: number;
  totalReward: number;
  success: boolean;
  epsilon: number;
}

export interface TrainingConfig {
  episodes: number;
  learningRate: number; // α
  discountFactor: number; // γ
  epsilon: number; // ε
  simulationSpeedMs: number;
}

export interface EvaluationResult {
  success: boolean;
  steps: number;
  totalReward: number;
  path: GridCoord[];
  actions: string[];
}

export interface TrainingStatusResponse {
  status: string;
  episode: number;
  totalEpisodes: number;
  currentReward: number;
  cumulativeReward: number;
  successRate: number;
  averageSteps: number;
  averageReward: number;
  history: EpisodeResult[];
}
