import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SubscriptionTier = 'free' | 'investor' | 'trader' | 'pro';
export type ModuleId = 'unlimited_portfolio' | 'advanced_charts' | 'ai_analytics' | 'tax_reports' | 'api_access' | 'academy_full' | 'alerts' | 'export_data';

interface SubscriptionState {
  tier: SubscriptionTier;
  modules: ModuleId[];
  trialEndsAt: string | null;
  subscribedAt: string | null;
  expiresAt: string | null;
  cancelAtPeriodEnd: boolean;
  // Actions
  setTier: (tier: SubscriptionTier) => void;
  addModule: (module: ModuleId) => void;
  removeModule: (module: ModuleId) => void;
  startTrial: () => void;
  endTrial: () => void;
  // Computed
  isPremium: () => boolean;
  hasModule: (module: ModuleId) => boolean;
  isTrialActive: () => boolean;
  daysUntilExpiry: () => number;
  canAccess: (feature: ModuleId) => boolean;
}

const MODULES_BY_TIER: Record<SubscriptionTier, ModuleId[]> = {
  free: ['unlimited_portfolio'], // Actually limited to 5, but kept here for type safety
  investor: ['unlimited_portfolio', 'alerts', 'export_data', 'academy_full'],
  trader: ['unlimited_portfolio', 'alerts', 'export_data', 'academy_full', 'advanced_charts', 'ai_analytics', 'tax_reports'],
  pro: ['unlimited_portfolio', 'alerts', 'export_data', 'academy_full', 'advanced_charts', 'ai_analytics', 'tax_reports', 'api_access'],
};

const TRIAL_DAYS = 7;

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      tier: 'free',
      modules: [],
      trialEndsAt: null,
      subscribedAt: null,
      expiresAt: null,
      cancelAtPeriodEnd: false,

      setTier: (tier) => {
        const modules = MODULES_BY_TIER[tier];
        const now = new Date().toISOString();
        set({
          tier,
          modules,
          subscribedAt: now,
          expiresAt: tier === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
      },

      addModule: (module) => {
        const { modules } = get();
        if (!modules.includes(module)) {
          set({ modules: [...modules, module] });
        }
      },

      removeModule: (module) => {
        const { modules } = get();
        set({ modules: modules.filter((m) => m !== module) });
      },

      startTrial: () => {
        const trialEnds = new Date();
        trialEnds.setDate(trialEnds.getDate() + TRIAL_DAYS);
        set({
          tier: 'trader', // Give full trader during trial
          modules: MODULES_BY_TIER.trader,
          trialEndsAt: trialEnds.toISOString(),
        });
      },

      endTrial: () => {
        set({
          tier: 'free',
          modules: MODULES_BY_TIER.free,
          trialEndsAt: null,
        });
      },

      isPremium: () => {
        const { tier, isTrialActive } = get();
        return tier !== 'free' || isTrialActive();
      },

      hasModule: (module) => {
        const { modules } = get();
        return modules.includes(module);
      },

      isTrialActive: () => {
        const { trialEndsAt } = get();
        if (!trialEndsAt) return false;
        return new Date(trialEndsAt) > new Date();
      },

      daysUntilExpiry: () => {
        const { trialEndsAt, expiresAt, tier } = get();
        if (tier === 'free') return 0;
        const date = trialEndsAt || expiresAt;
        if (!date) return Infinity;
        const diff = new Date(date).getTime() - Date.now();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
      },

      canAccess: (feature) => {
        const { modules, isTrialActive } = get();
        // Free tier has special handling for portfolio limit
        if (feature === 'unlimited_portfolio') {
          return modules.includes(feature) || isTrialActive();
        }
        return modules.includes(feature) || isTrialActive();
      },
    }),
    {
      name: 'kazinvest-subscription',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Usage limits for free tier
export const FREE_LIMITS = {
  maxPositions: 5,
  maxAcademyLessons: 3,
  maxWatchlistItems: 1,
  maxAlerts: 0,
  maxExportPerMonth: 0,
} as const;

// Pricing display
export const PRICING = {
  free: { monthly: 0, yearly: 0, discount: 0 },
  investor: { monthly: 4.99, yearly: 49.99, discount: 0.17 }, // ~$4.17/mo
  trader: { monthly: 9.99, yearly: 99.99, discount: 0.17 },
  pro: { monthly: 19.99, yearly: 199.99, discount: 0.17 },
} as const;

// Telegram Stars equivalent (for markets where cards don't work)
export const STARS_PRICING = {
  investor: 500,  // ~$5
  trader: 1000,   // ~$10
  pro: 2000,      // ~$20
} as const;
