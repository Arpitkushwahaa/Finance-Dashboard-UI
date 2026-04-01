import { create } from 'zustand';

export type Role = 'viewer' | 'admin';
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2024-04-01', amount: 3500, category: 'Salary', type: 'income' },
  { id: '2', date: '2024-04-02', amount: 150, category: 'Groceries', type: 'expense' },
  { id: '3', date: '2024-04-04', amount: 80, category: 'Transport', type: 'expense' },
  { id: '4', date: '2024-04-05', amount: 120, category: 'Entertainment', type: 'expense' },
  { id: '5', date: '2024-04-10', amount: 200, category: 'Utilities', type: 'expense' },
  { id: '6', date: '2024-04-12', amount: 500, category: 'Freelance', type: 'income' },
  { id: '7', date: '2024-04-15', amount: 300, category: 'Shopping', type: 'expense' },
  { id: '8', date: '2024-04-20', amount: 100, category: 'Dining', type: 'expense' },
];

interface AppState {
  role: Role;
  setRole: (role: Role) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useStore = create<AppState>((set) => ({
  role: 'viewer',
  setRole: (role) => set({ role }),
  transactions: MOCK_TRANSACTIONS,
  addTransaction: (txn) => set((state) => ({
    transactions: [{ ...txn, id: Math.random().toString(36).substr(2, 9) }, ...state.transactions]
  })),
  deleteTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter(t => t.id !== id)
  })),
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode }))
}));
