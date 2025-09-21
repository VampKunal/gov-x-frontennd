'use client'

import { useEffect } from 'react'
import useThemeStore from '@/stores/theme-store'

export function ThemeProvider({ children }) {
  const { initializeTheme } = useThemeStore()

  useEffect(() => {
    initializeTheme()
  }, [initializeTheme])

  return <>{children}</>
}