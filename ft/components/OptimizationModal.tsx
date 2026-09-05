'use client';

import React, { useState } from 'react';
import { OptimizationDetails } from '../types/dashboard';
import {
  X,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Droplets,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Play,
  SlidersHorizontal
} from 'lucide-react';

interface OptimizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  optimization: OptimizationDetails;
  onApplyRebalance?: () => void;
}

export const OptimizationModal: React.FC<OptimizationModalProps> = ({
  isOpen,
  onClose,
  optimization,
  onApplyRebalance,
}) => {
  const [isApplying, setIsApplying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExecute = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onApplyRebalance?.();
        onClose();
      }, 1500);
    }, 1200);
  };

  const assetList = ['Loans', 'Bonds', 'Cash', 'Equity'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Portfolio Optimization Proposal</h2>
              <p className="text-[11px] text-slate-400">Mean-Variance Optimization with Basel III Capital & Liquidity Constraints</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Key Metric Gains */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Risk Reduction</span>
              <div className="text-xl font-bold font-mono text-emerald-700 mt-0.5">-{optimization.riskReduction}%</div>
              <span className="text-[10px] text-emerald-600">Tail VaR Drop</span>
            </div>
            <div className="p-3 rounded-xl bg-cyan-50/70 border border-cyan-200 text-center">
              <span className="text-[10px] font-bold text-cyan-800 uppercase tracking-wider">Liquidity Boost</span>
              <div className="text-xl font-bold font-mono text-cyan-700 mt-0.5">{optimization.liquidityImprovement}</div>
              <span className="text-[10px] text-cyan-600">Surplus HQLA</span>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 text-center">
              <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider">Efficiency Gain</span>
              <div className="text-xl font-bold font-mono text-indigo-700 mt-0.5">+{optimization.capitalEfficiency}%</div>
              <span className="text-[10px] text-indigo-600">Sharpe Ratio Delta</span>
            </div>
          </div>

          {/* Allocation Comparison Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Asset Allocation Transition (₹100 Cr Book)
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">Total Capital: ₹100.0 Cr</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Asset Class</th>
                    <th className="p-3 text-right">Current Weight</th>
                    <th className="p-3 text-center">Action</th>
                    <th className="p-3 text-right">Optimized Target</th>
                    <th className="p-3 text-right">Delta (₹ Cr)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assetList.map((asset) => {
                    const current = optimization.currentAllocation[asset] || 0;
                    const target = optimization.optimizedAllocation[asset] || 0;
                    const delta = target - current;
                    const deltaCr = (delta * 100) / 100; // in Cr

                    return (
                      <tr key={asset} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-900">{asset}</td>
                        <td className="p-3 text-right font-mono text-slate-600">{current}% (₹{current} Cr)</td>
                        <td className="p-3 text-center">
                          {delta > 0 ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              + Increase
                            </span>
                          ) : delta < 0 ? (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              - Reduce
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-slate-500">Hold</span>
                          )}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-indigo-700">{target}% (₹{target} Cr)</td>
                        <td className={`p-3 text-right font-mono font-bold ${delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                          {delta > 0 ? `+₹${deltaCr} Cr` : delta < 0 ? `-₹${Math.abs(deltaCr)} Cr` : '0 Cr'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Institutional Rationale */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              Algorithmic Rationale & Constraint Validations
            </h4>
            <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
              {optimization.rationale.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            <span>Estimated Execution Cost: </span>
            <strong className="text-slate-800 font-mono">₹1.2 Lakhs (0.0012%)</strong>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleExecute}
              disabled={isApplying || isSuccess}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isApplying ? (
                <span>Executing Rebalance Order...</span>
              ) : isSuccess ? (
                <span className="flex items-center gap-1.5 text-emerald-200">
                  <CheckCircle className="w-3.5 h-3.5" /> Applied Successfully!
                </span>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Rebalance Order</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
