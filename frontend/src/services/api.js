import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    const farmerInfo = localStorage.getItem('farmerInfo');
    
    let token = '';
    
    try {
      if (config.url.includes('/farmers') && farmerInfo) {
        token = JSON.parse(farmerInfo)?.token;
      } else if (userInfo) {
        token = JSON.parse(userInfo)?.token;
      } else if (farmerInfo) {
        token = JSON.parse(farmerInfo)?.token;
      }
    } catch (e) {
      console.error('Error parsing auth token', e);
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[API] Attached token for: ${config.url}`);
    } else {
      console.warn(`[API] No token found for: ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
