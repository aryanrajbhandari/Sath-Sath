import axios from 'axios';

const apiClient = axios.create({
  // Make sure this is exactly baseURL with capital U-R-L
  baseURL: 'http://127.0.0.1:8000/api/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');

                const response = await axios.post('http://127.0.0.1:8000/api/auth/token/refresh/', {
                    refresh: refreshToken
                });

                const newAccessToken = response.data.access;

                localStorage.setItem('access_token', newAccessToken);

                originalRequest.headers.Authorization = `bearer ${newAccessToken}`;

                return apiClient(originalRequest);
            }catch (refreshError) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
export default apiClient;