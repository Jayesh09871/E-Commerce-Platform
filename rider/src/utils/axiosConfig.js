import axios from 'axios';

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: '',
  timeout: 10000,
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('riderToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Ensure Content-Type is set for all requests
    if (!config.headers['Content-Type'] && !config.headers.get('Content-Type')) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Handle specific error cases
    if (error.response) {
      // Handle unauthorized errors (401)
      if (error.response.status === 401 && !originalRequest._retry) {
        // If token expired or invalid, logout user
        if (localStorage.getItem('riderToken')) {
          localStorage.removeItem('riderToken');
          localStorage.removeItem('riderUser');
          window.location.href = '/login';
        }
      }
      
      // Return specific error message from API if available
      const errorMessage = 
        error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message;
          
      return Promise.reject(new Error(errorMessage));
    }
    
    // Handle network errors
    if (error.message === 'Network Error') {
      return Promise.reject(new Error('Network error - please check your connection'));
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
