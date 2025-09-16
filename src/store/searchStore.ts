import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      clearSearch: () => set({ searchQuery: "" }),
    }),
    {
      name: "search-storage",
      partialize: (state) => ({ searchQuery: state.searchQuery }),
    }
  )
);
