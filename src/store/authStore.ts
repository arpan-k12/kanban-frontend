import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getToken, getUser } from "../utils/storage";
import { logoutUser } from "../api/auth.api";

export type Permission = "can_add" | "can_edit" | "can_delete";

// export interface UserType {
//   id: string;
//   username: string;
//   role: "0" | "1";
//   //   permissions?: Permission[];
// }

interface AuthState {
  user: any | null;
  token: string | null;
  //   permissions: Permission[];
  login: (user: any, token: string) => void;
  logout: () => void;
  //   hasPermission: (perm: Permission) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: (user, token) => {
        set({
          user,
          token,
          // permissions: user.permissions || []
        });
      },

      logout: () => {
        logoutUser();
        set({
          user: null,
          token: null,
          // permissions: []
        });
      },

      // hasPermission: (perm) => get().permissions?.includes(perm) ?? false,
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
