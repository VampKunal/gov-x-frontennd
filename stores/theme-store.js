'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create()(
  persist(
    (set, get) => ({
      theme: 'dark', // default theme
      
      setTheme: (theme) => {
        set({ theme })
        // Apply theme to document
        if (typeof window !== 'undefined') {
          const root = document.documentElement
          root.classList.remove('light', 'dark')
          root.classList.add(theme)
        }
      },
      
      toggleTheme: () => {
        const currentTheme = get().theme
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
        get().setTheme(newTheme)
      },
      
      initializeTheme: () => {
        if (typeof window !== 'undefined') {
          const theme = get().theme
          const root = document.documentElement
          root.classList.remove('light', 'dark')
          root.classList.add(theme)
        }
      }
    }),
    {
      name: 'theme-storage',
    }
  )
)

export default useThemeStore