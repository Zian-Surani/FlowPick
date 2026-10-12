import type { EnvironmentState, TrainingConfig, TrainingMetrics, EpisodeResult } from '../types/rl';

export const DEFAULT_WAREHOUSE_CONFIG: EnvironmentState = {
  rows: 6,
  cols: 6,
  shelves: [
    { row: 1, col: 1 },
    { row: 1, col: 2 },
    { row: 1, col: 4 },
    { row: 3, col: 1 },
    { row: 3, col: 3 },
    { row: 3, col: 4 },
    { row: 4, col: 1 },
  ],
  target: { row: 0, col: 4 }, // Package location
  dispatch: { row: 5, col: 5 }, // Delivery dispatch dock
  agentPosition: { row: 5, col: 0 }, // Agent starting bay
  hasPackage: false,
  stepCount: 0,
  maxSteps: 50,
};

export const REWARD_RULES = [
  {
    type: 'delivery',
    value: '+100',
    name: 'Successful Delivery',
    desc: 'Package retrieved and brought to dispatch zone',
    color: 'mint',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badge: 'text-emerald-700 bg-emerald-100',
  },
  {
    type: 'movement',
    value: '-1',
    name: 'Movement Step',
    desc: 'Cost incurred per normal valid transition',
    color: 'blue',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'text-blue-700 bg-blue-100',
  },
  {
    type: 'collision',
    value: '-10',
    name: 'Invalid / Collision',
    desc: 'Attempting wall collision or shelf impact',
    color: 'peach',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'text-amber-800 bg-amber-100',
  },
  {
    type: 'delay',
    value: '-5',
    name: 'Unnecessary Delay',
    desc: 'Looping or repeated inefficient transitions',
    color: 'lavender',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    badge: 'text-purple-700 bg-purple-100',
  },
];

export const DEFAULT_TRAINING_CONFIG: TrainingConfig = {
  episodes: 250,
  learningRate: 0.1, // α
  discountFactor: 0.95, // γ
  epsilon: 0.15, // ε
  simulationSpeedMs: 50,
};

// Realistic mock training episodes generation for demonstration
export function generateMockTrainingData(count: number = 100): {
  history: EpisodeResult[];
  latestMetrics: TrainingMetrics;
} {
  const history: EpisodeResult[] = [];
  let cumulativeRewardSum = 0;
  let successfulEpisodes = 0;
  let stepSum = 0;

  for (let i = 1; i <= count; i++) {
    // Sigmoid learning progression curve + random noise
    const progress = i / count;
    const learningFactor = 1 / (1 + Math.exp(-6 * (progress - 0.35)));
    
    // As learning increases: reward rises from -70 to +85, steps fall from 42 to 11
    const baseReward = -75 + learningFactor * 160;
    const noise = (Math.sin(i * 0.4) * 8 + (Math.random() - 0.5) * 12);
    const reward = Math.round(Math.min(95, Math.max(-100, baseReward + noise)));
    
    const steps = Math.max(9, Math.round(44 - learningFactor * 32 + (Math.random() - 0.5) * 4));
    const success = reward > 20 || (progress > 0.4 && Math.random() < progress * 0.95);
    const epsilon = Math.max(0.05, 1.0 - progress * 0.9);

    cumulativeRewardSum += reward;
    if (success) successfulEpisodes++;
    stepSum += steps;

    history.push({
      episode: i,
      steps,
      totalReward: reward,
      success,
      epsilon: Number(epsilon.toFixed(2)),
    });
  }

  const latestMetrics: TrainingMetrics = {
    episode: count,
    reward: history[history.length - 1].totalReward,
    averageReward: Math.round(cumulativeRewardSum / count),
    successRate: Math.round((successfulEpisodes / count) * 100),
    averageSteps: Number((stepSum / count).toFixed(1)),
  };

  return { history, latestMetrics };
}
