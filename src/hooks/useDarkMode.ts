import { useCallback, useState } from 'react'

const STORAGE_KEY = 'kb-loan-helper-theme'

function getInitialDarkMode(): boolean {
  return document.documentElement.classList.contains('dark')
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState(getInitialDarkMode)

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
      return next
    })
  }, [])

  return { isDark, toggle }
}
