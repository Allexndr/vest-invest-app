import { api } from './api';

export interface AiChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface AiChatRequest {
  user_id: number;
  message: string;
  history?: AiChatMessage[];
  mode?: 'portfolio' | 'market' | 'analysis' | 'general';
  portfolio_context?: boolean;
}

export interface AiChatResponse {
  response: string;
  data?: {
    tickers?: string[];
    sentiment?: 'positive' | 'neutral' | 'negative';
    confidence?: number;
  };
}

export interface AiInsight {
  type: 'buy' | 'sell' | 'hold' | 'watch';
  ticker: string;
  reason: string;
  confidence: number; // 0-100
  risk_level: 'low' | 'medium' | 'high';
  timeframe: 'short' | 'medium' | 'long';
}

export interface PortfolioAnalysis {
  summary: string;
  health_score: number; // 0-100
  diversification: {
    score: number;
    by_sector: Record<string, number>;
    by_region: Record<string, number>;
    by_asset_type: Record<string, number>;
  };
  risk_analysis: {
    overall_risk: 'low' | 'medium' | 'high';
    volatility: number;
    beta: number;
    var_95: number; // Value at Risk
  };
  suggestions: Array<{
    type: 'add' | 'reduce' | 'rebalance' | 'hold';
    ticker?: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  tax_optimization: {
    harvested_losses: number;
    potential_savings: number;
    suggestions: string[];
  };
}

/**
 * Send message to AI assistant
 */
export async function chatWithAI(request: AiChatRequest): Promise<AiChatResponse> {
  const res = await api.post('/api/ai/chat', request);
  return res.data;
}

/**
 * Get AI insights for a specific ticker
 */
export async function getTickerInsight(ticker: string): Promise<AiInsight> {
  const res = await api.get(`/api/ai/insight/${ticker}`);
  return res.data;
}

/**
 * Get comprehensive portfolio analysis from AI
 */
export async function analyzePortfolio(userId: number): Promise<PortfolioAnalysis> {
  const res = await api.post('/api/ai/portfolio-analysis', { user_id: userId });
  return res.data;
}

/**
 * Get AI market outlook/summary
 */
export async function getMarketOutlook(): Promise<{
  summary: string;
  sentiment: 'bullish' | 'neutral' | 'bearish';
  key_themes: string[];
  risks: string[];
  opportunities: string[];
}> {
  const res = await api.get('/api/ai/market-outlook');
  return res.data;
}

/**
 * Get personalized daily briefing
 */
export async function getDailyBriefing(userId: number): Promise<{
  greeting: string;
  portfolio_summary: string;
  alerts: string[];
  recommendations: string[];
  market_news_summary: string;
}> {
  const res = await api.get(`/api/ai/daily-briefing/${userId}`);
  return res.data;
}

/**
 * Import portfolio from text via AI
 */
export async function importPortfolioWithAI(
  text: string, 
  userId: number,
  brokerAccount = 'Default'
): Promise<{
  added: number;
  failed: number;
  total: number;
  transactions: Array<{
    ticker: string;
    amount: number;
    price: number;
    success: boolean;
  }>;
}> {
  const res = await api.post('/api/portfolio/ai-import', {
    user_id: userId,
    text,
    broker_account: brokerAccount,
  });
  return res.data;
}

/**
 * Quick analysis for trading decision
 */
export async function quickAnalysis(ticker: string): Promise<{
  recommendation: 'buy' | 'sell' | 'hold';
  summary: string;
  technical_signals: string[];
  fundamental_signals: string[];
  risk_factors: string[];
  price_targets: {
    low: number;
    current: number;
    high: number;
  };
}> {
  const res = await api.get(`/api/ai/quick-analysis/${ticker}`);
  return res.data;
}
