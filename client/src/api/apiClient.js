import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 60000,
});

// Request interceptor: attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('onss_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on protected route, clean stored token
      const currentPath = window.location.pathname;
      if (
        currentPath.startsWith('/dashboard') ||
        currentPath.startsWith('/notes/new') ||
        currentPath.startsWith('/manage-notes') ||
        currentPath.startsWith('/profile') ||
        currentPath.startsWith('/settings') ||
        currentPath.startsWith('/admin')
      ) {
        localStorage.removeItem('onss_token');
        localStorage.removeItem('onss_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
