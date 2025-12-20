// frontend/src/store/useThemeStore.js
import { create } from "zustand";

export const useThemeStore = create((set) => ({
  // ✅ default to "light" theme
  theme: localStorage.getItem("chat-theme") || "light",

  // ✅ toggle between light and dark
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("chat-theme", newTheme);
      // apply immediately to <html> tag for frameworks like Tailwind/DaisyUI
      document.documentElement.setAttribute("data-theme", newTheme);
      return { theme: newTheme };
    });
  },

  // ✅ explicitly set theme (optional)
  setTheme: (theme) => {
    const finalTheme = theme === "dark" ? "dark" : "light";
    localStorage.setItem("chat-theme", finalTheme);
    document.documentElement.setAttribute("data-theme", finalTheme);
    set({ theme: finalTheme });
  },
}));
