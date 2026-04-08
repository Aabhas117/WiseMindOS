import axios from 'axios';

const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const axiosInstance = axios.create({
    baseURL: backendURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.token = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('wisemind_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;