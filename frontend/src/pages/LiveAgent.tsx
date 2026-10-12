import React from 'react';
import { BentoCard } from '../components/bento/BentoCard';
import { WarehouseGrid } from '../components/warehouse/WarehouseGrid';
import { AgentStateCard } from '../components/metrics/AgentStateCard';
import { CurrentEpisodeCard } from '../components/metrics/CurrentEpisodeCard';
import { RewardLogicCard } from '../components/metrics/RewardLogicCard';
import { ControlPanel } from '../components/controls/ControlPanel';
import { useAgentSimulation } from '../hooks/useAgentSimulation';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const LiveAgent: React.FC = () => {
  const {
    agentState,
    isRunning,
    simulationSpeed,
    setSimulationSpeed,
    backendConnected,
    isEvaluating,
    evaluationResult,
    start,
    pause,
    reset,
    step,
    evaluate,
  } = useAgentSimulation();

  const handleToggleSpeed = () => {
    setSimulationSpeed(simulationSpeed <= 250 ? 400 : 150);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner / Assessment Context & Connection Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-[#EFEBFD]/60 border border-[#DDD4FB] text-xs">
        <div className="flex items-center gap-2 text-[#5941C8]">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span className="font-semibold">
            Live Q-Learning Agent: Autonomous Warehouse Navigation
          </span>
        </div>
        <div className="flex items-center gap-3 text-[0.6875rem]">
          {backendConnected ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#E7F9F0] text-[#059669] border border-[#A7F3D0] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
              FastAPI Connected (Port 8000)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] font-semibold">
              <AlertCircle className="w-3 h-3" />
              Backend Offline (Check FastAPI)
            </span>
          )}
          <span className="hidden md:inline text-[#64748B]">State: <strong className="text-[#1E2022] font-mono">(row, col, cargo)</strong></span>
        </div>
      </div>

      {/* Evaluation Result Toast / Banner */}
      {evaluationResult && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#E7F9F0] border border-[#A7F3D0] text-xs text-[#065F46] animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            <span>
              <strong>Evaluation Complete:</strong> Agent executed greedy policy (ε = 0) with{' '}
              <strong>{evaluationResult.steps} steps</strong> and cumulative return of{' '}
              <strong>{evaluationResult.totalReward > 0 ? `+${evaluationResult.totalReward}` : evaluationResult.totalReward}</strong>.
            </span>
          </div>
          <span className="font-mono text-[0.6875rem] bg-white px-2 py-0.5 rounded-md border border-[#A7F3D0]">
            Result: {evaluationResult.success ? 'Delivery Succeeded' : 'Incomplete'}
          </span>
        </div>
      )}

      {/* Main Bento Grid: Large primary card on left, secondary cards on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* LARGE PRIMARY CARD: Warehouse Environment (7 cols on lg) */}
        <div className="lg:col-span-7 h-full">
          <BentoCard
            title="Warehouse Environment"
            subtitle="Autonomous picking agent operating in 6×6 spatial grid"
            badge="Live Spatial Grid"
            badgeColor="lavender"
            className="h-full min-h-[560px]"
          >
            <WarehouseGrid agentState={agentState} />
          </BentoCard>
        </div>

        {/* RIGHT / SECONDARY CARDS (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Agent State Card */}
          <AgentStateCard agentState={agentState} />

          {/* Current Episode Metrics */}
          <CurrentEpisodeCard agentState={agentState} />

          {/* Execution Controls Card */}
          <ControlPanel
            isRunning={isRunning}
            status={agentState.status}
            simulationSpeed={simulationSpeed}
            isEvaluating={isEvaluating}
            onStart={start}
            onPause={pause}
            onReset={reset}
            onStep={step}
            onToggleSpeed={handleToggleSpeed}
            onEvaluate={evaluate}
          />

          {/* Reward Logic Reference */}
          <RewardLogicCard />
        </div>

      </div>
    </div>
  );
};
