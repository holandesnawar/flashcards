'use client';

import { useState, useEffect, useCallback } from 'react';
import PinGate from '@/components/PinGate';
import RoomsTab from '@/components/RoomsTab';
import FinanceTab from '@/components/FinanceTab';
import HistoryTab from '@/components/HistoryTab';
import { AppData } from '@/lib/types';
import { loadData, saveData, getCurrentMonth, formatMonth } from '@/lib/data';

type TabType = 'habitaciones' | 'finanzas' | 'historial';

const SESSION_KEY = 'alquiler-panel-auth';

export default function PanelPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('habitaciones');
  const [data, setData] = useState<AppData | null>(null);
  const [currentMonth] = useState(getCurrentMonth());

  // Load data from localStorage on mount
  useEffect(() => {
    // Check session auth
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem(SESSION_KEY);
      if (auth === 'true') {
        setAuthenticated(true);
      }
    }
    setData(loadData());
  }, []);

  // Save data whenever it changes
  const handleDataChange = useCallback((newData: AppData) => {
    setData(newData);
    saveData(newData);
  }, []);

  const handleLogout = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_KEY);
    }
    setAuthenticated(false);
  }, []);

  const handleAuthSuccess = useCallback(() => {
    setAuthenticated(true);
  }, []);

  // Simple bot/crawler protection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Block if no touch support and no mouse (likely a headless browser/bot)
    const isHeadless = /HeadlessChrome|PhantomJS|SlimerJS|Puppeteer/i.test(navigator.userAgent);
    if (isHeadless) {
      document.body.innerHTML = '';
    }
  }, []);

  // Compute quick stats
  const occupiedCount = data?.rooms.filter(r => r.isOccupied).length ?? 0;
  const paidThisMonth = data?.payments.filter(p => p.month === currentMonth && p.paid).length ?? 0;
  const totalCollected = data?.payments
    .filter(p => p.month === currentMonth && p.paid)
    .reduce((sum, p) => sum + p.amount, 0) ?? 0;

  if (!authenticated) {
    return <PinGate onSuccess={handleAuthSuccess} />;
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Cargando...</div>
      </div>
    );
  }

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'habitaciones', label: 'Habitaciones', icon: '🛏️' },
    { id: 'finanzas', label: 'Finanzas', icon: '💰' },
    { id: 'historial', label: 'Historial', icon: '📋' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col max-w-lg mx-auto">
      {/* Top header */}
      <header className="bg-gradient-to-r from-blue-900 to-slate-800 text-white px-4 pt-10 pb-4 flex-shrink-0 sticky top-0 z-40 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🏡</span>
              <h1 className="text-lg font-bold leading-tight">Mi Piso</h1>
            </div>
            <p className="text-blue-300 text-xs mt-0.5 capitalize">{formatMonth(currentMonth)}</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white active:bg-white/20 transition-all"
            title="Cerrar sesión"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        {/* Quick stats bar */}
        <div className="flex gap-3 mt-3">
          <div className="flex-1 bg-white/10 rounded-xl px-3 py-2">
            <p className="text-white text-base font-bold">{occupiedCount}/5</p>
            <p className="text-blue-300 text-xs">Ocupadas</p>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl px-3 py-2">
            <p className="text-white text-base font-bold">{paidThisMonth}/{occupiedCount}</p>
            <p className="text-blue-300 text-xs">Han pagado</p>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl px-3 py-2">
            <p className="text-emerald-300 text-base font-bold">
              {totalCollected > 0
                ? `€${totalCollected.toFixed(0)}`
                : '€0'}
            </p>
            <p className="text-blue-300 text-xs">Cobrado</p>
          </div>
        </div>
      </header>

      {/* Tab content */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'habitaciones' && (
          <RoomsTab
            data={data}
            currentMonth={currentMonth}
            onDataChange={handleDataChange}
          />
        )}
        {activeTab === 'finanzas' && (
          <FinanceTab
            data={data}
            currentMonth={currentMonth}
            onDataChange={handleDataChange}
          />
        )}
        {activeTab === 'historial' && (
          <HistoryTab
            data={data}
            onDataChange={handleDataChange}
          />
        )}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex shadow-lg z-40 max-w-lg mx-auto pb-safe-bottom">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-all active:scale-95 min-h-[60px] ${
              activeTab === tab.id
                ? 'text-blue-900'
                : 'text-slate-400'
            }`}
          >
            <span className="text-xl leading-none">{tab.icon}</span>
            <span className={`text-xs font-medium mt-0.5 ${activeTab === tab.id ? 'font-bold' : ''}`}>
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 w-12 h-0.5 bg-blue-900 rounded-t-full" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
