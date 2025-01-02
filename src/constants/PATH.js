export const PATH = {
  // Admin routes
  ADMIN_HOME: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_VENDORS: '/admin/vendors',
  ADMIN_VENDOR_DETAIL: (id) => `/admin/vendor/${id}`,
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_CUSTOMER_DETAIL: (id) => `/admin/customer/${id}`,
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_PRODUCT_STATUSES: '/admin/product-statuses',
  ADMIN_ORDERS: '/admin/orders',

  // Vendor routes
  VENDOR_HOME: '/vendor',
  VENDOR_DASHBOARD: '/vendor/dashboard',
  VENDOR_PRODUCTS: '/vendor/products',
  VENDOR_ORDERS: '/vendor/orders',
  VENDOR_PROFILE: '/vendor/profile',
  VENDOR_BULK_ORDERS: '/vendor/bulk-orders',
  VENDOR_SHIPPING_ORDERS: '/vendor/shipping-orders',
  VENDOR_INVETORY: '/vendor/inventory',
  VENDOR_PRICING: '/vendor/pricing',
  VENDOR_REVIEWS: '/vendor/reviews',
  VENDOR_COUPONS: '/vendor/coupons',
  VENDOR_RATINGS: '/vendor/ratings',
  VENDOR_MESSAGING: '/vendor/messaging',
  VENDOR_RETURNS: '/vendor/returns',
  VENDOR_FLASH_SALES: '/vendor/flash-sales',
  VENDOR_BANNERS: '/vendor/banners',
  VENDOR_SETTINGS: '/vendor/settings',
  VENDOR_PAYMENTS: '/vendor/payments',

  // Auth routes
  AUTH_HOME: '/auth',
  AUTH_ADMIN_LOGIN: '/auth/admin/login',
  AUTH_VENDOR_LOGIN: '/auth/vendor/login',
  AUTH_REGISTER: '/auth/vendor/register',

  // Default route
  HOME: '/',
};