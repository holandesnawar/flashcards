'use client';

import { useState, useCallback, useEffect } from 'react';

const CORRECT_PIN = '16112005';
const SESSION_KEY = 'alquiler-panel-auth';
const ATTEMPTS_KEY = 'alquiler-pin-attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000;

interface PinGateProps {
  onSuccess: () => void;
}

interface AttemptsData {
  count: number;
  lockedUntil: number;
}

function getAttemptsData(): AttemptsData {
  if (typeof window === 'undefined') return { count: 0, lockedUntil: 0 };
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { count: 0, lockedUntil: 0 };
}

function saveAttemptsData(data: AttemptsData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(data));
}

export default function PinGate({ onSuccess }: PinGateProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [locked, setLocked] = useState(false);
  const [lockSecondsLeft, setLockSecondsLeft] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem(SESSION_KEY);
      if (auth === 'true') { onSuccess(); return; }
    }
    const data = getAttemptsData();
    if (data.lockedUntil > Date.now()) {
      setLocked(true);
      setLockSecondsLeft(Math.ceil((data.lockedUntil - Date.now()) / 1000));
    } else {
      setAttemptsLeft(MAX_ATTEMPTS - data.count);
    }
  }, [onSuccess]);

  useEffect(() => {
    if (!locked) return;
    const interval = setInterval(() => {
      const data = getAttemptsData();
      const remaining = Math.ceil((data.lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLocked(false);
        setLockSecondsLeft(0);
        saveAttemptsData({ count: 0, lockedUntil: 0 });
        setAttemptsLeft(MAX_ATTEMPTS);
      } else {
        setLockSecondsLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [locked]);

  const handleKey = useCallback((digit: string) => {
    if (locked || pin.length >= 8) return;
    const newPin = pin + digit;
    setPin(newPin);

    if (newPin.length === 8) {
      setTimeout(() => {
        if (newPin === CORRECT_PIN) {
          saveAttemptsData({ count: 0, lockedUntil: 0 });
          if (typeof window !== 'undefined') sessionStorage.setItem(SESSION_KEY, 'true');
          onSuccess();
        } else {
          const current = getAttemptsData();
          const newCount = current.count + 1;
          const lockedUntil = newCount >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : 0;
          saveAttemptsData({ count: newCount, lockedUntil });
          if (newCount >= MAX_ATTEMPTS) {
            setLocked(true);
            setLockSecondsLeft(Math.ceil(LOCKOUT_MS / 1000));
          } else {
            setAttemptsLeft(MAX_ATTEMPTS - newCount);
          }
          setShaking(true);
          setError(true);
          setTimeout(() => { setPin(''); setError(false); setShaking(false); }, 700);
        }
      }, 100);
    }
  }, [pin, onSuccess, locked]);

  const handleDelete = useCallback(() => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  }, []);

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  if (locked) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6 select-none">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-white text-xl font-bold">Acceso bloqueado</h1>
          <p className="text-slate-400 text-sm mt-2">Demasiados intentos fallidos</p>
          <p className="text-red-400 text-4xl font-mono font-bold mt-6">{formatTime(lockSecondsLeft)}</p>
          <p className="text-slate-500 text-xs mt-3">Inténtalo de nuevo en {Math.ceil(lockSecondsLeft / 60)} min</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6 select-none">
      <div className="mb-10 text-center">
        <div className="text-5xl mb-3">🏡</div>
        <h1 className="text-white text-2xl font-bold tracking-tight">Panel de Gestión</h1>
        <p className="text-slate-400 text-sm mt-1">Introduce el PIN para continuar</p>
      </div>

      <div className={`flex gap-3 mb-6 ${shaking ? 'animate-shake' : ''}`}>
        {[0,1,2,3,4,5,6,7].map(i => (
          <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
            i < pin.length
              ? error ? 'bg-red-500 border-red-500' : 'bg-white border-white'
              : 'bg-transparent border-slate-500'
          }`} />
        ))}
      </div>

      <div className={`mb-6 h-5 transition-opacity duration-200 ${error ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-red-400 text-sm text-center font-medium">
          PIN incorrecto · {attemptsLeft} intento{attemptsLeft !== 1 ? 's' : ''} restante{attemptsLeft !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
        {keys.map((key, idx) => {
          if (key === '') return <div key={idx} />;
          if (key === 'del') {
            return (
              <button key={idx} onPointerDown={handleDelete}
                className="h-16 rounded-2xl bg-slate-700 text-white text-2xl font-light flex items-center justify-center active:bg-slate-600 active:scale-95 transition-all">
                ⌫
              </button>
            );
          }
          return (
            <button key={idx} onPointerDown={() => handleKey(key)}
              className="h-16 rounded-2xl bg-slate-700 text-white text-2xl font-semibold flex items-center justify-center active:bg-blue-600 active:scale-95 transition-all shadow-md">
              {key}
            </button>
          );
        })}
      </div>

      <p className="text-slate-600 text-xs mt-12">Acceso privado — no compartir</p>
    </div>
  );
}
