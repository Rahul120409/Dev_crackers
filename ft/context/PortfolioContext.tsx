'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AssetClassItem } from '../types/portfolio';
import { mockAssetClasses, savePortfolioToBackend, fetchLatestPortfolioFromBackend } from '../services/portfolioData';

export interface PortfolioState {
  portfolioName: string;
  totalCapitalCr: number;
  assets: AssetClassItem[];
}

export const PRESET_PORTFOLIOS: PortfolioState[] = [
  {
    portfolioName: 'Institutional Capital Alpha Book',
    totalCapitalCr: 100,
    assets: mockAssetClasses
  },
  {
    portfolioName: 'Global Liquidity & Sovereign Reserve',
    totalCapitalCr: 45,
    assets: [
      {
        id: 'loans',
        name: 'Loans & Advances',
        category: 'Commercial & Retail Credit',
        valueCr: 4.5,
        allocationPct: 10,
        targetPct: 10,
        differencePct: 0,
        riskLevel: 'Medium',
        riskScore: 78,
        riskContributionPct: 15.0,
        expectedReturnPct: 8.2,
        liquidityScore: 0.35,
        liquidityLevel: 'Low (Term)',
        liquidValueCr: 1.57,
        status: 'BALANCED',
        color: '#3B82F6',
        fillColor: 'bg-blue-600',
        description: 'Direct lending books, infrastructure tranches, and retail secured advances.'
      },
      {
        id: 'bonds',
        name: 'Sovereign & AAA Bonds',
        category: 'Central Govt Debt & AAA Corp',
        valueCr: 27.0,
        allocationPct: 60,
        targetPct: 60,
        differencePct: 0,
        riskLevel: 'Low',
        riskScore: 28,
        riskContributionPct: 40.0,
        expectedReturnPct: 6.1,
        liquidityScore: 0.90,
        liquidityLevel: 'High (T+1)',
        liquidValueCr: 24.3,
        status: 'BALANCED',
        color: '#0D9488',
        fillColor: 'bg-teal-600',
        description: 'Central government sovereign securities, state debt, and AAA corporate bonds.'
      },
      {
        id: 'cash',
        name: 'Cash & Overnight Reserves',
        category: 'Central Bank Reserves & Repo',
        valueCr: 11.25,
        allocationPct: 25,
        targetPct: 25,
        differencePct: 0,
        riskLevel: 'Very Low',
        riskScore: 5,
        riskContributionPct: 2.0,
        expectedReturnPct: 3.2,
        liquidityScore: 1.00,
        liquidityLevel: 'Instant T+0',
        liquidValueCr: 11.25,
        status: 'BALANCED',
        color: '#10B981',
        fillColor: 'bg-emerald-600',
        description: 'Overnight clearing balances, statutory reserve ratio, and repo central bank facilities.'
      },
      {
        id: 'equity',
        name: 'Listed Equity & Index Funds',
        category: 'Blue-Chip Securities & Sector ETFs',
        valueCr: 2.25,
        allocationPct: 5,
        targetPct: 5,
        differencePct: 0,
        riskLevel: 'High',
        riskScore: 89,
        riskContributionPct: 43.0,
        expectedReturnPct: 11.5,
        liquidityScore: 0.80,
        liquidityLevel: 'High (T+1)',
        liquidValueCr: 1.8,
        status: 'BALANCED',
        color: '#F59E0B',
        fillColor: 'bg-amber-600',
        description: 'Blue-chip equities, sector ETFs, and long-term capital appreciation dividend holdings.'
      }
    ]
  },
  {
    portfolioName: 'Commercial Credit Portfolio Beta',
    totalCapitalCr: 150,
    assets: [
      {
        id: 'loans',
        name: 'Loans & Advances',
        category: 'Commercial & Retail Credit',
        valueCr: 97.5,
        allocationPct: 65,
        targetPct: 50,
        differencePct: 15,
        riskLevel: 'High',
        riskScore: 85,
        riskContributionPct: 68.0,
        expectedReturnPct: 9.8,
        liquidityScore: 0.30,
        liquidityLevel: 'Low (Term)',
        liquidValueCr: 29.25,
        status: 'OVERWEIGHT',
        color: '#3B82F6',
        fillColor: 'bg-blue-600',
        description: 'Direct lending books, infrastructure tranches, and retail secured advances.'
      },
      {
        id: 'bonds',
        name: 'Sovereign & AAA Bonds',
        category: 'Central Govt Debt & AAA Corp',
        valueCr: 22.5,
        allocationPct: 15,
        targetPct: 25,
        differencePct: -10,
        riskLevel: 'Low',
        riskScore: 28,
        riskContributionPct: 8.0,
        expectedReturnPct: 6.1,
        liquidityScore: 0.90,
        liquidityLevel: 'High (T+1)',
        liquidValueCr: 20.25,
        status: 'UNDERWEIGHT',
        color: '#0D9488',
        fillColor: 'bg-teal-600',
        description: 'Central government sovereign securities, state debt, and AAA corporate bonds.'
      },
      {
        id: 'cash',
        name: 'Cash & Overnight Reserves',
        category: 'Central Bank Reserves & Repo',
        valueCr: 7.5,
        allocationPct: 5,
        targetPct: 10,
        differencePct: -5,
        riskLevel: 'Very Low',
        riskScore: 5,
        riskContributionPct: 0.5,
        expectedReturnPct: 3.2,
        liquidityScore: 1.00,
        liquidityLevel: 'Instant T+0',
        liquidValueCr: 7.5,
        status: 'UNDERWEIGHT',
        color: '#10B981',
        fillColor: 'bg-emerald-600',
        description: 'Overnight clearing balances, statutory reserve ratio, and repo central bank facilities.'
      },
      {
        id: 'equity',
        name: 'Listed Equity & Index Funds',
        category: 'Blue-Chip Securities & Sector ETFs',
        valueCr: 22.5,
        allocationPct: 15,
        targetPct: 15,
        differencePct: 0,
        riskLevel: 'High',
        riskScore: 89,
        riskContributionPct: 23.5,
        expectedReturnPct: 11.5,
        liquidityScore: 0.80,
        liquidityLevel: 'High (T+1)',
        liquidValueCr: 18.0,
        status: 'BALANCED',
        color: '#F59E0B',
        fillColor: 'bg-amber-600',
        description: 'Blue-chip equities, sector ETFs, and long-term capital appreciation dividend holdings.'
      }
    ]
  }
];

interface PortfolioContextType {
  portfolio: PortfolioState;
  availablePortfolios: PortfolioState[];
  updatePortfolio: (name: string, capitalCr: number, assets: AssetClassItem[]) => Promise<void>;
  switchPortfolioByName: (name: string) => void;
  resetToDefault: () => void;
}

const STORAGE_KEY = 'capitalguard_user_portfolio';
const ALL_PORTFOLIOS_KEY = 'capitalguard_all_portfolios';

const defaultState: PortfolioState = PRESET_PORTFOLIOS[0];

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [portfolio, setPortfolio] = useState<PortfolioState>(defaultState);
  const [availablePortfolios, setAvailablePortfolios] = useState<PortfolioState[]>(PRESET_PORTFOLIOS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const storedAll = localStorage.getItem(ALL_PORTFOLIOS_KEY);
        let list = PRESET_PORTFOLIOS;
        if (storedAll) {
          const parsedList = JSON.parse(storedAll);
          if (Array.isArray(parsedList) && parsedList.length > 0) {
            list = parsedList;
            setAvailablePortfolios(list);
          }
        }

        const storedActive = localStorage.getItem(STORAGE_KEY);
        if (storedActive) {
          const parsed = JSON.parse(storedActive);
          if (parsed.assets && parsed.totalCapitalCr) {
            setPortfolio(parsed);
          }
        } else if (list.length > 0) {
          setPortfolio(list[0]);
        }
      } catch (e) {
        console.warn('Failed to load portfolio from localStorage', e);
      } finally {
        setIsLoaded(true);
      }
    }
    loadPortfolio();
  }, []);

  const switchPortfolioByName = (name: string) => {
    const found = availablePortfolios.find(p => p.portfolioName === name || name.startsWith(p.portfolioName));
    if (found) {
      setPortfolio(found);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
      } catch (e) {
        console.warn('Failed to persist active portfolio switch', e);
      }
    }
  };

  const updatePortfolio = async (name: string, capitalCr: number, assets: AssetClassItem[]) => {
    const newState: PortfolioState = {
      portfolioName: name,
      totalCapitalCr: capitalCr,
      assets
    };
    setPortfolio(newState);

    // Update or append in availablePortfolios
    const existingIndex = availablePortfolios.findIndex(p => p.portfolioName === name);
    let updatedList: PortfolioState[];
    if (existingIndex >= 0) {
      updatedList = [...availablePortfolios];
      updatedList[existingIndex] = newState;
    } else {
      updatedList = [newState, ...availablePortfolios];
    }
    setAvailablePortfolios(updatedList);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      localStorage.setItem(ALL_PORTFOLIOS_KEY, JSON.stringify(updatedList));
      // Persist to PostgreSQL backend in background
      savePortfolioToBackend(name, capitalCr, assets);
    } catch (e) {
      console.warn('Failed to persist portfolio', e);
    }
  };

  const resetToDefault = () => {
    setPortfolio(defaultState);
    setAvailablePortfolios(PRESET_PORTFOLIOS);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ALL_PORTFOLIOS_KEY);
    } catch (e) {
      console.warn('Failed to clear portfolio storage', e);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        availablePortfolios,
        updatePortfolio,
        switchPortfolioByName,
        resetToDefault
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
