import React from 'react';
import { StateActionDiagram } from '../components/rl/StateActionDiagram';
import { AlgorithmCard } from '../components/rl/AlgorithmCard';
import { ProjectTeamCard } from '../components/rl/ProjectTeamCard';
import { Brain } from 'lucide-react';

export const RLModel: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-[#E7F9F0]/70 border border-[#C4F2DB] text-xs">
        <div className="flex items-center gap-2 text-[#1E744E]">
          <Brain className="w-4 h-4 shrink-0" />
          <span className="font-semibold">
            RL Technical Formulation & Theoretical Architecture
          </span>
        </div>
        <div className="flex items-center gap-2 text-[0.6875rem] text-[#64748B]">
          <span>Formalism: <strong className="text-[#1E2022]">Discrete MDP</strong></span>
          <span>•</span>
          <span>Convergence Guarantee: <strong className="text-[#1E2022]">Q(s,a) → Q*(s,a) as t → ∞</strong></span>
        </div>
      </div>

      {/* Main Visual: Observe State -> Select Action -> Receive Reward -> Update Q-Value -> Next State */}
      <StateActionDiagram />

      {/* Q-Learning Bellman Optimality Equation & 6 Bento Breakdown Cards */}
      <AlgorithmCard />

      {/* Project Team Card */}
      <ProjectTeamCard />
    </div>
  );
};
