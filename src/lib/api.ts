import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://kazinvest.vercel.app';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// Typed helpers
export async function getDashboardAll() {
  const res = await api.get('/api/dashboard/all');
  return res.data;
}

export async function getPortfolio(userId: number) {
  const res = await api.get(`/api/portfolio/${userId}`);
  return res.data;
}

export async function getMarketOverview() {
  const res = await api.get('/api/market/overview');
  return res.data;
}

export async function getNews(market = 'kz', limit = 10) {
  const res = await api.get('/api/news', { params: { market, limit } });
  return res.data;
}

export async function getAssetHistory(ticker: string, period = '1mo', interval = '1d') {
  const res = await api.get(`/api/asset/${ticker}/history`, { params: { period, interval } });
  return res.data;
}

export async function getAssetQuote(ticker: string) {
  const res = await api.get(`/api/market/quote/${ticker}`);
  return res.data;
}

export async function postTransaction(payload: {
  ticker: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  commission?: number;
  tax?: number;
  broker_account?: string;
  date?: string;
}) {
  const res = await api.post('/api/portfolio/transaction', payload);
  return res.data;
}

export async function getAcademyBlocks() {
  const res = await api.get('/api/academy/blocks');
  return res.data;
}

export async function getGoals(userId: number) {
  const res = await api.get(`/api/goals/${userId}`);
  return res.data;
}

export async function getDailyTasks() {
  const res = await api.get('/api/daily-tasks');
  return res.data;
}
