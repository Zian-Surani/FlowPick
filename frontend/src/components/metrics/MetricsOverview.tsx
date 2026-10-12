import React from 'react';
import type { TrainingMetrics } from '../../types/rl';
import { Award, Zap, CheckCircle2, Footprints } from 'lucide-react';

interface MetricsOverviewProps {
  metrics: TrainingMetrics;
  totalConfiguredEpisodes: number;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  metrics,
  totalConfiguredEpisodes,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
      {/* Episodes */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8EAED] shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-[#6C757D] font-medium mb-1">
          <span>Episodes</span>
          <span className="p-1 rounded-md bg-[#EFEBFD] text-[#5941C8]">
            <Zap className="w-3.5 h-3.5" />
          </span>
        </div>
        <div>
          <div className="font-mono text-2xl font-bold text-[#1E2022]">
            {metrics.episode}
            <span className="text-sm font-normal text-[#94A3B8]"> / {totalConfiguredEpisodes}</span>
          </div>
          <p className="text-[0.6875rem] text-[#868E96] mt-0.5">Completed Cycles</p>
        </div>
      </div>

      {/* Average Reward */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8EAED] shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-[#6C757D] font-medium mb-1">
          <span>Average Reward</span>
          <span className="p-1 rounded-md bg-[#E8F2FE] text-[#2563EB]">
            <Award className="w-3.5 h-3.5" />
          </span>
        </div>
        <div>
          <div
            className={`font-mono text-2xl font-bold ${
              metrics.averageReward >= 0 ? 'text-[#059669]' : 'text-[#DC2626]'
            }`}
          >
            {metrics.averageReward >= 0 ? `+${metrics.averageReward}` : metrics.averageReward}
          </div>
          <p className="text-[0.6875rem] text-[#868E96] mt-0.5">Mean Cumulative Return</p>
        </div>
      </div>

      {/* Success Rate */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8EAED] shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-[#6C757D] font-medium mb-1">
          <span>Success Rate</span>
          <span className="p-1 rounded-md bg-[#E7F9F0] text-[#1E744E]">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </span>
        </div>
        <div>
          <div className="font-mono text-2xl font-bold text-[#059669]">
            {metrics.successRate}%
          </div>
          <p className="text-[0.6875rem] text-[#868E96] mt-0.5">Delivery Dock Arrival</p>
        </div>
      </div>

      {/* Average Steps */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8EAED] shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-[#6C757D] font-medium mb-1">
          <span>Average Steps</span>
          <span className="p-1 rounded-md bg-[#FFF0E6] text-[#C05621]">
            <Footprints className="w-3.5 h-3.5" />
          </span>
        </div>
        <div>
          <div className="font-mono text-2xl font-bold text-[#1E2022]">
            {metrics.averageSteps}
          </div>
          <p className="text-[0.6875rem] text-[#868E96] mt-0.5">Steps to Goal / Ep</p>
        </div>
      </div>
    </div>
  );
};
