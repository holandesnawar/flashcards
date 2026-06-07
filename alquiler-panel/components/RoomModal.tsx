'use client';

import { useState, useEffect, useCallback } from 'react';
import { Room, Tenant } from '@/lib/types';

interface RoomModalProps {
  room: Room;
  onSave: (updatedRoom: Room) => void;
  onClose: () => void;
}

export default function RoomModal({ room, onSave, onClose }: RoomModalProps) {
  const [isOccupied, setIsOccupied] = useState(room.isOccupied);
  const [depositPaid, setDepositPaid] = useState(room.depositPaid);
  const [depositAmount, setDepositAmount] = useState(room.depositAmount.toString());
  const [depositReturned, setDepositReturned] = useState(room.depositReturned);
  const [depositReturnDate, setDepositReturnDate] = useState(room.depositReturnDate || '');

  const [name, setName] = useState(room.tenant?.name || '');
  const [phone, setPhone] = useState(room.tenant?.phone || '');
  const [startDate, setStartDate] = useState(room.tenant?.startDate || '');
  const [rentAmount, setRentAmount] = useState(room.tenant?.rentAmount?.toString() || '400');
  const [notes, setNotes] = useState(room.tenant?.notes || '');

  const handleSave = useCallback(() => {
    const tenant: Tenant | null = isOccupied
      ? {
          name: name.trim() || 'Sin nombre',
          phone: phone.trim(),
          startDate: startDate,
          rentAmount: parseFloat(rentAmount) || 0,
          notes: notes.trim(),
        }
      : null;

    const updatedRoom: Room = {
      ...room,
      isOccupied,
      tenant,
      depositPaid,
      depositAmount: parseFloat(depositAmount) || 0,
      depositReturned,
      depositReturnDate: depositReturned ? depositReturnDate : undefined,
    };

    onSave(updatedRoom);
  }, [room, isOccupied, name, phone, startDate, rentAmount, notes, depositPaid, depositAmount, depositReturned, depositReturnDate, onSave]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl animate-slide-up max-h-[92vh] overflow-y-auto">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Editar {room.name}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 text-lg"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4 space-y-5 pb-safe">
          {/* Ocupada / Vacía toggle */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-semibold text-slate-800">Estado de la habitación</p>
              <p className="text-sm text-slate-500">{isOccupied ? 'Ocupada' : 'Libre'}</p>
            </div>
            <button
              onClick={() => setIsOccupied(!isOccupied)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${isOccupied ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${isOccupied ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Tenant fields - only show when occupied */}
          {isOccupied && (
            <div className="space-y-4 bg-slate-50 rounded-2xl p-4">
              <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Datos del inquilino</h3>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Nombre completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Nombre del inquilino"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Teléfono (opcional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+34 000 000 000"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Fecha de entrada</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Alquiler mensual (€)</label>
                <input
                  type="number"
                  value={rentAmount}
                  onChange={e => setRentAmount(e.target.value)}
                  placeholder="400"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Notas</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Observaciones, acuerdos especiales..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
            </div>
          )}

          {/* Deposit section */}
          <div className="bg-slate-50 rounded-2xl p-4 space-y-4">
            <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Fianza</h3>

            <div className="flex items-center justify-between">
              <p className="text-slate-700 font-medium">Fianza pagada</p>
              <button
                onClick={() => setDepositPaid(!depositPaid)}
                className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${depositPaid ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${depositPaid ? 'translate-x-7' : 'translate-x-0'}`} />
              </button>
            </div>

            {depositPaid && (
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Importe de la fianza (€)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  placeholder="450"
                  className="input-field"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-slate-700 font-medium">Fianza devuelta</p>
              <button
                onClick={() => setDepositReturned(!depositReturned)}
                className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${depositReturned ? 'bg-orange-500' : 'bg-slate-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${depositReturned ? 'translate-x-7' : 'translate-x-0'}`} />
              </button>
            </div>

            {depositReturned && (
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Fecha de devolución</label>
                <input
                  type="date"
                  value={depositReturnDate}
                  onChange={e => setDepositReturnDate(e.target.value)}
                  className="input-field"
                />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2 pb-6">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="btn-primary flex-1"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
