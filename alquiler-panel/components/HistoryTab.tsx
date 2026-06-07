'use client';

import { useState, useMemo, useCallback } from 'react';
import { AppData, Transaction } from '@/lib/types';
import { formatCurrency, formatDate, formatMonth } from '@/lib/data';

interface HistoryTabProps {
  data: AppData;
  onDataChange: (data: AppData) => void;
}

type FilterType = 'all' | 'income' | 'expense';

const CATEGORY_LABELS: Record<Transaction['category'], string> = {
  alquiler: 'Alquiler',
  fianza: 'Fianza',
  gasto: 'Gasto',
  extra: 'Extra',
  otro: 'Otro',
};

const CATEGORY_COLORS: Record<Transaction['category'], string> = {
  alquiler: 'bg-blue-100 text-blue-700',
  fianza: 'bg-purple-100 text-purple-700',
  gasto: 'bg-red-100 text-red-700',
  extra: 'bg-emerald-100 text-emerald-700',
  otro: 'bg-slate-100 text-slate-700',
};

function getMonthFromDate(dateStr: string): string {
  return dateStr.substring(0, 7); // "2026-06"
}

function getAvailableMonths(transactions: Transaction[]): string[] {
  const months = new Set(transactions.map(t => getMonthFromDate(t.date)));
  return Array.from(months).sort((a, b) => b.localeCompare(a));
}

export default function HistoryTab({ data, onDataChange }: HistoryTabProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New transaction form state
  const [newTx, setNewTx] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    isExpense: false,
    category: 'otro' as Transaction['category'],
  });

  const availableMonths = useMemo(() => getAvailableMonths(data.transactions), [data.transactions]);

  const filtered = useMemo(() => {
    let txs = [...data.transactions];

    if (filter === 'income') txs = txs.filter(t => t.amount > 0);
    if (filter === 'expense') txs = txs.filter(t => t.amount < 0);

    if (selectedMonth !== 'all') {
      txs = txs.filter(t => getMonthFromDate(t.date) === selectedMonth);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      txs = txs.filter(t => t.description.toLowerCase().includes(q));
    }

    return txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data.transactions, filter, selectedMonth, searchQuery]);

  const totals = useMemo(() => {
    const income = filtered.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const expenses = filtered.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, net: income + expenses };
  }, [filtered]);

  const handleAddTransaction = useCallback(() => {
    const amount = parseFloat(newTx.amount.replace(',', '.'));
    if (!amount || !newTx.description.trim() || !newTx.date) return;

    const finalAmount = newTx.isExpense ? -Math.abs(amount) : Math.abs(amount);
    const tx: Transaction = {
      id: `manual-${Date.now()}`,
      date: newTx.date,
      description: newTx.description.trim(),
      amount: finalAmount,
      category: newTx.category,
    };

    onDataChange({ ...data, transactions: [tx, ...data.transactions] });
    setShowAddModal(false);
    setNewTx({
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: '',
      isExpense: false,
      category: 'otro',
    });
  }, [newTx, data, onDataChange]);

  const handleDeleteTransaction = useCallback((txId: string) => {
    if (!txId.startsWith('manual-')) return; // Only allow deleting manual entries
    onDataChange({ ...data, transactions: data.transactions.filter(t => t.id !== txId) });
  }, [data, onDataChange]);

  return (
    <div className="pb-24">
      {/* Search bar */}
      <div className="px-4 pt-4 pb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="🔍 Buscar transacción..."
          className="input-field"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
        {[
          { value: 'all', label: 'Todos' },
          { value: 'income', label: '↑ Ingresos' },
          { value: 'expense', label: '↓ Gastos' },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value as FilterType)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${
              filter === value
                ? 'bg-blue-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {label}
          </button>
        ))}

        {/* Month selector */}
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          className="flex-shrink-0 px-3 py-2 rounded-xl text-sm font-medium bg-white text-slate-600 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los meses</option>
          {availableMonths.map(m => (
            <option key={m} value={m}>{formatMonth(m)}</option>
          ))}
        </select>
      </div>

      {/* Summary row */}
      <div className="px-4 mb-3">
        <div className="card">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-sm font-bold text-emerald-600">+{formatCurrency(totals.income)}</p>
              <p className="text-xs text-slate-400 mt-0.5">Ingresos</p>
            </div>
            <div>
              <p className="text-sm font-bold text-red-500">{formatCurrency(totals.expenses)}</p>
              <p className="text-xs text-slate-400 mt-0.5">Gastos</p>
            </div>
            <div>
              <p className={`text-sm font-bold ${totals.net >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                {totals.net >= 0 ? '+' : ''}{formatCurrency(totals.net)}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Neto</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add transaction button */}
      <div className="px-4 mb-3">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full py-3 rounded-xl bg-blue-900 text-white font-semibold text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span className="text-lg leading-none">+</span> Añadir transacción
        </button>
      </div>

      {/* Monthly balance card */}
      {selectedMonth !== 'all' && (
        <div className="px-4 mb-3">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 text-white">
            <p className="text-slate-300 text-xs font-medium mb-3 uppercase tracking-wide">Balance — {formatMonth(selectedMonth)}</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Alquileres</span>
                <span className="text-emerald-400 font-medium">+{formatCurrency(filtered.filter(t => t.amount > 0 && t.category === 'alquiler').reduce((s,t) => s+t.amount, 0))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Extras (garaje/trastero)</span>
                <span className="text-emerald-400 font-medium">+{formatCurrency(filtered.filter(t => t.amount > 0 && t.category === 'extra').reduce((s,t) => s+t.amount, 0))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Fianzas cobradas</span>
                <span className="text-emerald-400 font-medium">+{formatCurrency(filtered.filter(t => t.amount > 0 && t.category === 'fianza').reduce((s,t) => s+t.amount, 0))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Gastos</span>
                <span className="text-red-400 font-medium">{formatCurrency(filtered.filter(t => t.amount < 0 && t.category === 'gasto').reduce((s,t) => s+t.amount, 0))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Fianzas devueltas</span>
                <span className="text-red-400 font-medium">{formatCurrency(filtered.filter(t => t.amount < 0 && t.category === 'fianza').reduce((s,t) => s+t.amount, 0))}</span>
              </div>
              <div className="border-t border-slate-600 pt-2 mt-2 flex justify-between">
                <span className="font-bold text-white">Balance neto</span>
                <span className={`font-bold text-lg ${totals.net >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {totals.net >= 0 ? '+' : ''}{formatCurrency(totals.net)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction list */}
      <div className="px-4 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-medium">No hay transacciones</p>
            <p className="text-sm mt-1">Cambia los filtros para ver más</p>
          </div>
        ) : (
          filtered.map(tx => (
            <div key={tx.id} className="card flex items-start gap-3">
              {/* Amount indicator */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg ${
                tx.amount > 0 ? 'bg-emerald-100' : 'bg-red-100'
              }`}>
                {tx.amount > 0 ? '↑' : '↓'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-slate-800 text-sm leading-snug truncate">{tx.description}</p>
                  <span className={`font-bold text-sm flex-shrink-0 ${tx.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-slate-400">{formatDate(tx.date)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[tx.category]}`}>
                    {CATEGORY_LABELS[tx.category]}
                  </span>
                  {tx.id.startsWith('manual-') && (
                    <button
                      onClick={() => handleDeleteTransaction(tx.id)}
                      className="text-xs text-red-400 ml-auto"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl animate-slide-up max-h-[85vh] overflow-y-auto">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>
            <div className="flex items-center justify-between px-5 pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Nueva transacción</h2>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500">✕</button>
            </div>

            <div className="px-5 py-4 space-y-4 pb-8">
              {/* Income / Expense toggle */}
              <div className="flex rounded-xl overflow-hidden border border-slate-200">
                <button
                  onClick={() => setNewTx(p => ({ ...p, isExpense: false }))}
                  className={`flex-1 py-3 font-semibold text-sm transition-colors ${!newTx.isExpense ? 'bg-emerald-500 text-white' : 'bg-white text-slate-600'}`}
                >
                  ↑ Ingreso
                </button>
                <button
                  onClick={() => setNewTx(p => ({ ...p, isExpense: true }))}
                  className={`flex-1 py-3 font-semibold text-sm transition-colors ${newTx.isExpense ? 'bg-red-500 text-white' : 'bg-white text-slate-600'}`}
                >
                  ↓ Gasto
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Descripción</label>
                <input
                  type="text"
                  value={newTx.description}
                  onChange={e => setNewTx(p => ({ ...p, description: e.target.value }))}
                  placeholder="Descripción de la transacción"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Importe (€)</label>
                <input
                  type="number"
                  value={newTx.amount}
                  onChange={e => setNewTx(p => ({ ...p, amount: e.target.value }))}
                  placeholder="0.00"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Fecha</label>
                <input
                  type="date"
                  value={newTx.date}
                  onChange={e => setNewTx(p => ({ ...p, date: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Categoría</label>
                <select
                  value={newTx.category}
                  onChange={e => setNewTx(p => ({ ...p, category: e.target.value as Transaction['category'] }))}
                  className="input-field"
                >
                  <option value="alquiler">Alquiler</option>
                  <option value="fianza">Fianza</option>
                  <option value="gasto">Gasto</option>
                  <option value="extra">Extra</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">Cancelar</button>
                <button onClick={handleAddTransaction} className="btn-primary flex-1">Añadir</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
