import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts for Admin and Vendor
import AdminLayout from './components/AdminLayout';
import VendorLayout from './components/VendorLayout';
import AuthLayout from './components/AuthLayout';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import VendorsList from './pages/admin/VendorsList';
import VendorDetail from './pages/admin/VendorDetails';
import CustomersList from './pages/admin/CustomersList';
import CustomerDetail from './pages/admin/CustomerDetails';
import OrdersAdmin from './pages/admin/OrdersAdmin';

// Vendor Pages
import VendorDashboard from './pages/vendor/Dashboard';
import ProductsVendor from './pages/vendor/ProductsVendor';
import OrdersVendor from './pages/vendor/OrdersVendor';
import VendorProfile from './pages/vendor/ProfileVendor';

// Auth Pages (for login/signup)
import AdminLogin from './pages/auth/AdminLogin';
import VendorLogin from './pages/auth/VendorLogin';
import Register from './pages/auth/Register';

import { useStateContext } from './contexts/ContextProvider';

const ProtectedRoute = ({ children, role }) => {
  const { token, user } = useStateContext();

  // If not authenticated, redirect to vendor login
  if (!token) {
    return <Navigate to="/auth/vendor/login" />;
  }

  // Redirect based on role
  if (role === 'admin' && user?.role !== 'admin') {
    return <Navigate to="/vendor/dashboard" />;
  }
  if (role === 'vendor' && user?.role !== 'vendor') {
    return <Navigate to="/admin/dashboard" />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: '/admin',
    element: (
      <ProtectedRoute role="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="/admin/dashboard" />
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />
      },
      {
        path: 'vendors',
        element: <VendorsList />
      },
      {
        path: 'vendors/:id',
        element: <VendorDetail />
      },
      {
        path: 'customers',
        element: <CustomersList />
      },
      {
        path: 'customers/:id',
        element: <CustomerDetail />
      },
      {
        path: 'orders',
        element: <OrdersAdmin />
      },
    ]
  },
  {
    path: '/vendor',
    element: (
      <ProtectedRoute role="vendor">
        <VendorLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="/vendor/dashboard" />
      },
      {
        path: 'dashboard',
        element: <VendorDashboard />
      },
      {
        path: 'products',
        element: <ProductsVendor />
      },
      {
        path: 'orders',
        element: <OrdersVendor />
      },
      {
        path: 'profile',
        element: <VendorProfile />
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="/auth/vendor/login" />
      },
      {
        path: 'admin/login',
        element: <AdminLogin />
      },
      {
        path: 'vendor/login',
        element: <VendorLogin />
      },
      {
        path: 'vendor/register',
        element: <Register />
      },
    ]
  },
  {
    path: '/',
    element: <Navigate to="/auth/vendor/login" />
  },
]);

export default router;
