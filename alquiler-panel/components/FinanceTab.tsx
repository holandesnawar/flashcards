'use client';

import { useState, useCallback, useMemo } from 'react';
import { AppData, MonthlyPayment } from '@/lib/types';
import { formatCurrency, formatMonth } from '@/lib/data';

interface FinanceTabProps {
  data: AppData;
  currentMonth: string;
  onDataChange: (data: AppData) => void;
}

function getPrevMonth(month: string): string {
  const [year, m] = month.split('-').map(Number);
  if (m === 1) return `${year - 1}-12`;
  return `${year}-${String(m - 1).padStart(2, '0')}`;
}

function getNextMonth(month: string): string {
  const [year, m] = month.split('-').map(Number);
  if (m === 12) return `${year + 1}-01`;
  return `${year}-${String(m + 1).padStart(2, '0')}`;
}

export default function FinanceTab({ data, currentMonth, onDataChange }: FinanceTabProps) {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [editingCosts, setEditingCosts] = useState(false);
  const [costsForm, setCostsForm] = useState(data.fixedCosts);

  const getPaymentForMonth = useCallback((roomId: number, month: string): MonthlyPayment | undefined => {
    return data.payments.find(p => p.roomId === roomId && p.month === month);
  }, [data.payments]);

  const stats = useMemo(() => {
    // Alquileres cobrados this month (from payments table)
    const paidRooms = data.rooms.filter(r => {
      const p = getPaymentForMonth(r.id, selectedMonth);
      return p?.paid === true;
    });

    const rentIncome = paidRooms.reduce((sum, r) => {
      const p = getPaymentForMonth(r.id, selectedMonth);
      return sum + (p?.amount || r.tenant?.rentAmount || 0);
    }, 0);

    const garaje = data.extraIncome.garaje;
    const trastero = data.extraIncome.trastero;
    const totalIncome = rentIncome + garaje + trastero;

    const { hipoteca, luzAgua, comunidad, wifi } = data.fixedCosts;
    const totalExpenses = hipoteca + luzAgua + comunidad + wifi;
    const netProfit = totalIncome - totalExpenses;

    return { rentIncome, garaje, trastero, totalIncome, hipoteca, luzAgua, comunidad, wifi, totalExpenses, netProfit, paidRooms };
  }, [data, selectedMonth, getPaymentForMonth]);

  const saveFixedCosts = useCallback(() => {
    onDataChange({
      ...data,
      fixedCosts: {
        hipoteca: parseFloat(costsForm.hipoteca.toString()) || 0,
        luzAgua: parseFloat(costsForm.luzAgua.toString()) || 0,
        comunidad: parseFloat(costsForm.comunidad.toString()) || 0,
        wifi: parseFloat(costsForm.wifi.toString()) || 0,
      },
    });
    setEditingCosts(false);
  }, [data, costsForm, onDataChange]);

  const togglePayment = useCallback((roomId: number) => {
    const room = data.rooms.find(r => r.id === roomId);
    if (!room || !room.isOccupied || !room.tenant) return;

    const existing = getPaymentForMonth(roomId, selectedMonth);
    let newPayments: MonthlyPayment[];

    if (existing) {
      newPayments = data.payments.map(p =>
        p.roomId === roomId && p.month === selectedMonth
          ? { ...p, paid: !p.paid, paidDate: !p.paid ? new Date().toISOString().split('T')[0] : undefined }
          : p
      );
    } else {
      newPayments = [...data.payments, {
        roomId,
        month: selectedMonth,
        paid: true,
        amount: room.tenant.rentAmount,
        paidDate: new Date().toISOString().split('T')[0],
      }];
    }

    onDataChange({ ...data, payments: newPayments });
  }, [data, selectedMonth, getPaymentForMonth, onDataChange]);

  return (
    <div className="px-4 py-4 pb-24 space-y-4">
      {/* Month selector */}
      <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <button
          onClick={() => setSelectedMonth(getPrevMonth(selectedMonth))}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 text-xl active:scale-95 transition-all"
        >
          ‹
        </button>
        <div className="text-center">
          <p className="font-bold text-slate-800 text-lg capitalize">{formatMonth(selectedMonth)}</p>
        </div>
        <button
          onClick={() => setSelectedMonth(getNextMonth(selectedMonth))}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 text-xl active:scale-95 transition-all"
        >
          ›
        </button>
      </div>

      {/* Net profit hero card */}
      <div className={`rounded-2xl p-5 text-white text-center shadow-md ${stats.netProfit >= 0 ? 'bg-gradient-to-br from-blue-800 to-blue-900' : 'bg-gradient-to-br from-red-700 to-red-900'}`}>
        <p className="text-blue-200 text-sm font-medium mb-1">Beneficio neto estimado</p>
        <p className="text-4xl font-bold">{formatCurrency(stats.netProfit)}</p>
        <div className="flex justify-center gap-6 mt-3 text-sm">
          <span className="text-emerald-300">↑ {formatCurrency(stats.totalIncome)}</span>
          <span className="text-red-300">↓ {formatCurrency(stats.totalExpenses)}</span>
        </div>
      </div>

      {/* Summary cards row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card text-center py-3">
          <p className="text-lg font-bold text-emerald-600">{formatCurrency(stats.totalIncome)}</p>
          <p className="text-xs text-slate-500 mt-0.5">Ingresos</p>
        </div>
        <div className="card text-center py-3">
          <p className="text-lg font-bold text-red-500">{formatCurrency(stats.totalExpenses)}</p>
          <p className="text-xs text-slate-500 mt-0.5">Gastos</p>
        </div>
        <div className="card text-center py-3">
          <p className={`text-lg font-bold ${stats.netProfit >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
            {formatCurrency(stats.netProfit)}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Neto</p>
        </div>
      </div>

      {/* Income breakdown */}
      <div className="card space-y-3">
        <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
          <span className="text-emerald-500">↑</span> Ingresos
        </h3>

        <div className="space-y-2">
          <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
            <span className="text-slate-600 text-sm">Alquileres cobrados</span>
            <span className="font-semibold text-emerald-600">{formatCurrency(stats.rentIncome)}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
            <div>
              <span className="text-slate-600 text-sm">Garaje</span>
              <span className="text-xs text-slate-400 ml-1">(María del Mar)</span>
            </div>
            <span className="font-semibold text-emerald-600">{formatCurrency(stats.garaje)}</span>
          </div>
          <div className="flex justify-between items-center py-1.5">
            <div>
              <span className="text-slate-600 text-sm">Trastero</span>
              <span className="text-xs text-slate-400 ml-1">(Clemente)</span>
            </div>
            <span className="font-semibold text-emerald-600">{formatCurrency(stats.trastero)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t-2 border-slate-200">
            <span className="font-bold text-slate-800 text-sm">Total ingresos</span>
            <span className="font-bold text-emerald-600">{formatCurrency(stats.totalIncome)}</span>
          </div>
        </div>
      </div>

      {/* Expense breakdown */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <span className="text-red-500">↓</span> Gastos fijos
          </h3>
          <button
            onClick={() => {
              setEditingCosts(!editingCosts);
              setCostsForm(data.fixedCosts);
            }}
            className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
          >
            {editingCosts ? 'Cancelar' : 'Editar'}
          </button>
        </div>

        {editingCosts ? (
          <div className="space-y-3">
            {[
              { key: 'hipoteca', label: 'Hipoteca' },
              { key: 'luzAgua', label: 'Luz + Agua' },
              { key: 'comunidad', label: 'Comunidad' },
              { key: 'wifi', label: 'Wifi' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-3">
                <label className="text-sm text-slate-600 w-28 flex-shrink-0">{label}</label>
                <div className="flex items-center gap-1 flex-1">
                  <span className="text-slate-500">€</span>
                  <input
                    type="number"
                    value={(costsForm as Record<string, number>)[key]}
                    onChange={e => setCostsForm(prev => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))}
                    className="input-field"
                  />
                </div>
              </div>
            ))}
            <button onClick={saveFixedCosts} className="btn-primary w-full mt-2">
              Guardar cambios
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {[
              { label: 'Hipoteca', value: stats.hipoteca },
              { label: 'Luz + Agua', value: stats.luzAgua },
              { label: 'Comunidad', value: stats.comunidad },
              { label: 'Wifi', value: stats.wifi },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
                <span className="text-slate-600 text-sm">{label}</span>
                <span className="font-semibold text-red-500">-{formatCurrency(value)}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2 border-t-2 border-slate-200">
              <span className="font-bold text-slate-800 text-sm">Total gastos</span>
              <span className="font-bold text-red-500">-{formatCurrency(stats.totalExpenses)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Room payment status */}
      <div className="card space-y-3">
        <h3 className="font-bold text-slate-800 text-base">Estado de pagos — {formatMonth(selectedMonth)}</h3>
        <div className="space-y-2">
          {data.rooms.map(room => {
            const payment = getPaymentForMonth(room.id, selectedMonth);
            const isPaid = payment?.paid === true;

            return (
              <div key={room.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="font-medium text-slate-800 text-sm">{room.name}</p>
                  <p className="text-xs text-slate-400 truncate max-w-[160px]">
                    {room.tenant?.name || 'Vacía'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {room.isOccupied ? (
                    <>
                      <span className={`text-xs font-semibold ${isPaid ? 'text-emerald-600' : 'text-red-500'}`}>
                        {isPaid ? formatCurrency(payment?.amount || room.tenant?.rentAmount || 0) : 'Pendiente'}
                      </span>
                      <button
                        onClick={() => togglePayment(room.id)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all active:scale-95 ${
                          isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-500'
                        }`}
                      >
                        {isPaid ? '✓' : '✗'}
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Libre</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
