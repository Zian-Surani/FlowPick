import React from 'react';
import type { AgentState } from '../../types/rl';
import { BentoCard } from '../bento/BentoCard';
import { Crosshair, Navigation, Compass, Activity } from 'lucide-react';

interface AgentStateCardProps {
  agentState: AgentState;
}

export const AgentStateCard: React.FC<AgentStateCardProps> = ({ agentState }) => {
  return (
    <BentoCard
      title="Agent State"
      subtitle="Sensory coordinates & discrete action vectors"
      badge="Telemetry"
      badgeColor="lavender"
    >
      <div className="grid grid-cols-2 gap-3">
        {/* Position */}
        <div className="bg-[#FAFBFD] p-3 rounded-xl border border-[#E9EEF4] flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#6C757D] font-medium mb-1">
            <Crosshair className="w-3.5 h-3.5 text-[#5941C8]" />
            <span>Position</span>
          </div>
          <div className="font-mono text-base font-bold text-[#1E2022]">
            [{agentState.position.row}, {agentState.position.col}]
          </div>
          <span className="text-[0.6875rem] text-[#868E96]">Warehouse Grid</span>
        </div>

        {/* Target */}
        <div className="bg-[#FAFBFD] p-3 rounded-xl border border-[#E9EEF4] flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#6C757D] font-medium mb-1">
            <Compass className="w-3.5 h-3.5 text-[#C05621]" />
            <span>Target Goal</span>
          </div>
          <div className="font-mono text-base font-bold text-[#1E2022]">
            {agentState.hasPackage
              ? `[${agentState.dispatch.row}, ${agentState.dispatch.col}]`
              : `[${agentState.target.row}, ${agentState.target.col}]`}
          </div>
          <span className="text-[0.6875rem] text-[#868E96]">
            {agentState.hasPackage ? 'Dispatch Dock' : 'Package Shelf'}
          </span>
        </div>

        {/* Current Action */}
        <div className="bg-[#FAFBFD] p-3 rounded-xl border border-[#E9EEF4] flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#6C757D] font-medium mb-1">
            <Activity className="w-3.5 h-3.5 text-[#2B6CB0]" />
            <span>Current Action</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`font-mono text-sm font-bold px-2 py-0.5 rounded-md ${
                agentState.currentAction
                  ? 'bg-[#E8F2FE] text-[#1D4ED8] border border-[#BFDBFE]'
                  : 'text-[#94A3B8]'
              }`}
            >
              {agentState.currentAction || 'IDLE'}
            </span>
          </div>
          <span className="text-[0.6875rem] text-[#868E96]">Q-Selected Step</span>
        </div>

        {/* Available Actions */}
        <div className="bg-[#FAFBFD] p-3 rounded-xl border border-[#E9EEF4] flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#6C757D] font-medium mb-1">
            <Navigation className="w-3.5 h-3.5 text-[#217953]" />
            <span>Available Actions</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {(agentState.availableActions || []).map((act) => (
              <span
                key={act}
                className="text-[0.625rem] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#E7F9F0] text-[#1E744E] border border-[#C4F2DB]"
              >
                {act}
              </span>
            ))}
          </div>
          <span className="text-[0.6875rem] text-[#868E96]">Collision-Filtered</span>
        </div>
      </div>
    </BentoCard>
  );
};
