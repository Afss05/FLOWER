import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import DashboardPage from './pages/dashboard/DashboardPage'
import OrdersPage from './pages/orders/OrdersPage'
import ProductsPage from './pages/products/ProductsPage'
import CustomersPage from './pages/customers/CustomersPage'
import AnalyticsPage from './pages/analytics/AnalyticsPage'
import SettingsPage from './pages/settings/SettingsPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
