import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import AuthDataContextProvider from './context/authContext.tsx'
import { MessageProvider } from './context/messageContext.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <AuthDataContextProvider>
    <MessageProvider>
    <App />
    </MessageProvider>
    </AuthDataContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
