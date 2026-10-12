import React from 'react';
import { BentoCard } from '../bento/BentoCard';
import { Play, Pause, RotateCcw, StepForward, Gauge, Sparkles } from 'lucide-react';
import type { AgentStatus } from '../../types/rl';

interface ControlPanelProps {
  isRunning: boolean;
  status: AgentStatus;
  simulationSpeed: number;
  isEvaluating?: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onStep: () => void;
  onToggleSpeed: () => void;
  onEvaluate?: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isRunning,
  status,
  simulationSpeed,
  isEvaluating = false,
  onStart,
  onPause,
  onReset,
  onStep,
  onToggleSpeed,
  onEvaluate,
}) => {
  const getStatusBadge = () => {
    const s = String(status).toLowerCase();
    if (s === 'training') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E8F2FE] text-[#1D4ED8] border border-[#BFDBFE]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-ping" />
          Training Active
        </span>
      );
    }
    if (s === 'completed' || s === 'complete') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E7F9F0] text-[#059669] border border-[#A7F3D0]">
          ● Complete
        </span>
      );
    }
    if (s === 'paused') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF8E3] text-[#975A16] border border-[#FCE5A4]">
          ● Paused
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]">
        ● Ready
      </span>
    );
  };

  return (
    <BentoCard
      title="Controls"
      subtitle="Execution loop control & live Q-policy triggers"
      badge="Simulation"
      badgeColor="peach"
    >
      <div className="flex flex-col justify-between h-full space-y-3.5">
        {/* Status Row */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAFBFD] border border-[#E9EEF4]">
          <span className="text-xs font-medium text-[#64748B]">Backend State</span>
          <div>{getStatusBadge()}</div>
        </div>

        {/* Primary Action Buttons: Start / Pause & Reset */}
        <div className="grid grid-cols-2 gap-2.5">
          {!isRunning ? (
            <button
              id="btn-start-simulation"
              onClick={onStart}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#5941C8] hover:bg-[#4833AB] shadow-xs transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Training</span>
            </button>
          ) : (
            <button
              id="btn-pause-simulation"
              onClick={onPause}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-[#1E2022] bg-[#FEF08A] hover:bg-[#FDE047] border border-[#FACC15] shadow-xs transition-all cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </button>
          )}

          <button
            id="btn-reset-simulation"
            onClick={onReset}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-[#4B5563] bg-[#F3F4F6] hover:bg-[#E5E7EB] border border-[#E5E7EB] transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Secondary Row: Single Step & Evaluation Mode */}
        <div className="grid grid-cols-2 gap-2.5 pt-0.5">
          <button
            id="btn-step-forward"
            onClick={onStep}
            disabled={isRunning}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-[#334155] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <StepForward className="w-3.5 h-3.5 text-[#5941C8]" />
            <span>Step Forward</span>
          </button>

          {onEvaluate && (
            <button
              id="btn-run-evaluation"
              onClick={onEvaluate}
              disabled={isRunning || isEvaluating}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-[#1E744E] bg-[#E7F9F0] border border-[#C4F2DB] hover:bg-[#D3F5E3] disabled:opacity-50 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{isEvaluating ? 'Evaluating...' : 'Run Evaluation'}</span>
            </button>
          )}
        </div>

        {/* Speed Adjustment */}
        <div className="flex items-center justify-between text-xs text-[#64748B] pt-1 border-t border-[#F1F3F5]">
          <span className="flex items-center gap-1">
            <Gauge className="w-3 h-3 text-[#2563EB]" />
            Playback Rate
          </span>
          <button
            id="btn-toggle-speed"
            onClick={onToggleSpeed}
            className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
          >
            {simulationSpeed <= 250 ? 'Fast (100ms)' : 'Normal (350ms)'}
          </button>
        </div>
      </div>
    </BentoCard>
  );
};
