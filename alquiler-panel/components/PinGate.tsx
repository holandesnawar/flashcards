'use client';

import { useState, useCallback, useEffect } from 'react';

const CORRECT_PIN = '1234';
const SESSION_KEY = 'alquiler-panel-auth';

interface PinGateProps {
  onSuccess: () => void;
}

export default function PinGate({ onSuccess }: PinGateProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    // Check if already authenticated in this session
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem(SESSION_KEY);
      if (auth === 'true') {
        onSuccess();
      }
    }
  }, [onSuccess]);

  const handleKey = useCallback((digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);

    if (newPin.length === 4) {
      setTimeout(() => {
        if (newPin === CORRECT_PIN) {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(SESSION_KEY, 'true');
          }
          onSuccess();
        } else {
          setShaking(true);
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
            setShaking(false);
          }, 700);
        }
      }, 100);
    }
  }, [pin, onSuccess]);

  const handleDelete = useCallback(() => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  }, []);

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6 select-none">
      {/* Logo / Title */}
      <div className="mb-10 text-center">
        <div className="text-5xl mb-3">🏡</div>
        <h1 className="text-white text-2xl font-bold tracking-tight">Panel de Gestión</h1>
        <p className="text-slate-400 text-sm mt-1">Introduce el PIN para continuar</p>
      </div>

      {/* PIN dots */}
      <div
        className={`flex gap-5 mb-10 ${shaking ? 'animate-shake' : ''}`}
      >
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`w-5 h-5 rounded-full border-2 transition-all duration-150 ${
              i < pin.length
                ? error
                  ? 'bg-red-500 border-red-500'
                  : 'bg-white border-white'
                : 'bg-transparent border-slate-500'
            }`}
          />
        ))}
      </div>

      {/* Error message */}
      <div className={`mb-6 h-5 transition-opacity duration-200 ${error ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-red-400 text-sm text-center font-medium">PIN incorrecto</p>
      </div>

      {/* Number pad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
        {keys.map((key, idx) => {
          if (key === '') {
            return <div key={idx} />;
          }
          if (key === 'del') {
            return (
              <button
                key={idx}
                onPointerDown={handleDelete}
                className="h-16 rounded-2xl bg-slate-700 text-white text-2xl font-light flex items-center justify-center active:bg-slate-600 active:scale-95 transition-all"
                aria-label="Borrar"
              >
                ⌫
              </button>
            );
          }
          return (
            <button
              key={idx}
              onPointerDown={() => handleKey(key)}
              className="h-16 rounded-2xl bg-slate-700 text-white text-2xl font-semibold flex items-center justify-center active:bg-blue-600 active:scale-95 transition-all shadow-md"
              aria-label={key}
            >
              {key}
            </button>
          );
        })}
      </div>

      <p className="text-slate-600 text-xs mt-12">Acceso privado — no compartir</p>
    </div>
  );
}
