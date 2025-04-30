// Import Pinia
import { defineStore } from 'pinia';

export const useTheme = defineStore('theme', {
  state: () => ({
    // State
    theme: localStorage.getItem('theme') || 'light',
  }),
  actions: {
    // Action
    changeTheme() {
      // Toggle the theme
      const newTheme = this.theme === 'light' ? 'dark' : 'light';

      // Set new theme
      this.setTheme(newTheme);
    },

    // Action setTheme
    setTheme(newTheme) {
      // set state
      this.theme = newTheme;  

      // Set new theme to local storage
      localStorage.setItem('theme', newTheme);

      // Set new theme to document element
      document.documentElement.setAttribute('data-bs-theme', newTheme);
    }
  },
});