const API_ENDPOINTS = {
    ADMIN_LOGIN: "/auth/admin/login",
    CATEGORIES: "/admin/categories",
    CATEGORY: (id) => `/admin/category/${id}`,
    VENDOR_LOGIN: "/auth/vendor/login",
    VENDOR_REGISTER: "/auth/vendor/register",
    VENDORS: "admin/vendors",
    GET_PRODUCTS: "/products",
    GET_ORDERS: "/orders",
    LOGOUT: "/auth/logout"
  };
  
  export default API_ENDPOINTS;
  