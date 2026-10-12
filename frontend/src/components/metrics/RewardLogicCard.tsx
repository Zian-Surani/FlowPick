import React from 'react';
import { BentoCard } from '../bento/BentoCard';
import { REWARD_RULES } from '../../data/mockData';
import { Award, ArrowRight, Ban, Clock } from 'lucide-react';

export const RewardLogicCard: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'delivery':
        return <Award className="w-3.5 h-3.5 text-[#059669]" />;
      case 'movement':
        return <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />;
      case 'collision':
        return <Ban className="w-3.5 h-3.5 text-[#DC2626]" />;
      case 'delay':
        return <Clock className="w-3.5 h-3.5 text-[#9333EA]" />;
      default:
        return null;
    }
  };

  return (
    <BentoCard
      title="Reward Logic"
      subtitle="Reinforcement signals shaping policy optimization"
      badge="Reward Fn"
      badgeColor="mint"
    >
      <div className="space-y-2">
        {REWARD_RULES.map((rule) => (
          <div
            key={rule.type}
            className={`flex items-center justify-between p-2.5 rounded-xl border ${rule.bg} ${rule.border} transition-all`}
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-lg bg-white shadow-xs">
                {getIcon(rule.type)}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#1E2022]">
                  {rule.name}
                </p>
                <p className="text-[0.6875rem] text-[#5F6771]">
                  {rule.desc}
                </p>
              </div>
            </div>
            <span
              className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${rule.badge}`}
            >
              {rule.value}
            </span>
          </div>
        ))}
      </div>
    </BentoCard>
  );
};
