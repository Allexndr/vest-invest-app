import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode, getColors } from '@/lib/theme';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
  colors: ReturnType<typeof getColors>;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'dark',
      colors: getColors('dark'),
      setMode: (mode) => set({ mode, colors: getColors(mode) }),
      toggle: () => {
        const next = get().mode === 'dark' ? 'light' : 'dark';
        set({ mode: next, colors: getColors(next) });
      },
    }),
    {
      name: 'kazinvest-theme',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
