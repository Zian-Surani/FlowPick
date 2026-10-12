import React from 'react';
import { BentoCard } from '../bento/BentoCard';
import type { TrainingConfig } from '../../types/rl';
import { Play, Pause, RotateCcw, Activity, Sparkles } from 'lucide-react';

interface TrainingConfigPanelProps {
  config: TrainingConfig;
  onChangeConfig: (newConfig: TrainingConfig) => void;
  isTraining: boolean;
  currentEpisode: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const TrainingConfigPanel: React.FC<TrainingConfigPanelProps> = ({
  config,
  onChangeConfig,
  isTraining,
  currentEpisode,
  onStart,
  onPause,
  onReset,
}) => {
  const progressPercent = Math.min(100, Math.round((currentEpisode / config.episodes) * 100));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Hyperparameters Config Card */}
      <BentoCard
        title="Training Configuration"
        subtitle="Q-Learning hyperparameters & environment limits"
        badge="Hyperparameters"
        badgeColor="lavender"
        className="md:col-span-2"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Episodes */}
          <div className="bg-[#FAFBFD] p-3 rounded-xl border border-[#E9EEF4]">
            <label className="block text-[0.6875rem] font-semibold text-[#6C757D] uppercase tracking-wider mb-1">
              Episodes
            </label>
            <input
              type="number"
              min="50"
              max="500"
              step="25"
              value={config.episodes}
              disabled={isTraining}
              onChange={(e) =>
                onChangeConfig({ ...config, episodes: Number(e.target.value) || 200 })
              }
              className="w-full font-mono font-bold text-sm bg-white border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-[#1E2022] focus:outline-none focus:border-[#8B5CF6]"
            />
            <span className="text-[0.625rem] text-[#868E96] mt-1 block">Iterations</span>
          </div>

          {/* Learning Rate α */}
          <div className="bg-[#FAFBFD] p-3 rounded-xl border border-[#E9EEF4]">
            <label className="block text-[0.6875rem] font-semibold text-[#6C757D] uppercase tracking-wider mb-1">
              Learning Rate α
            </label>
            <input
              type="number"
              min="0.01"
              max="0.9"
              step="0.01"
              value={config.learningRate}
              disabled={isTraining}
              onChange={(e) =>
                onChangeConfig({ ...config, learningRate: Number(e.target.value) || 0.1 })
              }
              className="w-full font-mono font-bold text-sm bg-white border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-[#1E2022] focus:outline-none focus:border-[#8B5CF6]"
            />
            <span className="text-[0.625rem] text-[#868E96] mt-1 block">Step size weight</span>
          </div>

          {/* Discount Factor γ */}
          <div className="bg-[#FAFBFD] p-3 rounded-xl border border-[#E9EEF4]">
            <label className="block text-[0.6875rem] font-semibold text-[#6C757D] uppercase tracking-wider mb-1">
              Discount Factor γ
            </label>
            <input
              type="number"
              min="0.1"
              max="0.99"
              step="0.01"
              value={config.discountFactor}
              disabled={isTraining}
              onChange={(e) =>
                onChangeConfig({ ...config, discountFactor: Number(e.target.value) || 0.95 })
              }
              className="w-full font-mono font-bold text-sm bg-white border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-[#1E2022] focus:outline-none focus:border-[#8B5CF6]"
            />
            <span className="text-[0.625rem] text-[#868E96] mt-1 block">Future return value</span>
          </div>

          {/* Exploration ε */}
          <div className="bg-[#FAFBFD] p-3 rounded-xl border border-[#E9EEF4]">
            <label className="block text-[0.6875rem] font-semibold text-[#6C757D] uppercase tracking-wider mb-1">
              Exploration ε
            </label>
            <input
              type="number"
              min="0.01"
              max="0.8"
              step="0.01"
              value={config.epsilon}
              disabled={isTraining}
              onChange={(e) =>
                onChangeConfig({ ...config, epsilon: Number(e.target.value) || 0.15 })
              }
              className="w-full font-mono font-bold text-sm bg-white border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-[#1E2022] focus:outline-none focus:border-[#8B5CF6]"
            />
            <span className="text-[0.625rem] text-[#868E96] mt-1 block">ε-greedy factor</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[#F1F3F5]">
          {!isTraining ? (
            <button
              id="btn-start-training"
              onClick={onStart}
              className="flex items-center gap-2 py-2 px-5 rounded-xl text-xs font-bold text-white bg-[#5941C8] hover:bg-[#4833AB] shadow-xs transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Training</span>
            </button>
          ) : (
            <button
              id="btn-pause-training"
              onClick={onPause}
              className="flex items-center gap-2 py-2 px-5 rounded-xl text-xs font-bold text-[#1E2022] bg-[#FEF08A] hover:bg-[#FDE047] border border-[#FACC15] shadow-xs transition-all cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause Training</span>
            </button>
          )}

          <button
            id="btn-reset-training"
            onClick={onReset}
            className="flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold text-[#4B5563] bg-[#F3F4F6] hover:bg-[#E5E7EB] border border-[#E5E7EB] transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <span className="ml-auto text-xs text-[#64748B] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>{isTraining ? 'Simulating Learning...' : 'Ready to Run'}</span>
          </span>
        </div>
      </BentoCard>

      {/* Learning Progress Card */}
      <BentoCard
        title="Learning Progress"
        subtitle="Policy convergence & exploration status"
        badge={`${progressPercent}%`}
        badgeColor="mint"
      >
        <div className="flex flex-col justify-between h-full space-y-3">
          <div>
            <div className="flex justify-between text-xs font-medium text-[#4B5563] mb-1.5">
              <span>Convergence Cycle</span>
              <span className="font-mono font-bold text-[#1E2022]">
                {currentEpisode} / {config.episodes}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0]">
              <div
                className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#10B981] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#F1F3F5]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748B]">Strategy Mode:</span>
              <span className="font-semibold text-[#1E2022]">
                {progressPercent < 35
                  ? 'High Exploration (ε-decay)'
                  : progressPercent < 75
                  ? 'Policy Exploitation'
                  : 'Near-Optimal Converged'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748B]">Policy Quality:</span>
              <span className="inline-flex items-center gap-1 font-semibold text-[#059669]">
                <Sparkles className="w-3 h-3" />
                {progressPercent > 70 ? 'Converged Optimal Policy' : 'Learning Navigation'}
              </span>
            </div>
          </div>
        </div>
      </BentoCard>
    </div>
  );
};
