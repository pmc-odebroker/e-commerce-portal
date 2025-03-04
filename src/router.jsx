import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useStateContext } from './contexts/ContextProvider';
import {PATH} from './constants/PATH';

// Layouts for Admin and Vendor
import AdminLayout from './components/AdminLayout';
import VendorLayout from './components/VendorLayout';
import AuthLayout from './components/AuthLayout';

// Admin Pages
import VendorsList from './pages/admin/VendorsList';
import VendorDetail from './pages/admin/VendorDetails';
import CustomersList from './pages/admin/CustomersList';
import CustomerDetail from './pages/admin/CustomerDetails';
import OrdersAdmin from './pages/admin/OrdersAdmin';
import Categories from './pages/admin/Categories';
import ProductStatus from './pages/admin/ProductStatus';
import Banners from './pages/admin/Banners';
import Specifications from './pages/admin/Specifications';
import SubCategories from './pages/admin/SubCategories';


// Vendor Pages
import VendorProducts from './pages/vendor/VendorProducts';
import VendorProductDetails from './pages/vendor/VendorProductDetails';
import OrdersVendor from './pages/vendor/OrdersVendor';
import VendorProfile from './pages/vendor/VendorProfile';

// Auth Pages (for login/signup)
import AdminLogin from './pages/auth/AdminLogin';
import VendorLogin from './pages/auth/VendorLogin';
import Register from './pages/auth/Register';
import VendorDashboard from './pages/vendor/VendorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

const ProtectedRoute = ({ children}) => {
  const { token, user } = useStateContext();
  return children;
};

export const router = createBrowserRouter([

  /**
   * ADMIN URLS
   */
  {
    path: PATH.ADMIN_HOME,
    element: <ProtectedRoute ><AdminLayout /></ProtectedRoute>,
    children: [
      { path: '', element: <Navigate to={PATH.ADMIN_DASHBOARD} /> },
      { path: PATH.ADMIN_DASHBOARD, element: <AdminDashboard /> },
      { path: PATH.ADMIN_VENDORS, element: <VendorsList /> },
      { path: PATH.ADMIN_VENDOR_DETAIL(':id'), element: <VendorDetail /> },
      { path: PATH.ADMIN_CUSTOMERS, element: <CustomersList /> },
      { path: PATH.ADMIN_CUSTOMER_DETAIL(':id'), element: <CustomerDetail /> },
      { path: PATH.ADMIN_ORDERS, element: <OrdersAdmin /> },
      { path: PATH.ADMIN_CATEGORIES, element: <Categories /> },
      { path: PATH.ADMIN_SUBCATEGORIES, element: <SubCategories /> },
      { path: PATH.ADMIN_PRODUCT_STATUSES, element: <ProductStatus /> },
      { path: PATH.ADMIN_BANNERS, element: <Banners />},
      { path: PATH.ADMIN_SPECIFICATIONS, element: <Specifications />},
    ]
  },

  /**
   * VENDOR URLS
   */
  {
    path: PATH.VENDOR_HOME,
    element: <ProtectedRoute ><VendorLayout /></ProtectedRoute>,
    children: [
      { path: '', element: <Navigate to={PATH.VENDOR_DASHBOARD} /> },
      { path: PATH.VENDOR_DASHBOARD, element: <VendorDashboard /> },
      { path: PATH.VENDOR_PRODUCTS, element: <VendorProducts /> },
      { path: PATH.VENDOR_PRODUCT(':id'), element: <VendorProductDetails /> },
      { path: PATH.VENDOR_ORDERS, element: <OrdersVendor /> },
      { path: PATH.VENDOR_PROFILE, element: <VendorProfile /> },
    ]
  },

  /**
   * AUTHENTICATION URLS
   */
  {
    path: PATH.AUTH_HOME,
    element: <AuthLayout />,
    children: [
      { path: '', element: <Navigate to={PATH.AUTH_VENDOR_LOGIN} /> },
      { path: PATH.AUTH_ADMIN_LOGIN, element: <AdminLogin /> },
      { path: PATH.AUTH_VENDOR_LOGIN, element: <VendorLogin /> },
      { path: PATH.AUTH_REGISTER, element: <Register /> },
    ]
  },

  /**
   * DEFAULT URL
   */
  { path: PATH.HOME, element: <Navigate to={PATH.AUTH_VENDOR_LOGIN} /> },
]);