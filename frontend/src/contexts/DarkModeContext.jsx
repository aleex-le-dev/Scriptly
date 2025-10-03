// Contexte pour gérer le mode sombre/clair
import { createContext, useContext, useState, useEffect } from 'react'

const DarkModeContext = createContext()

export function DarkModeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    // Vérifier le thème préféré du système ou localStorage
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      const darkMode = JSON.parse(saved)
      // Appliquer immédiatement la classe pour éviter le flash
      if (darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return darkMode
    }
    return false // Par défaut en mode clair
  })

  useEffect(() => {
    // Sauvegarder dans localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDark))
    
    // Appliquer la classe à l'élément html
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const toggleDarkMode = () => setIsDark(!isDark)

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider')
  }
  return context
}
