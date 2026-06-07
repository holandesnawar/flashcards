export interface Tenant {
  name: string;
  phone?: string;
  startDate: string; // ISO date string
  rentAmount: number;
  notes?: string;
}

export interface Room {
  id: number;
  name: string; // "Hab 1", "Hab 2", etc.
  tenant: Tenant | null;
  isOccupied: boolean;
  depositPaid: boolean;
  depositAmount: number;
  depositReturned: boolean;
  depositReturnDate?: string;
}

export interface MonthlyPayment {
  roomId: number;
  month: string; // "2026-06" format
  paid: boolean;
  amount: number;
  paidDate?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number; // positive = income, negative = expense
  category: 'alquiler' | 'fianza' | 'gasto' | 'extra' | 'otro';
}

export interface AppData {
  rooms: Room[];
  payments: MonthlyPayment[];
  transactions: Transaction[];
  fixedCosts: {
    hipoteca: number;
    luzAgua: number;
    comunidad: number;
    wifi: number;
  };
  extraIncome: {
    garaje: number;
    trastero: number;
  };
}
