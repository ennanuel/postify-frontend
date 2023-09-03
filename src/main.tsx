import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.tsx'
import { DarkModeContextProvider } from './context/darkModeContext.tsx';
import { AuthContextProvider } from './context/authContext.tsx';
import './index.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <AuthContextProvider>
        <DarkModeContextProvider>
          <App />
        </DarkModeContextProvider>
      </AuthContextProvider>
    </Router>
  </React.StrictMode>,
)
