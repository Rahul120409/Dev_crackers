'use client';

import React, { useState } from 'react';
import { AssetClassItem } from '../types/portfolio';
import { ArrowUpDown, Table as TableIcon, Layers, Search, Filter, Droplets, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';

interface PortfolioTableProps {
  assets: AssetClassItem[];
}

type SortField =
  | 'name'
  | 'valueCr'
  | 'allocationPct'
  | 'targetPct'
  | 'expectedReturnPct'
  | 'riskContributionPct'
  | 'liquidityScore'
  | 'status';

export const PortfolioTable: React.FC<PortfolioTableProps> = ({ assets }) => {
  const [sortField, setSortField] = useState<SortField>('allocationPct');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string') {
      return sortAsc
        ? (aVal as string).localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal as string);
    }
    return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OVERWEIGHT':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'UNDERWEIGHT':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'BALANCED':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Very Low':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Low':
        return 'bg-teal-500/15 text-teal-300 border-teal-500/30';
      case 'Medium':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'High':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-sm overflow-hidden text-slate-100">
      {/* Header & Search */}
      <div className="px-6 py-4 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Asset Allocation & Risk Ledger Table
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Granular breakdown of Current Allocation, Asset Value, Expected Return, Risk Contribution & Liquidity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search assets or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 w-48 sm:w-60 font-sans"
            />
          </div>

          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
            Click headers to sort
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 select-none">
            <tr>
              <th
                onClick={() => handleSort('name')}
                className="py-3.5 px-5 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Asset Class & Tranche</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>

              {/* 1. Asset Value */}
              <th
                onClick={() => handleSort('valueCr')}
                className="py-3.5 px-4 text-right cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Asset Value</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>

              {/* 2. Current Allocation */}
              <th
                onClick={() => handleSort('allocationPct')}
                className="py-3.5 px-4 text-right cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Current Allocation</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>

              {/* Target Allocation */}
              <th
                onClick={() => handleSort('targetPct')}
                className="py-3.5 px-4 text-right cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Target</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>

              {/* 3. Expected Return */}
              <th
                onClick={() => handleSort('expectedReturnPct')}
                className="py-3.5 px-4 text-right cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Expected Return</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>

              {/* 4. Risk Contribution */}
              <th
                onClick={() => handleSort('riskContributionPct')}
                className="py-3.5 px-4 text-right cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Risk Contribution</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>

              {/* 5. Liquidity */}
              <th
                onClick={() => handleSort('liquidityScore')}
                className="py-3.5 px-4 text-center cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Liquidity</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>

              {/* Status */}
              <th
                onClick={() => handleSort('status')}
                className="py-3.5 px-5 text-center cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/80 font-sans">
            {sortedAssets.map((asset) => (
              <tr key={asset.id} className="hover:bg-slate-800/50 transition-colors">
                {/* Asset Name & Category */}
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: asset.color }}
                    />
                    <div>
                      <span className="font-bold text-white block">{asset.name}</span>
                      <span className="text-[11px] text-slate-400">{asset.category}</span>
                    </div>
                  </div>
                </td>

                {/* 1. Asset Value */}
                <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                  ₹{asset.valueCr.toFixed(1)} Cr
                </td>

                {/* 2. Current Allocation */}
                <td className="py-3.5 px-4 text-right font-mono font-bold">
                  <span className="inline-block bg-indigo-500/15 px-2 py-0.5 rounded text-cyan-300 border border-indigo-500/30">
                    {asset.allocationPct}%
                  </span>
                </td>

                {/* Target */}
                <td className="py-3.5 px-4 text-right font-mono text-slate-400 font-semibold">
                  {asset.targetPct}%
                </td>

                {/* 3. Expected Return */}
                <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                  +{asset.expectedReturnPct}%
                </td>

                {/* 4. Risk Contribution */}
                <td className="py-3.5 px-4 text-right font-mono font-bold">
                  <span className={asset.riskContributionPct > 40 ? 'text-amber-400' : 'text-slate-200'}>
                    {asset.riskContributionPct}%
                  </span>
                </td>

                {/* 5. Liquidity */}
                <td className="py-3.5 px-4 text-center font-mono">
                  <div className="inline-flex flex-col items-center">
                    <span className="font-bold text-teal-300">
                      {(asset.liquidityScore * 100).toFixed(0)}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans">
                      {asset.liquidityLevel.split(' ')[0]} (₹{asset.liquidValueCr} Cr)
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 px-5 text-center">
                  <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-md border font-mono ${getStatusBadge(asset.status)}`}>
                    {asset.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

          {/* Table Footer Totals */}
          <tfoot className="bg-slate-950/90 border-t-2 border-slate-800 text-xs font-mono font-bold text-slate-100">
            <tr>
              <td className="py-3.5 px-5 font-sans font-extrabold uppercase text-slate-300">
                Portfolio Totals / Weighted Averages
              </td>
              <td className="py-3.5 px-4 text-right text-white">
                ₹100.0 Cr
              </td>
              <td className="py-3.5 px-4 text-right text-cyan-400">
                100.0%
              </td>
              <td className="py-3.5 px-4 text-right text-slate-400">
                100.0%
              </td>
              <td className="py-3.5 px-4 text-right text-emerald-400">
                +7.4%
              </td>
              <td className="py-3.5 px-4 text-right text-amber-400">
                100.0%
              </td>
              <td className="py-3.5 px-4 text-center text-teal-300">
                62.5% (₹62.5 Cr)
              </td>
              <td className="py-3.5 px-5 text-center text-slate-400 font-sans text-[11px]">
                4 Tranches
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
