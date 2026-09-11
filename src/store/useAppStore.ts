import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AppState {
  themeMode: "light" | "dark";
  draftTitle: string;
  toggleTheme: () => void;
  setDraftTitle: (title: string) => void;
  reset: () => void;
}

const initialState = {
  themeMode: "light" as const,
  draftTitle: "",
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        toggleTheme: () =>
          set(
            (s) => ({ themeMode: s.themeMode === "light" ? "dark" : "light" }),
            false,
            "toggleTheme",
          ),
        setDraftTitle: (draftTitle) => set({ draftTitle }, false, "setDraftTitle"),
        reset: () => set(initialState, false, "reset"),
      }),
      { name: "app-store" },
    ),
    { name: "AppStore" },
  ),
);
