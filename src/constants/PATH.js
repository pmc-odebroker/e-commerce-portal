export const PATH = {
  // Admin routes
  ADMIN_HOME: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_VENDORS: '/admin/vendors',
  ADMIN_VENDOR_DETAIL: (id) => `/admin/vendors/${id}`,
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_CUSTOMER_DETAIL: (id) => `/admin/customers/${id}`,
  ADMIN_ORDERS: '/admin/orders',

  // Vendor routes
  VENDOR_HOME: '/vendor',
  VENDOR_DASHBOARD: '/vendor/dashboard',
  VENDOR_PRODUCTS: '/vendor/products',
  VENDOR_ORDERS: '/vendor/orders',
  VENDOR_PROFILE: '/vendor/profile',

  // Auth routes
  AUTH_HOME: '/auth',
  AUTH_LOGIN_ADMIN: '/auth/admin/login',
  AUTH_LOGIN_VENDOR: '/auth/vendor/login',
  AUTH_REGISTER: '/auth/vendor/register',

  // Default route
  HOME: '/',
};