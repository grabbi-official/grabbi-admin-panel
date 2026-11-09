import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import Login from './pages/Login'
import Users from './pages/Users'
import Franchises from './pages/Franchises'
import FranchiseDetail from './pages/FranchiseDetail'
import Layout from './components/Layout'
import ExternalRedirect from './components/ExternalRedirect'
import { api, setLogoutHandler } from './utils/api'
import { ToastProvider } from './contexts/ToastContext'
import ErrorBoundary from './components/ErrorBoundary'

// Landing page for authenticated users. Dashboard has moved to HQ, so the
// panel now opens on Franchises — one of the two sections it still owns.
const HOME_PATH = '/franchises'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleLogout = useCallback(() => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_refresh_token')
    delete api.defaults.headers.common['Authorization']
    setIsAuthenticated(false)
  }, [])

  useEffect(() => {
    // Register the logout handler so the API interceptor can trigger React state changes
    setLogoutHandler(() => setIsAuthenticated(false))
  }, [])

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('admin_token')
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        try {
          // Validate token by calling a lightweight admin endpoint
          await api.get('/admin/products?limit=1')
          setIsAuthenticated(true)
        } catch {
          // Token is invalid or expired — clear it
          localStorage.removeItem('admin_token')
          delete api.defaults.headers.common['Authorization']
          setIsAuthenticated(false)
        }
      }
      setLoading(false)
    }
    validateToken()
  }, [])

  const handleLogin = (token) => {
    localStorage.setItem('admin_token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setIsAuthenticated(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Validating session...</div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
        <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={HOME_PATH} replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* Retired sections — now owned by the HQ app. These redirect out of
            the SPA regardless of auth state. */}
        <Route path="/dashboard" element={<ExternalRedirect />} />
        <Route path="/products" element={<ExternalRedirect />} />
        <Route path="/orders" element={<ExternalRedirect />} />
        <Route path="/categories" element={<ExternalRedirect />} />
        <Route path="/promotions" element={<ExternalRedirect />} />

        {/* Retained sections — Franchises and Users stay in the admin panel
            behind the login gate. */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Navigate to={HOME_PATH} replace />} />
          <Route path="franchises" element={<ErrorBoundary><Franchises /></ErrorBoundary>} />
          <Route path="franchises/:id" element={<ErrorBoundary><FranchiseDetail /></ErrorBoundary>} />
          <Route path="users" element={<ErrorBoundary><Users /></ErrorBoundary>} />
        </Route>

        {/* Anything else has moved to HQ. */}
        <Route path="*" element={<ExternalRedirect />} />
        </Routes>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
