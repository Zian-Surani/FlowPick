import React from 'react';
import { BentoCard } from '../bento/BentoCard';
import { GraduationCap, ExternalLink } from 'lucide-react';

export const ProjectTeamCard: React.FC = () => {
  return (
    <BentoCard
      title="Project Team"
      subtitle="Fundamentals of Reinforcement Learning — Task 2 Assessment"
      badge="Academic Submission"
      badgeColor="lavender"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Student 1 */}
        <div className="bg-[#FAFBFD] p-4 rounded-xl border border-[#E9EEF4] flex items-center justify-between gap-3.5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#EFEBFD] border border-[#DDD4FB] flex items-center justify-center text-[#5941C8] shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1E2022]">
                Zian Rajeshkumar Surani
              </h4>
              <p className="font-mono text-xs font-semibold text-[#5941C8] mt-0.5">
                RA2311026050085
              </p>
              <span className="text-[0.6875rem] text-[#6C757D]">
                Lead RL Agent & System Architecture
              </span>
            </div>
          </div>
          <a
            href="https://github.com/Zian-Surani"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[0.6875rem] font-medium text-[#5941C8] hover:underline bg-[#F5F2FD] px-2.5 py-1 rounded-lg border border-[#E7E0FD] shrink-0"
          >
            GitHub <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Student 2 */}
        <div className="bg-[#FAFBFD] p-4 rounded-xl border border-[#E9EEF4] flex items-center justify-between gap-3.5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#E8F2FE] border border-[#CCE2FC] flex items-center justify-center text-[#2563EB] shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1E2022]">
                Vaishnavi Soni
              </h4>
              <p className="font-mono text-xs font-semibold text-[#2563EB] mt-0.5">
                RA2311026050070
              </p>
              <span className="text-[0.6875rem] text-[#6C757D]">
                RL Formulation & Metrics Evaluation
              </span>
            </div>
          </div>
          <a
            href="https://github.com/Vaishnavi-Soni-12"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[0.6875rem] font-medium text-[#2563EB] hover:underline bg-[#EFF6FF] px-2.5 py-1 rounded-lg border border-[#DBEAFE] shrink-0"
          >
            GitHub <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </BentoCard>
  );
};
