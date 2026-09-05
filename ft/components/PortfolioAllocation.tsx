'use client';

import React, { useState } from 'react';
import { AssetAllocation } from '../types/dashboard';
import { PieChart as PieIcon, Info, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface PortfolioAllocationProps {
  allocations: AssetAllocation[];
  totalCapital?: string;
}

export const PortfolioAllocation: React.FC<PortfolioAllocationProps> = ({
  allocations,
  totalCapital = '₹100 Cr',
}) => {
  const [hoveredAsset, setHoveredAsset] = useState<AssetAllocation | null>(null);

  // Calculate SVG donut slice arcs
  let accumulatedAngle = 0;
  const size = 200;
  const center = size / 2;
  const radius = 78;
  const innerRadius = 52;

  const slices = allocations.map((asset) => {
    const angle = (asset.percentage / 100) * 360;
    const startAngle = accumulatedAngle;
    const endAngle = accumulatedAngle + angle;
    accumulatedAngle += angle;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const x3 = center + innerRadius * Math.cos(endRad);
    const y3 = center + innerRadius * Math.sin(endRad);
    const x4 = center + innerRadius * Math.cos(startRad);
    const y4 = center + innerRadius * Math.sin(startRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
      'Z',
    ].join(' ');

    return {
      ...asset,
      pathData,
      startAngle,
      endAngle,
    };
  });

  const activeAsset = hoveredAsset || allocations[0];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Portfolio Asset Allocation</h2>
            <p className="text-[11px] text-slate-500">Distribution across 4 primary balance sheet tranches</p>
          </div>
        </div>
        <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
          Target Sum: 100%
        </span>
      </div>

      {/* Main Content: Donut + Legend Table */}
      <div className="mt-4 flex flex-col md:flex-row items-center gap-6">
        {/* Donut Chart SVG */}
        <div className="relative flex items-center justify-center shrink-0 w-48 h-48">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full transform -rotate-0">
            {slices.map((slice) => {
              const isHovered = hoveredAsset?.name === slice.name;
              return (
                <path
                  key={slice.name}
                  d={slice.pathData}
                  fill={slice.color}
                  className="transition-all duration-200 cursor-pointer hover:opacity-90"
                  style={{
                    transformOrigin: `${center}px ${center}px`,
                    transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                    filter: isHovered ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' : 'none',
                  }}
                  onMouseEnter={() => setHoveredAsset(slice)}
                  onMouseLeave={() => setHoveredAsset(null)}
                />
              );
            })}
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Book</span>
            <span className="text-base font-extrabold text-slate-900 font-mono leading-tight">{totalCapital}</span>
            <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded mt-0.5">
              {hoveredAsset ? `${hoveredAsset.name}: ${hoveredAsset.percentage}%` : '4 Asset Classes'}
            </span>
          </div>
        </div>

        {/* Legend / Breakdown Table */}
        <div className="flex-1 w-full space-y-2">
          {allocations.map((item) => {
            const isHovered = hoveredAsset?.name === item.name;
            return (
              <div
                key={item.name}
                onMouseEnter={() => setHoveredAsset(item)}
                onMouseLeave={() => setHoveredAsset(null)}
                className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                  isHovered
                    ? 'bg-slate-50 border-slate-300 shadow-xs'
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{item.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({item.riskWeight})</span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">{item.category}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-xs font-mono font-bold text-slate-900">
                      ₹{item.amount.toFixed(0)} Cr
                    </span>
                    <span
                      className="text-xs font-mono font-bold px-1.5 py-0.2 rounded text-white"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-20 bg-slate-100 h-1 rounded-full overflow-hidden mt-1 ml-auto">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
