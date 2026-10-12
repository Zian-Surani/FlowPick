import React from 'react';
import type { AgentState } from '../../types/rl';
import { BentoCard } from '../bento/BentoCard';
import { Zap, TrendingUp, Layers, Footprints } from 'lucide-react';

interface CurrentEpisodeCardProps {
  agentState: AgentState;
}

export const CurrentEpisodeCard: React.FC<CurrentEpisodeCardProps> = ({ agentState }) => {
  const isPositiveReward = agentState.cumulativeReward >= 0;

  return (
    <BentoCard
      title="Current Episode"
      subtitle="Real-time episode step count & reward accumulation"
      badge={`Ep. #${agentState.episode}`}
      badgeColor="blue"
    >
      <div className="grid grid-cols-2 gap-3">
        {/* Episode */}
        <div className="bg-[#FAFBFD] p-3 rounded-xl border border-[#E9EEF4]">
          <div className="flex items-center gap-1.5 text-xs text-[#6C757D] font-medium mb-1">
            <Layers className="w-3.5 h-3.5 text-[#5941C8]" />
            <span>Episode</span>
          </div>
          <div className="font-mono text-xl font-extrabold text-[#1E2022]">
            {agentState.episode}
          </div>
          <span className="text-[0.6875rem] text-[#868E96]">Run Iteration</span>
        </div>

        {/* Step */}
        <div className="bg-[#FAFBFD] p-3 rounded-xl border border-[#E9EEF4]">
          <div className="flex items-center gap-1.5 text-xs text-[#6C757D] font-medium mb-1">
            <Footprints className="w-3.5 h-3.5 text-[#2B6CB0]" />
            <span>Step</span>
          </div>
          <div className="font-mono text-xl font-extrabold text-[#1E2022]">
            {agentState.step}
          </div>
          <span className="text-[0.6875rem] text-[#868E96]">Steps in Episode</span>
        </div>

        {/* Current Reward */}
        <div className="bg-[#FAFBFD] p-3 rounded-xl border border-[#E9EEF4]">
          <div className="flex items-center gap-1.5 text-xs text-[#6C757D] font-medium mb-1">
            <Zap className="w-3.5 h-3.5 text-[#C05621]" />
            <span>Last Step Reward</span>
          </div>
          <div
            className={`font-mono text-xl font-extrabold ${
              agentState.currentReward > 0
                ? 'text-[#059669]'
                : agentState.currentReward < 0
                ? 'text-[#DC2626]'
                : 'text-[#4B5563]'
            }`}
          >
            {agentState.currentReward > 0 ? `+${agentState.currentReward}` : agentState.currentReward}
          </div>
          <span className="text-[0.6875rem] text-[#868E96]">r(s, a)</span>
        </div>

        {/* Cumulative Reward */}
        <div className="bg-[#FAFBFD] p-3 rounded-xl border border-[#E9EEF4]">
          <div className="flex items-center gap-1.5 text-xs text-[#6C757D] font-medium mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#217953]" />
            <span>Cumulative Reward</span>
          </div>
          <div
            className={`font-mono text-xl font-extrabold ${
              isPositiveReward ? 'text-[#059669]' : 'text-[#DC2626]'
            }`}
          >
            {agentState.cumulativeReward > 0
              ? `+${agentState.cumulativeReward}`
              : agentState.cumulativeReward}
          </div>
          <span className="text-[0.6875rem] text-[#868E96]">Σ r_t Accumulated</span>
        </div>
      </div>
    </BentoCard>
  );
};
