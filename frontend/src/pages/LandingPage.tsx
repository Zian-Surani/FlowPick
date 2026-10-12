import React from 'react';
import { Bot, ArrowRight, Sparkles, Zap, Brain, ShieldCheck } from 'lucide-react';

interface LandingPageProps {
  onDiveIn: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onDiveIn }) => {
  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-between py-6 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center pt-6 sm:pt-12 pb-8 max-w-3xl mx-auto">
        {/* Brand Logo Display */}
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white border border-[#E2E8F0] p-3 shadow-md flex items-center justify-center hover:scale-105 transition-transform">
            <img src="/logo.png" alt="FlowPick Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Soft pastel pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFEBFD] border border-[#DDD4FB] text-[#5941C8] text-xs font-semibold mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span>Fundamentals of Reinforcement Learning — Task 2</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#191C1E] mb-4">
          FLOWPICK
        </h1>
        <p className="text-lg sm:text-xl font-medium text-[#495057] mb-4">
          Adaptive Warehouse Learning Agent
        </p>

        {/* Hero Description */}
        <p className="text-sm sm:text-base text-[#5F6771] leading-relaxed max-w-2xl mx-auto mb-8">
          An autonomous reinforcement learning agent operating in a simulated warehouse grid. 
          Using model-free Q-Learning, the agent autonomously learns obstacle avoidance, 
          package pickup, and dispatch delivery routes to maximize cumulative rewards.
        </p>

        {/* Single Primary Action Button: "Dive In" */}
        <div className="flex justify-center items-center">
          <button
            id="btn-dive-in"
            onClick={onDiveIn}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-white bg-[#5941C8] hover:bg-[#4833AB] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
          >
            <span>Dive In</span>
            <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </button>
        </div>
      </div>

      {/* Feature Bento Grid Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl border border-[#E8EAED] p-5 shadow-xs hover:border-[#DDD4FB] transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#EFEBFD] text-[#5941C8] flex items-center justify-center mb-3">
            <Bot className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#1E2022] mb-1">
            Autonomous Agent
          </h3>
          <p className="text-xs text-[#6C757D] leading-relaxed">
            Automated picking cart navigating 6×6 corridors with dynamic collision avoidance and state-dependent cargo handling.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl border border-[#E8EAED] p-5 shadow-xs hover:border-[#CCE2FC] transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#E8F2FE] text-[#2563EB] flex items-center justify-center mb-3">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#1E2022] mb-1">
            Q-Learning Optimization
          </h3>
          <p className="text-xs text-[#6C757D] leading-relaxed">
            Bellman optimality update formulation balancing immediate costs against discounted future delivery rewards.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl border border-[#E8EAED] p-5 shadow-xs hover:border-[#C4F2DB] transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#E7F9F0] text-[#1E744E] flex items-center justify-center mb-3">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#1E2022] mb-1">
            Interactive Telemetry
          </h3>
          <p className="text-xs text-[#6C757D] leading-relaxed">
            Real-time sensory feedback, step-by-step single stepping, policy convergence curves, and live episode metrics.
          </p>
        </div>
      </div>

      {/* Academic Project Credits */}
      <div className="mt-4 p-4 rounded-2xl bg-white border border-[#E8EAED] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6C757D]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#5941C8]" />
          <span className="font-semibold text-[#1E2022]">Academic Evaluation Team:</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
          <a
            href="https://github.com/Zian-Surani"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FAFBFD] px-2.5 py-1 rounded-lg border border-[#E9EEF4] hover:border-[#5941C8] transition-colors"
          >
            <strong>Zian Rajeshkumar Surani</strong> (RA2311026050085)
          </a>
          <a
            href="https://github.com/Vaishnavi-Soni-12"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FAFBFD] px-2.5 py-1 rounded-lg border border-[#E9EEF4] hover:border-[#2563EB] transition-colors"
          >
            <strong>Vaishnavi Soni</strong> (RA2311026050070)
          </a>
        </div>
      </div>
    </div>
  );
};
