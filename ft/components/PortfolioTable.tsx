'use client';

import React, { useState } from 'react';
import { AssetClassItem } from '../types/portfolio';
import { ArrowUpDown, Table as TableIcon, Layers } from 'lucide-react';

interface PortfolioTableProps {
  assets: AssetClassItem[];
}

type SortField = 'name' | 'valueCr' | 'allocationPct' | 'targetPct' | 'expectedReturnPct' | 'riskScore';

export const PortfolioTable: React.FC<PortfolioTableProps> = ({ assets }) => {
  const [sortField, setSortField] = useState<SortField>('allocationPct');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedAssets = [...assets].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string') {
      return sortAsc ? (aVal as string).localeCompare(bVal as string) : (bVal as string).localeCompare(aVal as string);
    }
    return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OVERWEIGHT':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'UNDERWEIGHT':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'BALANCED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Very Low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Low':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'High':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Asset Details</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Granular breakdown of portfolio holdings, risk weights and return expectations
          </p>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Click column headers to sort
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 select-none">
            <tr>
              <th
                onClick={() => handleSort('name')}
                className="py-3 px-5 cursor-pointer hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Asset Class</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('valueCr')}
                className="py-3 px-4 text-right cursor-pointer hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Value (₹ Cr)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('allocationPct')}
                className="py-3 px-4 text-right cursor-pointer hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Allocation</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('targetPct')}
                className="py-3 px-4 text-right cursor-pointer hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Target</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('riskScore')}
                className="py-3 px-4 text-center cursor-pointer hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>Risk Level</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th
                onClick={() => handleSort('expectedReturnPct')}
                className="py-3 px-4 text-right cursor-pointer hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Expected Return</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              <th className="py-3 px-5 text-center">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-sans">
            {sortedAssets.map((asset) => (
              <tr key={asset.id} className="hover:bg-slate-50/70 transition-colors">
                {/* Asset */}
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: asset.color }}
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">{asset.name}</span>
                      <span className="text-[11px] text-slate-500">{asset.category}</span>
                    </div>
                  </div>
                </td>

                {/* Value */}
                <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                  ₹{asset.valueCr.toFixed(1)} Cr
                </td>

                {/* Allocation */}
                <td className="py-3.5 px-4 text-right font-mono font-bold text-indigo-700">
                  {asset.allocationPct}%
                </td>

                {/* Target */}
                <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                  {asset.targetPct}%
                </td>

                {/* Risk */}
                <td className="py-3.5 px-4 text-center">
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRiskBadge(asset.riskLevel)}`}>
                    {asset.riskLevel}
                  </span>
                </td>

                {/* Expected Return */}
                <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600">
                  +{asset.expectedReturnPct}%
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
        </table>
      </div>
    </div>
  );
};
