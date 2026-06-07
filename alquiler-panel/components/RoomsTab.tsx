'use client';

import { useState, useCallback } from 'react';
import { AppData, Room, MonthlyPayment } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/data';
import RoomModal from './RoomModal';

interface RoomsTabProps {
  data: AppData;
  currentMonth: string;
  onDataChange: (data: AppData) => void;
}

export default function RoomsTab({ data, currentMonth, onDataChange }: RoomsTabProps) {
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const getPaymentForMonth = useCallback((roomId: number, month: string): MonthlyPayment | undefined => {
    return data.payments.find(p => p.roomId === roomId && p.month === month);
  }, [data.payments]);

  const togglePayment = useCallback((room: Room) => {
    if (!room.isOccupied || !room.tenant) return;

    const existing = getPaymentForMonth(room.id, currentMonth);
    let newPayments: MonthlyPayment[];

    if (existing) {
      // Toggle paid status
      newPayments = data.payments.map(p =>
        p.roomId === room.id && p.month === currentMonth
          ? { ...p, paid: !p.paid, paidDate: !p.paid ? new Date().toISOString().split('T')[0] : undefined }
          : p
      );
    } else {
      // Create new payment entry
      const newPayment: MonthlyPayment = {
        roomId: room.id,
        month: currentMonth,
        paid: true,
        amount: room.tenant.rentAmount,
        paidDate: new Date().toISOString().split('T')[0],
      };
      newPayments = [...data.payments, newPayment];
    }

    onDataChange({ ...data, payments: newPayments });
  }, [data, currentMonth, getPaymentForMonth, onDataChange]);

  const handleRoomSave = useCallback((updatedRoom: Room) => {
    const newRooms = data.rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r);
    onDataChange({ ...data, rooms: newRooms });
    setEditingRoom(null);
  }, [data, onDataChange]);

  const occupiedCount = data.rooms.filter(r => r.isOccupied).length;
  const paidCount = data.rooms.filter(r => {
    const p = getPaymentForMonth(r.id, currentMonth);
    return p?.paid === true;
  }).length;

  return (
    <div className="px-4 py-4 pb-24 space-y-3">
      {/* Summary bar */}
      <div className="card flex items-center justify-between">
        <div className="text-center flex-1">
          <p className="text-2xl font-bold text-slate-800">{occupiedCount}/5</p>
          <p className="text-xs text-slate-500 mt-0.5">Ocupadas</p>
        </div>
        <div className="w-px h-10 bg-slate-200" />
        <div className="text-center flex-1">
          <p className="text-2xl font-bold text-emerald-600">{paidCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">Han pagado</p>
        </div>
        <div className="w-px h-10 bg-slate-200" />
        <div className="text-center flex-1">
          <p className="text-2xl font-bold text-red-500">{occupiedCount - paidCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">Pendientes</p>
        </div>
      </div>

      {/* Room cards */}
      {data.rooms.map(room => {
        const payment = getPaymentForMonth(room.id, currentMonth);
        const isPaid = payment?.paid === true;

        return (
          <div key={room.id} className="card">
            <div className="flex items-start gap-3">
              {/* Status dot + room name */}
              <div className="flex-shrink-0 pt-0.5">
                <div className={`w-3 h-3 rounded-full mt-1 ${room.isOccupied ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-slate-800 text-base">{room.name}</span>
                  <span className="text-sm font-semibold text-slate-600">
                    {room.tenant ? formatCurrency(room.tenant.rentAmount) : '—'}
                  </span>
                </div>

                <p className="text-slate-600 text-sm truncate">
                  {room.tenant ? room.tenant.name : 'Vacía'}
                </p>

                {room.tenant?.startDate && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    Desde {formatDate(room.tenant.startDate)}
                  </p>
                )}

                {/* Deposit badge */}
                <div className="flex items-center gap-2 mt-2">
                  {room.isOccupied && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      room.depositPaid
                        ? room.depositReturned
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {room.depositPaid
                        ? room.depositReturned
                          ? '↩ Fianza devuelta'
                          : room.depositAmount > 0
                            ? `✓ Fianza ${formatCurrency(room.depositAmount)} · guardada`
                            : '✓ Fianza (plataforma)'
                        : '✗ Sin fianza'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
              {room.isOccupied && (
                <button
                  onClick={() => togglePayment(room)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                    isPaid
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-600 border border-red-200'
                  }`}
                >
                  {isPaid ? '✓ Pagado' : '✗ Sin pagar'}
                </button>
              )}
              <button
                onClick={() => setEditingRoom(room)}
                className={`py-2.5 px-4 rounded-xl text-sm font-semibold bg-slate-100 text-slate-700 active:scale-95 transition-all ${!room.isOccupied ? 'flex-1' : ''}`}
              >
                Editar
              </button>
            </div>
          </div>
        );
      })}

      {/* Edit Modal */}
      {editingRoom && (
        <RoomModal
          room={editingRoom}
          onSave={handleRoomSave}
          onClose={() => setEditingRoom(null)}
        />
      )}
    </div>
  );
}
