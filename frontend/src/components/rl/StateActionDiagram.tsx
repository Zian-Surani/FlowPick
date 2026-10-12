import React from 'react';
import { ArrowRight, Eye, MousePointerClick, Gift, Cpu, FastForward } from 'lucide-react';

export const StateActionDiagram: React.FC = () => {
  const steps = [
    {
      label: 'OBSERVE STATE',
      desc: 'Grid coord [r, c] + Package held flag',
      icon: <Eye className="w-4 h-4 text-[#5941C8]" />,
      bg: 'bg-[#EFEBFD]',
      border: 'border-[#DDD4FB]',
    },
    {
      label: 'SELECT ACTION',
      desc: 'ε-Greedy: argmax_a Q(s, a)',
      icon: <MousePointerClick className="w-4 h-4 text-[#2563EB]" />,
      bg: 'bg-[#E8F2FE]',
      border: 'border-[#CCE2FC]',
    },
    {
      label: 'RECEIVE REWARD',
      desc: 'r ∈ {+100, -1, -10, -5}',
      icon: <Gift className="w-4 h-4 text-[#059669]" />,
      bg: 'bg-[#E7F9F0]',
      border: 'border-[#C4F2DB]',
    },
    {
      label: 'UPDATE Q-VALUE',
      desc: 'Temporal Difference Bellman error',
      icon: <Cpu className="w-4 h-4 text-[#C05621]" />,
      bg: 'bg-[#FFF0E6]',
      border: 'border-[#FBDBC6]',
    },
    {
      label: 'NEXT STATE',
      desc: "Transition to s' and repeat cycle",
      icon: <FastForward className="w-4 h-4 text-[#975A16]" />,
      bg: 'bg-[#FEF8E3]',
      border: 'border-[#FCE5A4]',
    },
  ];

  return (
    <div className="w-full bg-[#FAFBFD] p-5 rounded-2xl border border-[#E9EEF4] shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#495057]">
          Reinforcement Learning Interaction Cycle
        </h4>
        <span className="text-[0.6875rem] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#EFEBFD] text-[#5941C8] border border-[#DDD4FB]">
          Markov Decision Process (MDP)
        </span>
      </div>

      {/* Responsive Flow: horizontal on md+, vertical on small */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-2.5">
        {steps.map((item, index) => (
          <React.Fragment key={item.label}>
            <div
              className={`flex-1 w-full p-3 rounded-xl border ${item.bg} ${item.border} shadow-xs flex flex-col items-center text-center`}
            >
              <div className="p-2 rounded-xl bg-white shadow-xs mb-2">
                {item.icon}
              </div>
              <span className="text-xs font-bold text-[#1E2022] tracking-tight mb-1">
                {item.label}
              </span>
              <span className="text-[0.6875rem] text-[#5F6771] font-mono leading-tight">
                {item.desc}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="shrink-0 text-[#94A3B8] my-1 md:my-0">
                <ArrowRight className="w-4 h-4 hidden md:block" />
                <span className="md:hidden block text-xs font-bold">↓</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
