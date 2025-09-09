import { create } from "zustand";
import { persist } from "zustand/middleware";
import { logoutUser } from "../api/auth.api";

interface AuthState {
  user: any | null;
  token: string | null;
  //   permissions: Permission[];
  permissions: {
    flat: string[];
    byFeature: Record<string, string[]>;
  } | null;
  login: (user: any, token: string) => void;
  logout: () => void;
  hasPermission: (perm: string, feature?: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      permissions: null,

      login: (user, token) => {
        set({
          user,
          token,
          permissions: user.permissions || { flat: [], byFeature: {} },
        });
      },

      logout: () => {
        logoutUser();
        set({
          user: null,
          token: null,
          permissions: null,
        });
      },

      hasPermission: (perm: any, feature: any) => {
        const { permissions } = get();

        if (!permissions) return false;

        if (feature) {
          return permissions.byFeature[feature]?.includes(perm) ?? false;
        }

        return permissions.flat.includes(perm);
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        permissions: state.permissions,
      }),
    }
  )
);
