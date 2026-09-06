'use client';

import React, { useState } from 'react';
import { MarketIntelligenceView } from '../../components/MarketIntelligenceView';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';

export default function MarketPage() {
  const [currentTab, setCurrentTab] = useState('market');

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <MarketIntelligenceView />
        </main>
      </div>
    </div>
  );
}
