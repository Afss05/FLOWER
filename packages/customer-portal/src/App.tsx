import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { useEffect } from 'react'
import i18n from './utils/i18n'
import { useUIStore } from './store/uiStore'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/home/HomePage'
import ProductListingPage from './pages/products/ProductListingPage'
import ProductDetailsPage from './pages/products/ProductDetailsPage'
import CartPage from './pages/cart/CartPage'
import CheckoutPage from './pages/checkout/CheckoutPage'
import OrdersPage from './pages/orders/OrdersPage'
import ProfilePage from './pages/profile/ProfilePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import NotFoundPage from './pages/not-found/NotFoundPage'
import SubscriptionPage from './pages/subscription/SubscriptionPage'
import ContactPage from './pages/contact/ContactPage'
import BlogsPage from './pages/blog/BlogsPage'
import FestivalCalendarPage from './pages/festivals/FestivalCalendarPage'

function App() {
  const { theme } = useUIStore()

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListingPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/subscribe" element={<SubscriptionPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogsPage />} />
            <Route path="/festivals" element={<FestivalCalendarPage />} />
          </Route>
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </I18nextProvider>
  )
}

export default App
