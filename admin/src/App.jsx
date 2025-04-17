import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './App.css'

// Pages
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailsPage from './pages/OrderDetailsPage'
import RidersPage from './pages/RidersPage'
import RiderDetailsPage from './pages/RiderDetailsPage'
import NotFoundPage from './pages/NotFoundPage'

// Components
import Layout from './components/layout/Layout'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth)
  
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
  
  if (!isAuthenticated) return <Navigate to="/login" replace />
  
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailsPage />} />
        <Route path="riders" element={<RidersPage />} />
        <Route path="riders/:id" element={<RiderDetailsPage />} />
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
