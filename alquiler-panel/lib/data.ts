import { AppData, Room, Transaction } from './types';

export const defaultRooms: Room[] = [
  {
    id: 1,
    name: 'Hab 1',
    tenant: {
      name: 'Naima Benhir Gomez',
      phone: '',
      startDate: '2025-01-01',
      rentAmount: 400,
      notes: '',
    },
    isOccupied: true,
    depositPaid: true,
    depositAmount: 450,
    depositReturned: false,
  },
  {
    id: 2,
    name: 'Hab 2',
    tenant: {
      name: 'Naihara Rebeca Navas Jimenez',
      phone: '',
      startDate: '2025-01-01',
      rentAmount: 400,
      notes: '',
    },
    isOccupied: true,
    depositPaid: true,
    depositAmount: 430,
    depositReturned: false,
  },
  {
    id: 3,
    name: 'Hab 3',
    tenant: {
      name: 'Elina Loreta Ansevica',
      phone: '',
      startDate: '2026-01-20',
      rentAmount: 400,
      notes: '',
    },
    isOccupied: true,
    depositPaid: true,
    depositAmount: 450,
    depositReturned: false,
  },
  {
    id: 4,
    name: 'Hab 4',
    tenant: {
      name: 'Zofia Szejko',
      phone: '',
      startDate: '2025-01-01',
      rentAmount: 400,
      notes: 'Fianza pagada a través de plataforma',
    },
    isOccupied: true,
    depositPaid: true,
    depositAmount: 0,
    depositReturned: false,
  },
  {
    id: 5,
    name: 'Hab 5',
    tenant: {
      name: 'Amina Adday Brito',
      phone: '',
      startDate: '2026-04-01',
      rentAmount: 400,
      notes: 'Nueva inquilina desde abril 2026',
    },
    isOccupied: true,
    depositPaid: true,
    depositAmount: 450,
    depositReturned: false,
  },
];

const incomeTransactions: Transaction[] = [
  { id: 'inc-2026-06-01-1', date: '2026-06-01', description: 'Trastero Clemente', amount: 50, category: 'extra' },
  { id: 'inc-2026-05-30-1', date: '2026-05-30', description: 'Elina Loreta extras', amount: 19, category: 'alquiler' },
  { id: 'inc-2026-05-30-2', date: '2026-05-30', description: 'Zofia Szejko junio', amount: 468.46, category: 'alquiler' },
  { id: 'inc-2026-05-12-1', date: '2026-05-12', description: 'Stripe (Skamali)', amount: 420, category: 'alquiler' },
  { id: 'inc-2026-05-11-1', date: '2026-05-11', description: 'Garaje Mayo (María del Mar)', amount: 150, category: 'extra' },
  { id: 'inc-2026-05-08-1', date: '2026-05-08', description: 'Naihara mes Abril', amount: 470.56, category: 'alquiler' },
  { id: 'inc-2026-05-07-1', date: '2026-05-07', description: 'Naima alquiler Mayo', amount: 470.56, category: 'alquiler' },
  { id: 'inc-2026-05-06-1', date: '2026-05-06', description: 'Elina Loreta Mayo (450+40.56)', amount: 490.56, category: 'alquiler' },
  { id: 'inc-2026-05-01-1', date: '2026-05-01', description: 'Trastero Clemente', amount: 50, category: 'extra' },
  { id: 'inc-2026-04-29-1', date: '2026-04-29', description: 'Zofia Szejko Mayo', amount: 490.56, category: 'alquiler' },
  { id: 'inc-2026-04-21-1', date: '2026-04-21', description: 'Stripe (Szejko)', amount: 420, category: 'alquiler' },
  { id: 'inc-2026-04-10-1', date: '2026-04-10', description: 'Amina última parte fianza', amount: 60, category: 'fianza' },
  { id: 'inc-2026-04-08-1', date: '2026-04-08', description: 'Amina fianza', amount: 390, category: 'fianza' },
  { id: 'inc-2026-04-08-2', date: '2026-04-08', description: 'Elina Loreta Abril', amount: 469.55, category: 'alquiler' },
  { id: 'inc-2026-04-08-3', date: '2026-04-08', description: 'Stripe (Skamali)', amount: 369.18, category: 'alquiler' },
  { id: 'inc-2026-04-08-4', date: '2026-04-08', description: 'Naihara mes Abril', amount: 449.55, category: 'alquiler' },
  { id: 'inc-2026-04-07-1', date: '2026-04-07', description: 'Naima alquiler Abril', amount: 449.55, category: 'alquiler' },
  { id: 'inc-2026-04-05-1', date: '2026-04-05', description: 'Garaje Abril (María del Mar)', amount: 150, category: 'extra' },
  { id: 'inc-2026-04-04-1', date: '2026-04-04', description: 'Zofia Szejko Abril', amount: 469.55, category: 'alquiler' },
  { id: 'inc-2026-04-02-1', date: '2026-04-02', description: 'Trastero Clemente', amount: 50, category: 'extra' },
  { id: 'inc-2026-03-21-1', date: '2026-03-21', description: 'Rida Boulaich Nawar', amount: 200, category: 'otro' },
  { id: 'inc-2026-03-07-1', date: '2026-03-07', description: 'Naihara mes Marzo', amount: 454.52, category: 'alquiler' },
  { id: 'inc-2026-03-05-1', date: '2026-03-05', description: 'Naima alquiler Marzo', amount: 459.04, category: 'alquiler' },
  { id: 'inc-2026-03-04-1', date: '2026-03-04', description: 'Zofia Szejko Marzo (450+9.51)', amount: 459.51, category: 'alquiler' },
  { id: 'inc-2026-03-03-1', date: '2026-03-03', description: 'Elina Loreta Marzo', amount: 463.54, category: 'alquiler' },
  { id: 'inc-2026-03-03-2', date: '2026-03-03', description: 'Trastero Clemente', amount: 50, category: 'extra' },
  { id: 'inc-2026-03-02-1', date: '2026-03-02', description: 'Garaje Marzo (María del Mar)', amount: 150, category: 'extra' },
  { id: 'inc-2026-02-10-1', date: '2026-02-10', description: 'Stripe (Szejko)', amount: 420, category: 'alquiler' },
  { id: 'inc-2026-02-07-1', date: '2026-02-07', description: 'Naihara mes Febrero', amount: 456.11, category: 'alquiler' },
  { id: 'inc-2026-02-06-1', date: '2026-02-06', description: 'Garaje Febrero (María del Mar)', amount: 150, category: 'extra' },
  { id: 'inc-2026-02-04-1', date: '2026-02-04', description: 'Olga Okolovich Feb + Enero', amount: 476.11, category: 'alquiler' },
  { id: 'inc-2026-02-04-2', date: '2026-02-04', description: 'Stripe (Ansevica)', amount: 341.10, category: 'alquiler' },
  { id: 'inc-2026-02-04-3', date: '2026-02-04', description: 'Stripe (Szejko)', amount: 292.95, category: 'alquiler' },
  { id: 'inc-2026-02-03-1', date: '2026-02-03', description: 'Trastero Clemente', amount: 50, category: 'extra' },
  { id: 'inc-2026-02-01-1', date: '2026-02-01', description: 'Naima alquiler Febrero', amount: 456.11, category: 'alquiler' },
  { id: 'inc-2026-01-20-1', date: '2026-01-20', description: 'Depósito Elina Loreta Ansevica', amount: 450, category: 'fianza' },
  { id: 'inc-2026-01-07-1', date: '2026-01-07', description: 'Olga Okolovich Enero', amount: 498.69, category: 'alquiler' },
  { id: 'inc-2026-01-07-2', date: '2026-01-07', description: 'Naihara mes Enero', amount: 430, category: 'alquiler' },
  { id: 'inc-2026-01-06-1', date: '2026-01-06', description: 'Naima alquiler Enero', amount: 478.69, category: 'alquiler' },
  { id: 'inc-2026-01-04-1', date: '2026-01-04', description: 'Garaje Enero (María del Mar)', amount: 150, category: 'extra' },
  { id: 'inc-2026-01-03-1', date: '2026-01-03', description: 'Trastero Clemente', amount: 50, category: 'extra' },
  { id: 'inc-2026-01-02-1', date: '2026-01-02', description: 'Philippe Faustine Enero', amount: 498.69, category: 'alquiler' },
];

const expenseTransactions: Transaction[] = [
  { id: 'exp-2026-06-01-1', date: '2026-06-01', description: 'Comunidad Edificio Alegría', amount: -90.08, category: 'gasto' },
  { id: 'exp-2026-06-01-2', date: '2026-06-01', description: 'Wifi PTV Telecom', amount: -32.45, category: 'gasto' },
  { id: 'exp-2026-05-27-1', date: '2026-05-27', description: 'Luz TotalEnergies', amount: -59.86, category: 'gasto' },
  { id: 'exp-2026-05-05-1', date: '2026-05-05', description: 'Agua Empresa Municipal Aguas Málaga', amount: -96.87, category: 'gasto' },
  { id: 'exp-2026-05-04-1', date: '2026-05-04', description: 'Comunidad Edificio Alegría', amount: -90.08, category: 'gasto' },
  { id: 'exp-2026-05-04-2', date: '2026-05-04', description: 'Wifi PTV Telecom', amount: -32.45, category: 'gasto' },
  { id: 'exp-2026-05-01-1', date: '2026-05-01', description: 'Hipoteca (Préstamo 1)', amount: -630.29, category: 'gasto' },
  { id: 'exp-2026-04-30-1', date: '2026-04-30', description: 'Hipoteca (Préstamo 2)', amount: -428.55, category: 'gasto' },
  { id: 'exp-2026-04-27-1', date: '2026-04-27', description: 'Luz TotalEnergies', amount: -73.52, category: 'gasto' },
  { id: 'exp-2026-04-16-1', date: '2026-04-16', description: 'Devolución depósito Olga Okolovich', amount: -413.14, category: 'fianza' },
  { id: 'exp-2026-04-12-1', date: '2026-04-12', description: 'Devolución depósito Kira Kalinka', amount: -450, category: 'fianza' },
  { id: 'exp-2026-04-01-1', date: '2026-04-01', description: 'Comunidad Edificio Alegría', amount: -90.08, category: 'gasto' },
  { id: 'exp-2026-04-01-2', date: '2026-04-01', description: 'Hipoteca (Préstamo 1)', amount: -630.29, category: 'gasto' },
  { id: 'exp-2026-04-01-3', date: '2026-04-01', description: 'Wifi PTV Telecom', amount: -32.45, category: 'gasto' },
  { id: 'exp-2026-03-31-1', date: '2026-03-31', description: 'Hipoteca (Préstamo 2)', amount: -428.55, category: 'gasto' },
  { id: 'exp-2026-03-25-1', date: '2026-03-25', description: 'Luz TotalEnergies', amount: -65.32, category: 'gasto' },
  { id: 'exp-2026-03-04-1', date: '2026-03-04', description: 'Seguro Aegon', amount: -255.74, category: 'gasto' },
  { id: 'exp-2026-03-03-1', date: '2026-03-03', description: 'Hipoteca (Préstamo 1)', amount: -630.29, category: 'gasto' },
  { id: 'exp-2026-03-02-1', date: '2026-03-02', description: 'Wifi PTV Telecom', amount: -32.45, category: 'gasto' },
  { id: 'exp-2026-03-02-2', date: '2026-03-02', description: 'Comunidad Edificio Alegría', amount: -90.08, category: 'gasto' },
  { id: 'exp-2026-03-02-3', date: '2026-03-02', description: 'Agua Empresa Municipal Aguas Málaga', amount: -64.62, category: 'gasto' },
  { id: 'exp-2026-02-28-1', date: '2026-02-28', description: 'Hipoteca (Préstamo 2)', amount: -428.55, category: 'gasto' },
  { id: 'exp-2026-02-25-1', date: '2026-02-25', description: 'Luz Energía XXI', amount: -48.13, category: 'gasto' },
  { id: 'exp-2026-02-15-1', date: '2026-02-15', description: 'Devolución fianza Kira Kalinka', amount: -450, category: 'fianza' },
  { id: 'exp-2026-02-04-1', date: '2026-02-04', description: 'Luz Energía XXI', amount: -72.01, category: 'gasto' },
  { id: 'exp-2026-02-04-2', date: '2026-02-04', description: 'Seguro Mapfre', amount: -384.54, category: 'gasto' },
  { id: 'exp-2026-02-03-1', date: '2026-02-03', description: 'Hipoteca (Préstamo 1)', amount: -630.29, category: 'gasto' },
  { id: 'exp-2026-02-03-2', date: '2026-02-03', description: 'Wifi PTV Telecom', amount: -32.45, category: 'gasto' },
  { id: 'exp-2026-02-02-1', date: '2026-02-02', description: 'Comunidad Edificio Alegría', amount: -90.08, category: 'gasto' },
  { id: 'exp-2026-01-31-1', date: '2026-01-31', description: 'Hipoteca (Préstamo 2)', amount: -428.55, category: 'gasto' },
  { id: 'exp-2026-01-06-1', date: '2026-01-06', description: 'Seguro Santander Mi Hogar', amount: -288.41, category: 'gasto' },
  { id: 'exp-2026-01-02-1', date: '2026-01-02', description: 'Comunidad Edificio Alegría', amount: -90.08, category: 'gasto' },
  { id: 'exp-2026-01-02-2', date: '2026-01-02', description: 'Wifi PTV Telecom', amount: -32.45, category: 'gasto' },
  { id: 'exp-2026-01-01-1', date: '2026-01-01', description: 'Hipoteca (Préstamo 1)', amount: -630.29, category: 'gasto' },
];

export const defaultData: AppData = {
  rooms: defaultRooms,
  payments: [],
  transactions: [...incomeTransactions, ...expenseTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  ),
  fixedCosts: {
    hipoteca: 730,
    luzAgua: 120,
    comunidad: 90,
    wifi: 32,
  },
  extraIncome: {
    garaje: 150,
    trastero: 50,
  },
};

const STORAGE_KEY = 'alquiler-panel-data';

export function loadData(): AppData {
  if (typeof window === 'undefined') return defaultData;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as AppData;
      // Ensure all required fields exist (for migrations)
      return {
        ...defaultData,
        ...parsed,
        fixedCosts: { ...defaultData.fixedCosts, ...parsed.fixedCosts },
        extraIncome: { ...defaultData.extraIncome, ...parsed.extraIncome },
      };
    }
  } catch (e) {
    console.error('Error loading data:', e);
  }
  return defaultData;
}

export function saveData(data: AppData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving data:', e);
  }
}

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}
