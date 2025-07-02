// API Endpoints
export const API_BASE_URL = "http://127.0.0.1:8080";

// Public Routes
export const PUBLIC_ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/product/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ABOUT: '/about',
  CONTACT: '/contact'
};

// Admin Routes
export const ADMIN_ROUTES = {
  DASHBOARD: '/admin',
  PRODUCTS: '/admin/products',
  ORDERS: '/admin/orders',
  USERS: '/admin/users',
  SETTINGS: '/admin/settings'
};

// API Endpoints
export const API_ENDPOINTS = {
  PRODUCTS: {
    LIST: '/api/products',
    DETAIL: '/api/products/:id',
    CREATE: '/api/products',
    UPDATE: '/api/products/:id',
    DELETE: '/api/products/:id'
  },
  ORDERS: {
    LIST: '/api/orders',
    DETAIL: '/api/orders/:id',
    CREATE: '/api/orders',
    UPDATE: '/api/orders/:id'
  },
  USERS: {
    LIST: '/api/users',
    DETAIL: '/api/users/:id',
    CREATE: '/api/users',
    UPDATE: '/api/users/:id'
  },
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh'
  }
};
