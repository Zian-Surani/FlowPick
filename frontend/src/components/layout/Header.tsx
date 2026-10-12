import React from 'react';
import { Activity, Brain, Layers } from 'lucide-react';

interface HeaderProps {
  activeTab: 'landing' | 'live' | 'training' | 'model';
  setActiveTab: (tab: 'landing' | 'live' | 'training' | 'model') => void;
  agentStatus?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  agentStatus = 'Agent Ready',
}) => {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-[#E8EAED] sticky top-0 z-30 px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand & Logo (Clicking logo returns to Landing Page) */}
        <button
          id="btn-header-logo-home"
          onClick={() => setActiveTab('landing')}
          title="Back to Landing Page"
          className="flex items-center gap-3 self-start sm:self-auto text-left cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-white border border-[#E2E8F0] p-1.5 flex items-center justify-center shadow-xs overflow-hidden group-hover:scale-105 group-hover:border-[#DDD4FB] transition-all">
            <img src="/logo.png" alt="FlowPick Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-extrabold text-[1.125rem] tracking-tight text-[#191C1E] group-hover:text-[#5941C8] transition-colors">
                FLOWPICK
              </span>
              <span className="text-[0.6875rem] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#E0EEFD] text-[#2563EB] border border-[#BFDBFE]">
                RL Agent
              </span>
            </div>
            <p className="text-xs text-[#5F6771] font-medium tracking-tight">
              Adaptive Warehouse Learning Agent
            </p>
          </div>
        </button>

        {/* Navigation Tabs (Live Agent, Training, RL Model) */}
        <nav className="flex items-center p-1 bg-[#F1F3F5] rounded-xl border border-[#E4E7EB]">
          <button
            id="nav-live-agent"
            onClick={() => setActiveTab('live')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'live'
                ? 'bg-white text-[#191C1E] shadow-xs border border-[#E2E5E9]'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Agent</span>
          </button>

          <button
            id="nav-training"
            onClick={() => setActiveTab('training')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'training'
                ? 'bg-white text-[#191C1E] shadow-xs border border-[#E2E5E9]'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Training</span>
          </button>

          <button
            id="nav-rl-model"
            onClick={() => setActiveTab('model')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'model'
                ? 'bg-white text-[#191C1E] shadow-xs border border-[#E2E5E9]'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>RL Model</span>
          </button>
        </nav>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E7F9F0] border border-[#B9F0D2] text-[#1E744E] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span>● {agentStatus}</span>
          </div>
        </div>

      </div>
    </header>
  );
};
