// src/router.jsx
import { createBrowserRouter, Navigate } from 'react-router-dom'

// Layouts for Admin and Vendor
import AdminLayout from './components/AdminLayout'
import VendorLayout from './components/VendorLayout'
import AuthLayout from './components/AuthLayout'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import VendorsList from './pages/admin/VendorsList'
import VendorDetail from './pages/admin/VendorDetail'
import CustomersList from './pages/admin/CustomersList'
import CustomerDetail from './pages/admin/CustomerDetail'
import OrdersAdmin from './pages/admin/OrdersAdmin'

// Vendor Pages
import VendorDashboard from './pages/vendor/Dashboard'
import ProductsVendor from './pages/vendor/ProductsVendor'
import OrdersVendor from './pages/vendor/OrdersVendor'
import VendorProfile from './pages/vendor/ProfileVendor'

// Auth Pages (for login/signup)
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'

const router = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/admin/dashboard" />
      },
      {
        path: '/admin/dashboard',
        element: <AdminDashboard />
      },
      {
        path: '/admin/vendors',
        element: <VendorsList />
      },
      {
        path: '/admin/vendors/:id',
        element: <VendorDetail />
      },
      {
        path: '/admin/customers',
        element: <CustomersList />
      },
      {
        path: '/admin/customers/:id',
        element: <CustomerDetail />
      },
      {
        path: '/admin/orders',
        element: <OrdersAdmin />
      },
    ]
  },
  {
    path: '/vendor',
    element: <VendorLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/vendor/dashboard" />
      },
      {
        path: '/vendor/dashboard',
        element: <VendorDashboard />
      },
      {
        path: '/vendor/products',
        element: <ProductsVendor />
      },
      {
        path: '/vendor/orders',
        element: <OrdersVendor />
      },
      {
        path: '/vendor/profile',
        element: <VendorProfile />
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: '/auth/login',
        element: <Login />
      },
      {
        path: '/auth/signup',
        element: <Signup />
      },
    ]
  },
  {
    path: '/',
    element: <Navigate to="/vendor/dashboard" />,
  },
])

export default router;
