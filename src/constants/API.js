const API = {

    /**
     * AUTH API
     */
    ADMIN_LOGIN: "/auth/admin/login",
    VENDOR_LOGIN: "/auth/vendor/login",
    VENDOR_REGISTER: "/auth/vendor/register",
    LOGOUT: "/auth/logout",

    /**
     * ADMIN API
     */
    VENDORS: "/admin/vendors",
    CATEGORIES: "/admin/categories",
    PRODUCT_STATUSES: "/admin/product-statuses",
    ADMIN_PRODUCTS: "/admin/products",
    ADMIN_ORDERS: "/admin/orders",
    ADMIN_BANNERS: '/admin/banners',
    ADMIN_BANNER:(bannerId) => `/admin/banners/${bannerId}`,
    ADMIN_BANNERS_UPDATE:(bannerId) => `/admin/banners/${bannerId}`,
    ADMIN_BANNERS_ARCHIVE:(bannerId) => `/admin/banners/${bannerId}/archive`,
    ADMIN_SPECIFICATIONS: '/admin/specifications',
    ADMIN_SPECIFICATION:(id) => `/admin/specifications/${id}`,
    ADMIN_SPECIFICATIONS_UPDATE:(id) => `/admin/specifications/${id}`,

    /**
     * VENDOR API
     */
    VENDOR_PRODUCTS: "/vendor/products",
    VENDOR_PRODUCT:(id) => `/vendor/products/${id}`,
    VENDOR_PRODUCT_UPDATE:(id) => `/vendor/products/${id}`,
    VENDOR_ORDERS: "/vendor/orders",
  };
  
  export default API;
  