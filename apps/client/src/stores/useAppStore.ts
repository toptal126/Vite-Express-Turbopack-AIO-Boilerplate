import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  // Counter state
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;

  // User state
  user: {
    name: string;
    email: string;
  } | null;
  setUser: (user: { name: string; email: string }) => void;
  clearUser: () => void;

  // Loading state
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Counter state
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      reset: () => set({ count: 0 }),

      // User state
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),

      // Loading state
      isLoading: false,
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "app-store", // unique name for localStorage key
      // Only persist certain parts of the state (exclude loading state)
      partialize: (state) => ({
        count: state.count,
        user: state.user,
      }),
    }
  )
);
