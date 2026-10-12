import React, { useState } from 'react';
import type { EpisodeResult } from '../../types/rl';

interface LearningChartProps {
  data: EpisodeResult[];
  height?: number;
}

export const LearningChart: React.FC<LearningChartProps> = ({ data, height = 280 }) => {
  const [hoveredPoint, setHoveredPoint] = useState<EpisodeResult | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-[#94A3B8]">
        No training trajectory recorded yet.
      </div>
    );
  }

  const svgWidth = 720;
  const svgHeight = height;
  const padding = { top: 25, right: 30, bottom: 40, left: 55 };

  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // Determine scale bounds
  const minReward = -100;
  const maxReward = 100;
  const totalEpisodes = Math.max(data.length, 30);

  const getX = (ep: number) => padding.left + ((ep - 1) / (totalEpisodes - 1 || 1)) * chartWidth;
  const getY = (val: number) => padding.top + chartHeight - ((val - minReward) / (maxReward - minReward)) * chartHeight;

  // Generate SVG path for raw episodic rewards
  const points = data.map((d) => `${getX(d.episode)},${getY(d.totalReward)}`).join(' ');

  // Compute 10-episode moving average line for smooth trendline
  const movingAvgPoints = data.map((d, i) => {
    const windowStart = Math.max(0, i - 9);
    const windowSlice = data.slice(windowStart, i + 1);
    const avg = windowSlice.reduce((sum, item) => sum + item.totalReward, 0) / windowSlice.length;
    return `${getX(d.episode)},${getY(avg)}`;
  }).join(' ');

  // Area under curve polygon
  const areaPath = `
    M ${getX(data[0].episode)},${getY(data[0].totalReward)}
    ${points}
    L ${getX(data[data.length - 1].episode)},${getY(minReward)}
    L ${getX(data[0].episode)},${getY(minReward)}
    Z
  `;

  return (
    <div className="w-full flex flex-col">
      {/* Chart Legend & Live Tooltip Header */}
      <div className="flex items-center justify-between text-xs text-[#5F6771] mb-2 px-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#8B5CF6]"></span>
            <span className="text-[0.6875rem] font-semibold text-[#1E2022]">Episode Reward</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#10B981] border-b border-dashed border-[#10B981]"></span>
            <span className="text-[0.6875rem] font-semibold text-[#1E2022]">Moving Avg (10-Ep)</span>
          </div>
        </div>

        {hoveredPoint ? (
          <div className="flex items-center gap-2 bg-[#F1F5F9] px-2.5 py-0.5 rounded-md font-mono text-[0.6875rem] text-[#1E293B]">
            <span>Ep: <strong>{hoveredPoint.episode}</strong></span>
            <span>|</span>
            <span>Reward: <strong className={hoveredPoint.totalReward >= 0 ? 'text-[#059669]' : 'text-[#DC2626]'}>{hoveredPoint.totalReward}</strong></span>
            <span>|</span>
            <span>Steps: <strong>{hoveredPoint.steps}</strong></span>
          </div>
        ) : (
          <span className="text-[0.6875rem] text-[#94A3B8]">Hover over chart to inspect episodes</span>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-hidden rounded-xl bg-[#FAFBFD] border border-[#E9EEF4] p-1">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto select-none"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id="rewardGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#EDE9FE" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines horizontal */}
          {[-100, -50, 0, 50, 100].map((val) => (
            <g key={`grid-y-${val}`}>
              <line
                x1={padding.left}
                y1={getY(val)}
                x2={svgWidth - padding.right}
                y2={getY(val)}
                stroke={val === 0 ? '#94A3B8' : '#E2E8F0'}
                strokeWidth={val === 0 ? '1.5' : '1'}
                strokeDasharray={val === 0 ? '4 2' : 'none'}
              />
              <text
                x={padding.left - 8}
                y={getY(val) + 3}
                textAnchor="end"
                className="text-[10px] fill-[#64748B] font-mono"
              >
                {val > 0 ? `+${val}` : val}
              </text>
            </g>
          ))}

          {/* Grid lines vertical / Episode markers */}
          {[1, Math.round(totalEpisodes * 0.25), Math.round(totalEpisodes * 0.5), Math.round(totalEpisodes * 0.75), totalEpisodes].map(
            (ep) => (
              <g key={`grid-x-${ep}`}>
                <line
                  x1={getX(ep)}
                  y1={padding.top}
                  x2={getX(ep)}
                  y2={svgHeight - padding.bottom}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                />
                <text
                  x={getX(ep)}
                  y={svgHeight - padding.bottom + 18}
                  textAnchor="middle"
                  className="text-[10px] fill-[#64748B] font-mono"
                >
                  Ep {ep}
                </text>
              </g>
            )
          )}

          {/* Area fill */}
          <path d={areaPath} fill="url(#rewardGradient)" />

          {/* Episodic points line */}
          <polyline
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Moving average smooth trendline */}
          <polyline
            fill="none"
            stroke="#10B981"
            strokeWidth="2.2"
            strokeDasharray="5 3"
            points={movingAvgPoints}
          />

          {/* Interactive invisible hover triggers */}
          {data.map((d) => (
            <circle
              key={`dot-${d.episode}`}
              cx={getX(d.episode)}
              cy={getY(d.totalReward)}
              r="4"
              className="opacity-0 hover:opacity-100 fill-[#6D28D9] stroke-2 stroke-white cursor-pointer transition-opacity"
              onMouseEnter={() => setHoveredPoint(d)}
            />
          ))}

          {/* Highlight dot on hovered point */}
          {hoveredPoint && (
            <g>
              <circle
                cx={getX(hoveredPoint.episode)}
                cy={getY(hoveredPoint.totalReward)}
                r="6"
                fill="#6D28D9"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <line
                x1={getX(hoveredPoint.episode)}
                y1={padding.top}
                x2={getX(hoveredPoint.episode)}
                y2={svgHeight - padding.bottom}
                stroke="#6D28D9"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </g>
          )}

          {/* Axis Labels */}
          <text
            x={padding.left + 5}
            y={padding.top - 8}
            className="text-[10px] font-bold fill-[#475569] uppercase tracking-wider font-mono"
          >
            Reward
          </text>
          <text
            x={svgWidth - padding.right}
            y={svgHeight - 12}
            textAnchor="end"
            className="text-[10px] font-bold fill-[#475569] uppercase tracking-wider font-mono"
          >
            Episodes →
          </text>
        </svg>
      </div>
    </div>
  );
};
