import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PaperPosition {
  ticker: string;
  name: string;
  amount: number;
  avgPrice: number;
  currentPrice: number;
  currency: string;
}

export interface PaperTransaction {
  id: string;
  ticker: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  commission: number;
  timestamp: string;
}

interface PaperTradingState {
  // Portfolio
  balance: number; // Virtual cash
  positions: PaperPosition[];
  transactions: PaperTransaction[];
  
  // Actions
  buy: (ticker: string, name: string, amount: number, price: number, currency?: string) => boolean;
  sell: (ticker: string, amount: number, price: number) => boolean;
  reset: () => void;
  deposit: (amount: number) => void;
  
  // Computed
  getPortfolioValue: () => number;
  getTotalPnL: () => number;
  getPosition: (ticker: string) => PaperPosition | undefined;
}

const INITIAL_BALANCE = 100_000; // Start with $100,000 virtual

export const usePaperTradingStore = create<PaperTradingState>()(
  persist(
    (set, get) => ({
      balance: INITIAL_BALANCE,
      positions: [],
      transactions: [],

      buy: (ticker, name, amount, price, currency = 'USD') => {
        const totalCost = amount * price;
        const commission = totalCost * 0.001; // 0.1% commission
        const totalWithCommission = totalCost + commission;

        const state = get();
        if (state.balance < totalWithCommission) {
          return false; // Insufficient funds
        }

        set((state) => {
          const existingPosition = state.positions.find((p) => p.ticker === ticker);
          
          let newPositions: PaperPosition[];
          if (existingPosition) {
            // Update existing position
            const newAmount = existingPosition.amount + amount;
            const newAvgPrice = 
              (existingPosition.avgPrice * existingPosition.amount + price * amount) / newAmount;
            
            newPositions = state.positions.map((p) =>
              p.ticker === ticker
                ? { ...p, amount: newAmount, avgPrice: newAvgPrice, currentPrice: price }
                : p
            );
          } else {
            // Add new position
            newPositions = [
              ...state.positions,
              { ticker, name, amount, avgPrice: price, currentPrice: price, currency },
            ];
          }

          const transaction: PaperTransaction = {
            id: `paper_${Date.now()}`,
            ticker,
            type: 'buy',
            amount,
            price,
            total: totalCost,
            commission,
            timestamp: new Date().toISOString(),
          };

          return {
            balance: state.balance - totalWithCommission,
            positions: newPositions,
            transactions: [transaction, ...state.transactions],
          };
        });

        return true;
      },

      sell: (ticker, amount, price) => {
        const state = get();
        const position = state.positions.find((p) => p.ticker === ticker);
        
        if (!position || position.amount < amount) {
          return false; // Insufficient position
        }

        const totalRevenue = amount * price;
        const commission = totalRevenue * 0.001;
        const totalWithCommission = totalRevenue - commission;

        set((state) => {
          const newAmount = position.amount - amount;
          
          let newPositions: PaperPosition[];
          if (newAmount === 0) {
            // Remove position entirely
            newPositions = state.positions.filter((p) => p.ticker !== ticker);
          } else {
            // Update position
            newPositions = state.positions.map((p) =>
              p.ticker === ticker ? { ...p, amount: newAmount } : p
            );
          }

          const transaction: PaperTransaction = {
            id: `paper_${Date.now()}`,
            ticker,
            type: 'sell',
            amount,
            price,
            total: totalRevenue,
            commission,
            timestamp: new Date().toISOString(),
          };

          return {
            balance: state.balance + totalWithCommission,
            positions: newPositions,
            transactions: [transaction, ...state.transactions],
          };
        });

        return true;
      },

      reset: () => {
        set({
          balance: INITIAL_BALANCE,
          positions: [],
          transactions: [],
        });
      },

      deposit: (amount) => {
        set((state) => ({
          balance: state.balance + amount,
        }));
      },

      getPortfolioValue: () => {
        const state = get();
        return state.positions.reduce((sum, p) => sum + p.amount * p.currentPrice, 0);
      },

      getTotalPnL: () => {
        const state = get();
        const invested = state.transactions
          .filter((t) => t.type === 'buy')
          .reduce((sum, t) => sum + t.total, 0);
        const realized = state.transactions
          .filter((t) => t.type === 'sell')
          .reduce((sum, t) => sum + t.total, 0);
        const currentValue = state.positions.reduce(
          (sum, p) => sum + p.amount * p.currentPrice,
          0
        );
        return realized + currentValue - invested;
      },

      getPosition: (ticker) => {
        return get().positions.find((p) => p.ticker === ticker);
      },
    }),
    {
      name: 'vest-paper-trading',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
