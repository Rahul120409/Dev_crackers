'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AssetClassItem } from '../types/portfolio';
import { mockAssetClasses, savePortfolioToBackend, fetchLatestPortfolioFromBackend } from '../services/portfolioData';

export interface PortfolioState {
  portfolioName: string;
  totalCapitalCr: number;
  assets: AssetClassItem[];
}

interface PortfolioContextType {
  portfolio: PortfolioState;
  updatePortfolio: (name: string, capitalCr: number, assets: AssetClassItem[]) => Promise<void>;
  resetToDefault: () => void;
}

const STORAGE_KEY = 'capitalguard_user_portfolio';

const defaultState: PortfolioState = {
  portfolioName: 'Institutional Capital Alpha Book',
  totalCapitalCr: 100,
  assets: mockAssetClasses
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [portfolio, setPortfolio] = useState<PortfolioState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        // Try local storage first for fast response
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.assets && parsed.totalCapitalCr) {
            setPortfolio(parsed);
          }
        }
      } catch (e) {
        console.warn('Failed to load portfolio from localStorage', e);
      } finally {
        setIsLoaded(true);
      }
    }
    loadPortfolio();
  }, []);

  const updatePortfolio = async (name: string, capitalCr: number, assets: AssetClassItem[]) => {
    const newState: PortfolioState = {
      portfolioName: name,
      totalCapitalCr: capitalCr,
      assets
    };
    setPortfolio(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      // Persist to PostgreSQL backend in background
      savePortfolioToBackend(name, capitalCr, assets);
    } catch (e) {
      console.warn('Failed to persist portfolio', e);
    }
  };

  const resetToDefault = () => {
    setPortfolio(defaultState);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear portfolio storage', e);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        updatePortfolio,
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
