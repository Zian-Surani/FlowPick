import { useState } from 'react';
import { Header } from './components/layout/Header';
import { LandingPage } from './pages/LandingPage';
import { LiveAgent } from './pages/LiveAgent';
import { Training } from './pages/Training';
import { RLModel } from './pages/RLModel';
import './App.css';

export function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'live' | 'training' | 'model'>('landing');

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#191C1E]">
      {/* Global Navigation & Brand Header (hidden on Landing Page) */}
      {activeTab !== 'landing' && (
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          agentStatus={activeTab === 'training' ? 'Training Mode' : 'Agent Ready'}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {activeTab === 'landing' && <LandingPage onDiveIn={() => setActiveTab('live')} />}
        {activeTab === 'live' && <LiveAgent />}
        {activeTab === 'training' && <Training />}
        {activeTab === 'model' && <RLModel />}
      </main>

      {/* Muted Academic Assessment Footer */}
      <footer className="w-full border-t border-[#E8EAED] bg-white/70 py-4 px-6 text-center text-xs text-[#6C757D]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium">
            <span className="font-bold text-[#1E2022]">FlowPick</span> — Adaptive Warehouse Learning Agent • Fundamentals of RL (Task 2)
          </p>
          <p className="text-[0.6875rem] text-[#868E96] font-mono">
            Zian Surani (RA2311026050085) & Vaishnavi Soni (RA2311026050070)
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
