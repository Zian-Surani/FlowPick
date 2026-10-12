import React from 'react';
import type { AgentState, GridCoord } from '../../types/rl';
import { DEFAULT_WAREHOUSE_CONFIG } from '../../data/mockData';
import { Bot, Package, CheckCircle2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface WarehouseGridProps {
  agentState: AgentState;
}

export const WarehouseGrid: React.FC<WarehouseGridProps> = ({ agentState }) => {
  const env = DEFAULT_WAREHOUSE_CONFIG;
  const rows = env.rows;
  const cols = env.cols;

  // Check if coordinates match
  const isCoord = (a: GridCoord, b: GridCoord) => a.row === b.row && a.col === b.col;

  // Check if position is on path
  const isPath = (r: number, c: number) => {
    return agentState.path.some((p) => p.row === r && p.col === c && !isCoord(p, agentState.position));
  };

  // Check if position is shelf
  const isShelf = (r: number, c: number) => {
    return env.shelves.some((s) => s.row === r && s.col === c);
  };

  const getActionArrow = () => {
    switch (agentState.currentAction) {
      case 'UP':
        return <ArrowUp className="w-3.5 h-3.5 text-[#5941C8] stroke-[3]" />;
      case 'DOWN':
        return <ArrowDown className="w-3.5 h-3.5 text-[#5941C8] stroke-[3]" />;
      case 'LEFT':
        return <ArrowLeft className="w-3.5 h-3.5 text-[#5941C8] stroke-[3]" />;
      case 'RIGHT':
        return <ArrowRight className="w-3.5 h-3.5 text-[#5941C8] stroke-[3]" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Top Grid Metadata Bar */}
      <div className="flex items-center justify-between pb-3 text-xs text-[#5F6771] border-b border-[#F1F3F5] mb-4">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-[#191C1E]">
            Grid Dimension: <span className="font-mono text-[#4A5568]">{rows} × {cols}</span>
          </span>
          <span className="hidden sm:inline text-[#CCD2D9]">|</span>
          <span className="hidden sm:inline">
            Coordinate System: <span className="font-mono text-[#4A5568]">[row, col]</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.6875rem] font-medium bg-[#EFEBFD] text-[#5941C8] border border-[#DDD4FB]">
            <span>Payload:</span>
            <span className="font-bold">{agentState.hasPackage ? 'Loaded (Package In Hand)' : 'Empty (Searching)'}</span>
          </span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="flex-1 flex items-center justify-center p-2">
        <div className="w-full max-w-[520px] aspect-square bg-[#FAFBFD] p-3 rounded-2xl border border-[#E3E7ED] shadow-inner relative flex flex-col justify-between">
          
          {/* Column Headers */}
          <div className="grid grid-cols-6 mb-1 text-center">
            {Array.from({ length: cols }).map((_, c) => (
              <span key={`col-hdr-${c}`} className="text-[0.625rem] font-mono font-medium text-[#9AA2AC]">
                C{c}
              </span>
            ))}
          </div>

          {/* Grid Cells */}
          <div className="flex-1 grid grid-cols-6 grid-rows-6 gap-2">
            {Array.from({ length: rows }).map((_, r) =>
              Array.from({ length: cols }).map((_, c) => {
                const isCurrentAgent = agentState.position.row === r && agentState.position.col === c;
                const isTarget = env.target.row === r && env.target.col === c && !agentState.hasPackage;
                const isDispatch = env.dispatch.row === r && env.dispatch.col === c;
                const shelfObstacle = isShelf(r, c);
                const onPathTrail = isPath(r, c);

                return (
                  <div
                    key={`cell-${r}-${c}`}
                    className={`relative rounded-xl flex items-center justify-center transition-all duration-200 select-none ${
                      shelfObstacle
                        ? 'bg-[#E9ECEF] border border-[#CED4DA] shadow-xs'
                        : isDispatch
                        ? 'bg-[#E7F9F0] border-2 border-dashed border-[#34D399]'
                        : isTarget
                        ? 'bg-[#FFF0E6] border border-[#FCDDC7]'
                        : onPathTrail
                        ? 'bg-[#F4F1FD] border border-[#DDD4FB]'
                        : 'bg-white border border-[#EBEFF4] hover:border-[#CBD5E1]'
                    }`}
                  >
                    {/* Small coordinate label in cell corner */}
                    <span className="absolute top-1 left-1.5 text-[0.5625rem] font-mono text-[#CBD5E1] pointer-events-none">
                      {r},{c}
                    </span>

                    {/* Shelf / Obstacle */}
                    {shelfObstacle && (
                      <div className="flex flex-col items-center justify-center text-[#6C757D]">
                        <div className="w-6 h-1.5 bg-[#ADB5BD] rounded-full mb-1"></div>
                        <span className="text-[0.5625rem] font-bold tracking-wider uppercase text-[#6C757D]">
                          SHELF
                        </span>
                        <div className="w-6 h-1.5 bg-[#ADB5BD] rounded-full mt-1"></div>
                      </div>
                    )}

                    {/* Dispatch Dock Zone */}
                    {isDispatch && (
                      <div className="flex flex-col items-center text-center">
                        <CheckCircle2 className="w-5 h-5 text-[#10B981] stroke-[2.2]" />
                        <span className="text-[0.5625rem] font-extrabold uppercase tracking-tight text-[#059669] mt-0.5">
                          DISPATCH
                        </span>
                      </div>
                    )}

                    {/* Target Package */}
                    {isTarget && (
                      <div className="flex flex-col items-center text-center animate-bounce-gentle">
                        <div className="w-7 h-7 rounded-lg bg-[#FFE8DB] border border-[#FED7C3] flex items-center justify-center shadow-xs">
                          <Package className="w-4 h-4 text-[#EA580C]" />
                        </div>
                        <span className="text-[0.5625rem] font-bold uppercase tracking-tight text-[#EA580C] mt-0.5">
                          ITEM
                        </span>
                      </div>
                    )}

                    {/* Agent Trail Dot */}
                    {onPathTrail && !shelfObstacle && !isCurrentAgent && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#C7B9F8] border border-[#A792F4] opacity-80" />
                    )}

                    {/* Active Agent Icon */}
                    {isCurrentAgent && (
                      <div
                        id="autonomous-agent-icon"
                        className="z-20 flex flex-col items-center justify-center transition-transform transform duration-150 scale-105"
                      >
                        <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] text-white flex items-center justify-center shadow-md border-2 border-white">
                          <Bot className="w-4 h-4 stroke-[2.4]" />
                          {agentState.hasPackage && (
                            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#FFEDD5] border border-[#FB923C] rounded-full flex items-center justify-center shadow-xs">
                              <Package className="w-2.5 h-2.5 text-[#EA580C]" />
                            </div>
                          )}
                        </div>
                        {agentState.currentAction && (
                          <div className="absolute -bottom-2 bg-white px-1 py-0.2 rounded-full border border-[#DDD4FB] shadow-xs flex items-center">
                            {getActionArrow()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom Legend */}
      <div className="mt-4 pt-3 border-t border-[#F1F3F5] flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.75rem] text-[#4B5563]">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-md bg-[#8B5CF6] flex items-center justify-center text-white text-[0.5rem]">
            <Bot className="w-2.5 h-2.5" />
          </div>
          <span className="font-medium text-[#1E2022]">Agent</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-md bg-[#FFE8DB] border border-[#FED7C3] flex items-center justify-center text-[#EA580C]">
            <Package className="w-2.5 h-2.5" />
          </div>
          <span className="font-medium text-[#1E2022]">Target Package</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-md bg-[#E7F9F0] border border-[#34D399] flex items-center justify-center text-[#059669]">
            <CheckCircle2 className="w-2.5 h-2.5" />
          </div>
          <span className="font-medium text-[#1E2022]">Dispatch Zone</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-md bg-[#E9ECEF] border border-[#CED4DA] flex items-center justify-center">
            <span className="w-1.5 h-0.5 bg-[#6C757D] rounded-full"></span>
          </div>
          <span className="font-medium text-[#1E2022]">Shelf / Obstacle</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-md bg-[#F4F1FD] border border-[#DDD4FB] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></div>
          </div>
          <span className="font-medium text-[#1E2022]">Trajectory Path</span>
        </div>
      </div>
    </div>
  );
};
