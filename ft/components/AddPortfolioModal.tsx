'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  Percent,
  DollarSign,
  AlertCircle,
  Briefcase,
  TrendingUp,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { AssetClassItem, PortfolioKPI } from '../types/portfolio';

interface AssetItemInput {
  id: string;
  name: string;
  category: string;
  valueCr: number;
  allocationPct: number;
  expectedReturnPct: number;
  riskLevel: 'Very Low' | 'Low' | 'Medium' | 'High';
  liquidityScore: number;
  color: string;
}

interface AddPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePortfolio: (newAssets: AssetClassItem[], totalCapitalCr: number, portfolioName: string) => void;
}

const PRESETS = [
  {
    name: 'Institutional Balanced ⚖️',
    description: 'Conservative growth with robust Basel III liquidity buffers.',
    capital: 100,
    assets: [
      { id: 'loans', name: 'Commercial & Retail Loans', category: 'Loans & Advances', valueCr: 45, allocationPct: 45, expectedReturnPct: 8.5, riskLevel: 'Medium' as const, liquidityScore: 0.40, color: '#3B82F6' },
      { id: 'bonds', name: 'Govt & AAA Sovereign Bonds', category: 'Sovereign Debt', valueCr: 35, allocationPct: 35, expectedReturnPct: 6.2, riskLevel: 'Low' as const, liquidityScore: 0.90, color: '#0D9488' },
      { id: 'cash', name: 'Liquid Cash & Central Reserves', category: 'Cash & Overnight', valueCr: 10, allocationPct: 10, expectedReturnPct: 3.5, riskLevel: 'Very Low' as const, liquidityScore: 1.00, color: '#10B981' },
      { id: 'equity', name: 'Blue-Chip Equity Tranche', category: 'Listed Equities', valueCr: 10, allocationPct: 10, expectedReturnPct: 12.0, riskLevel: 'High' as const, liquidityScore: 0.85, color: '#F59E0B' }
    ]
  },
  {
    name: 'Aggressive Capital Growth 🚀',
    description: 'High return profile targeting alpha with moderate debt cushion.',
    capital: 100,
    assets: [
      { id: 'equity', name: 'Tech & Large Cap Equities', category: 'Listed Equities', valueCr: 55, allocationPct: 55, expectedReturnPct: 14.5, riskLevel: 'High' as const, liquidityScore: 0.85, color: '#F59E0B' },
      { id: 'loans', name: 'High-Yield Credit Loans', category: 'Loans & Advances', valueCr: 25, allocationPct: 25, expectedReturnPct: 9.8, riskLevel: 'Medium' as const, liquidityScore: 0.35, color: '#3B82F6' },
      { id: 'bonds', name: 'Corporate Bonds (AA+)', category: 'Corporate Debt', valueCr: 15, allocationPct: 15, expectedReturnPct: 7.0, riskLevel: 'Low' as const, liquidityScore: 0.80, color: '#0D9488' },
      { id: 'cash', name: 'Operating Liquidity Buffer', category: 'Cash & Overnight', valueCr: 5, allocationPct: 5, expectedReturnPct: 3.0, riskLevel: 'Very Low' as const, liquidityScore: 1.00, color: '#10B981' }
    ]
  },
  {
    name: 'Capital Preservation / Ultra-Safe 🛡️',
    description: 'Heavy sovereign backing for maximum statutory security.',
    capital: 100,
    assets: [
      { id: 'bonds', name: '10-Yr Sovereign G-Secs', category: 'Sovereign Debt', valueCr: 60, allocationPct: 60, expectedReturnPct: 6.0, riskLevel: 'Low' as const, liquidityScore: 0.95, color: '#0D9488' },
      { id: 'cash', name: 'Overnight Central Repo', category: 'Cash & Overnight', valueCr: 25, allocationPct: 25, expectedReturnPct: 3.8, riskLevel: 'Very Low' as const, liquidityScore: 1.00, color: '#10B981' },
      { id: 'loans', name: 'Secured Tier-1 Mortgages', category: 'Loans & Advances', valueCr: 15, allocationPct: 15, expectedReturnPct: 7.5, riskLevel: 'Medium' as const, liquidityScore: 0.50, color: '#3B82F6' }
    ]
  }
];

export const AddPortfolioModal: React.FC<AddPortfolioModalProps> = ({
  isOpen,
  onClose,
  onSavePortfolio
}) => {
  const [portfolioName, setPortfolioName] = useState('Institutional Capital Alpha Book');
  const [totalCapital, setTotalCapital] = useState<number>(100);
  const [assets, setAssets] = useState<AssetItemInput[]>(PRESETS[0].assets);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalAllocatedPct = assets.reduce((acc, a) => acc + (Number(a.allocationPct) || 0), 0);
  const totalValueCalculated = (totalCapital * totalAllocatedPct) / 100;

  const handleApplyPreset = (presetIdx: number) => {
    const selected = PRESETS[presetIdx];
    setTotalCapital(selected.capital);
    setAssets([...selected.assets]);
    setError(null);
  };

  const handleAssetChange = (index: number, field: keyof AssetItemInput, val: any) => {
    const updated = [...assets];
    updated[index] = { ...updated[index], [field]: val };
    
    // Auto-recalculate value in Cr if allocationPct changes
    if (field === 'allocationPct') {
      const pct = Number(val) || 0;
      updated[index].valueCr = parseFloat(((totalCapital * pct) / 100).toFixed(2));
    }
    setAssets(updated);
  };

  const handleAddAssetRow = () => {
    const defaultColors = ['#8B5CF6', '#EC4899', '#06B6D4', '#EAB308'];
    const newColor = defaultColors[assets.length % defaultColors.length];
    const remainingPct = Math.max(0, 100 - totalAllocatedPct);

    const newAsset: AssetItemInput = {
      id: `custom-asset-${Date.now()}`,
      name: 'New Custom Asset',
      category: 'Alternative Asset',
      allocationPct: remainingPct,
      valueCr: parseFloat(((totalCapital * remainingPct) / 100).toFixed(2)),
      expectedReturnPct: 7.5,
      riskLevel: 'Medium',
      liquidityScore: 0.70,
      color: newColor
    };
    setAssets([...assets, newAsset]);
  };

  const handleRemoveAssetRow = (idx: number) => {
    if (assets.length <= 1) {
      setError('At least one asset is required in the portfolio.');
      return;
    }
    setAssets(assets.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (Math.abs(totalAllocatedPct - 100) > 0.01) {
      setError(`Total allocation must equal 100%. Currently it is ${totalAllocatedPct}%.`);
      return;
    }

    if (totalCapital <= 0) {
      setError('Total Capital must be greater than zero.');
      return;
    }

    // Convert into full AssetClassItem
    const convertedAssets: AssetClassItem[] = assets.map((a) => {
      const val = parseFloat(((totalCapital * a.allocationPct) / 100).toFixed(2));
      const targetPct = a.allocationPct; // Default target
      return {
        id: a.id,
        name: a.name,
        category: a.category,
        valueCr: val,
        allocationPct: a.allocationPct,
        targetPct: targetPct,
        differencePct: 0,
        riskLevel: a.riskLevel,
        riskScore: a.riskLevel === 'Very Low' ? 10 : a.riskLevel === 'Low' ? 30 : a.riskLevel === 'Medium' ? 65 : 88,
        riskContributionPct: parseFloat(((a.allocationPct * (a.riskLevel === 'High' ? 1.5 : a.riskLevel === 'Medium' ? 1.0 : 0.5))).toFixed(1)),
        expectedReturnPct: a.expectedReturnPct,
        liquidityScore: a.liquidityScore,
        liquidityLevel: a.liquidityScore >= 0.95 ? 'Instant T+0' : a.liquidityScore >= 0.75 ? 'High (T+1)' : a.liquidityScore >= 0.45 ? 'Moderate (T+3)' : 'Low (Term)',
        liquidValueCr: parseFloat((val * a.liquidityScore).toFixed(1)),
        status: 'BALANCED',
        color: a.color,
        fillColor: 'bg-indigo-600',
        description: `Custom configured tranche for ${a.name} with ${a.allocationPct}% allocation.`
      };
    });

    onSavePortfolio(convertedAssets, totalCapital, portfolioName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b101f] text-slate-100 rounded-2xl shadow-2xl border border-slate-800 max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Configure Custom Portfolio Holdings
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Interactive Entry
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Specify your capital base and allocate asset percentages to dynamically trigger risk and return engines.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* QUICK PRESET SELECTORS */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              1-Click Demo Presets (Instant Auto-Fill)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(idx)}
                  className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-left transition-all cursor-pointer group"
                >
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                    {preset.name}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* PORTFOLIO METADATA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Portfolio Name
              </label>
              <input
                type="text"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
                placeholder="e.g. Q3 Growth Strategy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Total Capital Base (₹ In Crores / $ Millions)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={totalCapital}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setTotalCapital(val);
                  }}
                  className="w-full pl-8 pr-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono font-bold focus:outline-none focus:border-cyan-500"
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          {/* ASSETS BUILDER TABLE */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Asset Tranches & Allocation Breakdown
                </h3>
              </div>
              <button
                type="button"
                onClick={handleAddAssetRow}
                className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Asset
              </button>
            </div>

            {/* Assets Table */}
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Asset Name</th>
                    <th className="p-3">Asset Class / Category</th>
                    <th className="p-3 text-right">Allocation (%)</th>
                    <th className="p-3 text-right">Calculated (₹ Cr)</th>
                    <th className="p-3 text-right">Exp. Return</th>
                    <th className="p-3 text-center">Risk Tier</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {assets.map((asset, idx) => (
                    <tr key={asset.id} className="hover:bg-slate-900/40">
                      {/* Name */}
                      <td className="p-2.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={asset.color}
                            onChange={(e) => handleAssetChange(idx, 'color', e.target.value)}
                            className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0 shrink-0"
                            title="Pick slice color"
                          />
                          <input
                            type="text"
                            value={asset.name}
                            onChange={(e) => handleAssetChange(idx, 'name', e.target.value)}
                            className="w-full px-2 py-1 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-2.5">
                        <select
                          value={asset.category}
                          onChange={(e) => handleAssetChange(idx, 'category', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                        >
                          <option value="Loans & Advances">Loans & Advances</option>
                          <option value="Sovereign Debt">Sovereign Debt</option>
                          <option value="Cash & Overnight">Cash & Overnight</option>
                          <option value="Listed Equities">Listed Equities</option>
                          <option value="Corporate Debt">Corporate Debt</option>
                          <option value="Commodities / Gold">Commodities / Gold</option>
                          <option value="Alternative Asset">Alternative Asset</option>
                        </select>
                      </td>

                      {/* Allocation % */}
                      <td className="p-2.5 text-right">
                        <div className="relative inline-block w-20">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={asset.allocationPct}
                            onChange={(e) => handleAssetChange(idx, 'allocationPct', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-right font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-500 pr-5"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 text-[11px] font-mono">
                            %
                          </span>
                        </div>
                      </td>

                      {/* Value Cr */}
                      <td className="p-2.5 text-right font-mono font-bold text-white">
                        ₹{((totalCapital * asset.allocationPct) / 100).toFixed(1)} Cr
                      </td>

                      {/* Expected Return */}
                      <td className="p-2.5 text-right">
                        <div className="relative inline-block w-16">
                          <input
                            type="number"
                            step="0.1"
                            value={asset.expectedReturnPct}
                            onChange={(e) => handleAssetChange(idx, 'expectedReturnPct', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-right font-mono text-emerald-400 focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </td>

                      {/* Risk Tier */}
                      <td className="p-2.5 text-center">
                        <select
                          value={asset.riskLevel}
                          onChange={(e) => handleAssetChange(idx, 'riskLevel', e.target.value)}
                          className="px-2 py-1 bg-slate-900 border border-slate-700/80 rounded-lg text-[11px] font-mono text-slate-300 focus:outline-none"
                        >
                          <option value="Very Low">Very Low</option>
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </td>

                      {/* Delete */}
                      <td className="p-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveAssetRow(idx)}
                          className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                          title="Remove Asset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ALLOCATION BALANCE VALIDATION BAR */}
          <div className={`p-4 rounded-xl border flex items-center justify-between text-xs font-mono ${
            Math.abs(totalAllocatedPct - 100) < 0.01
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
          }`}>
            <div className="flex items-center gap-2 font-bold">
              {Math.abs(totalAllocatedPct - 100) < 0.01 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Allocation 100% Balanced (₹{totalCapital.toFixed(1)} Cr total)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Current Total: {totalAllocatedPct}% (Must equal 100% — Difference: {(100 - totalAllocatedPct).toFixed(1)}%)</span>
                </>
              )}
            </div>

            <div className="font-bold text-white">
              {assets.length} Assets Registered
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={Math.abs(totalAllocatedPct - 100) > 0.01}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-950/50 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShieldCheck className="w-4 h-4" />
            Apply Portfolio & Recalculate Risk
          </button>
        </div>

      </div>
    </div>
  );
};
