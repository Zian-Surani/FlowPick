import React from 'react';
import { BentoCard } from '../components/bento/BentoCard';
import { LearningChart } from '../components/charts/LearningChart';
import { MetricsOverview } from '../components/metrics/MetricsOverview';
import { TrainingConfigPanel } from '../components/controls/TrainingConfigPanel';
import { useTrainingSimulation } from '../hooks/useTrainingSimulation';
import { TrendingUp, BarChart2, AlertCircle } from 'lucide-react';

export const Training: React.FC = () => {
  const {
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
  } = useTrainingSimulation();

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-[#E8F2FE]/70 border border-[#CCE2FC] text-xs">
        <div className="flex items-center gap-2 text-[#2563EB]">
          <TrendingUp className="w-4 h-4 shrink-0" />
          <span className="font-semibold">
            Empirical Learning Evidence: Real Q-Table Convergence & Return Maximization
          </span>
        </div>
        <div className="flex items-center gap-3 text-[0.6875rem]">
          {backendConnected ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#E7F9F0] text-[#059669] border border-[#A7F3D0] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
              Backend Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] font-semibold">
              <AlertCircle className="w-3 h-3" />
              Backend Offline
            </span>
          )}
          <span className="hidden md:inline text-[#64748B]">
            Algorithm: <strong className="text-[#1E2022]">Q-Learning (Off-Policy TD)</strong>
          </span>
        </div>
      </div>

      {/* Supporting Metric Cards */}
      <MetricsOverview
        metrics={metrics}
        totalConfiguredEpisodes={config.episodes}
      />

      {/* PRIMARY CARD: Learning Curve */}
      <BentoCard
        title="Learning Curve: Cumulative Reward vs. Episode"
        subtitle="Progression of cumulative returns as the Q-table policy converges toward shortest delivery trajectories"
        badge="Reward vs Episode"
        badgeColor="lavender"
        action={
          <div className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
            <BarChart2 className="w-3.5 h-3.5 text-[#5941C8]" />
            <span>{history.length} Episodes Sampled</span>
          </div>
        }
      >
        <LearningChart data={history} height={290} />
      </BentoCard>

      {/* Training Configuration & Learning Progress Bento Cards */}
      <TrainingConfigPanel
        config={config}
        onChangeConfig={setConfig}
        isTraining={isTraining}
        currentEpisode={currentEpisode}
        onStart={startTraining}
        onPause={pauseTraining}
        onReset={resetTraining}
      />
    </div>
  );
};
