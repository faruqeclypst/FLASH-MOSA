import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import './services/firebase'
import './styles/fonts.css'

// Pastikan element root ada dan belum digunakan
const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

// Cek apakah root element sudah memiliki properti _reactRootContainer
if (!(rootElement as any)._reactRootContainer) {
  const root = ReactDOM.createRoot(rootElement)
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}