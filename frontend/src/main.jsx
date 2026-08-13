import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles.css'

const root = document.getElementById('root')

// --- Diagnostic: surface any error ON the page (so it isn't a silent white screen) ---
function showError(title, detail) {
  root.innerHTML =
    '<div style="max-width:820px;margin:40px auto;padding:24px;border:2px solid #c62828;' +
    'border-radius:12px;font-family:ui-monospace,Menlo,Consolas,monospace;color:#111;background:#fff">' +
    '<h2 style="color:#c62828;margin:0 0 12px">⚠️ ' + title + '</h2>' +
    '<pre style="white-space:pre-wrap;word-break:break-word;margin:0">' +
    String(detail).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c])) +
    '</pre></div>'
}
window.addEventListener('error', (e) => showError('JavaScript error', e.error?.stack || e.message))
window.addEventListener('unhandledrejection', (e) => showError('Unhandled promise rejection', e.reason?.stack || e.reason))

class ErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null } }
  static getDerivedStateFromError(err) { return { err } }
  componentDidCatch(err, info) { showError('React render error', (err?.stack || err) + '\n\n' + info.componentStack) }
  render() { return this.state.err ? null : this.props.children }
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
