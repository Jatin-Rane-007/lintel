import { create } from 'zustand';

interface UserStore {
  /** Whether the signed-in person may add and manage listings. */
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
}

/**
 * Session-adjacent state only. Names, avatars and email stay in Clerk, which
 * is already the source of truth for them.
 */
export const useUserStore = create<UserStore>((set) => ({
  isAdmin: false,
  setIsAdmin: (value) => set({ isAdmin: value }),
}));
