import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import { TeamProvider } from './contexts/TeamContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <FavoritesProvider>
          <TeamProvider>
            <App />
          </TeamProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
