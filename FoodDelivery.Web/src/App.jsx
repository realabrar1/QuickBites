import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { RestaurantsPage } from './pages/RestaurantsPage';
import { RestaurantDetailPage } from './pages/RestaurantDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { RestaurantDashboardPage } from './pages/RestaurantDashboardPage';
import { DeliveryDashboardPage } from './pages/DeliveryDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/restaurants" element={<RestaurantsPage />} />
                <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Customer Protected Routes */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-tracking/:id"
                  element={
                    <ProtectedRoute>
                      <OrderTrackingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrderHistoryPage />
                    </ProtectedRoute>
                  }
                />

                {/* Partner & Admin Protected Routes */}
                <Route
                  path="/restaurant-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['RestaurantOwner', 'Admin']}>
                      <RestaurantDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/delivery-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['DeliveryPartner', 'Admin']}>
                      <DeliveryDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
