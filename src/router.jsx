import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useStateContext } from './contexts/ContextProvider';
import PATH from './constants/ROUTER';

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

const ProtectedRoute = ({ children, role }) => {
  const { token, user } = useStateContext();
  if (!token) return <Navigate to={PATH.AUTH_LOGIN_VENDOR} />;
  if (role === 'admin' && user?.role !== 'admin') return <Navigate to={PATH.VENDOR_DASHBOARD} />;
  if (role === 'vendor' && user?.role !== 'vendor') return <Navigate to={PATH.ADMIN_DASHBOARD} />;
  return children;
};

const router = createBrowserRouter([

  /**
   * ADMIN URLS
   */
  {
    path: PATH.ADMIN_HOME,
    element: <ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>,
    children: [
      { path: '', element: <Navigate to={PATH.ADMIN_DASHBOARD} /> },
      { path: PATH.ADMIN_DASHBOARD, element: <AdminDashboard /> },
      { path: PATH.ADMIN_VENDORS, element: <VendorsList /> },
      { path: PATH.ADMIN_VENDOR_DETAIL(':id'), element: <VendorDetail /> },
      { path: PATH.ADMIN_CUSTOMERS, element: <CustomersList /> },
      { path: PATH.ADMIN_CUSTOMER_DETAIL(':id'), element: <CustomerDetail /> },
      { path: PATH.ADMIN_ORDERS, element: <OrdersAdmin /> },
    ]
  },

  /**
   * VENDOR URLS
   */
  {
    path: PATH.VENDOR_HOME,
    element: <ProtectedRoute role="vendor"><VendorLayout /></ProtectedRoute>,
    children: [
      { path: '', element: <Navigate to={PATH.VENDOR_DASHBOARD} /> },
      { path: PATH.VENDOR_DASHBOARD, element: <VendorDashboard /> },
      { path: PATH.VENDOR_PRODUCTS, element: <ProductsVendor /> },
      { path: PATH.VENDOR_ORDERS, element: <OrdersVendor /> },
      { path: PATH.VENDOR_PROFILE, element: <VendorProfile /> }
    ]
  },

  /**
   * AUTHENTICATION URLS
   */
  {
    path: PATH.AUTH_HOME,
    element: <AuthLayout />,
    children: [
      { path: '', element: <Navigate to={PATH.AUTH_LOGIN_VENDOR} /> },
      { path: PATH.AUTH_LOGIN_ADMIN, element: <AdminLogin /> },
      { path: PATH.AUTH_LOGIN_VENDOR, element: <VendorLogin /> },
      { path: PATH.AUTH_REGISTER, element: <Register /> },
    ]
  },

  /**
   * DEFAULT URL
   */
  { path: PATH.HOME, element: <Navigate to={PATH.AUTH_LOGIN_VENDOR} /> },
]);

export default router;