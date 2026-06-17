import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_LANGUAGE } from '@/lib/i18n';

interface LanguageState {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: DEFAULT_LANGUAGE,
      setLanguage: (lang) => set({ currentLanguage: lang }),
    }),
    {
      name: 'kazinvest-language',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
