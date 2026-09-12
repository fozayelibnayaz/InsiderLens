export type InsiderRole = 'CEO' | 'CFO' | 'Director' | 'Officer';

export type TransactionType = 'purchase' | 'sale';

export type SignalStrength = 'High' | 'Medium' | 'Low';

export type InsiderTrade = {
  id: string;
  ticker: string;
  company: string;
  sector: string;
  insider: string;
  role: InsiderRole;
  type: TransactionType;
  transactionCode: 'P' | 'S';
  shares: number;
  pricePerShare: number;
  value: number;
  transactionDate: string;
  filedAt: string;
  signal: string;
  signalStrength: SignalStrength;
  weeklyActivity: number[];
};