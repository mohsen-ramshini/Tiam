/* eslint-disable prettier/prettier */
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://37.152.183.111:8000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // ارسال کوکی‌ها به سرور
});

// گرفتن refreshToken از کوکی
const getRefreshToken = () => Cookies.get('refresh_token');

// ذخیره کردن توکن‌ها در کوکی
const saveTokens = (accessToken, refreshToken) => {
  Cookies.set('access_token', accessToken, { expires: 1, secure: false, sameSite: 'Lax' });
  Cookies.set('refresh_token', refreshToken, { expires: 7, secure: false, sameSite: 'Lax' });
};

axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage (or another storage mechanism)
    const token = Cookies.get('access_token'); // Replace with your token retrieval logic

    if (token) {
      // Set the Authorization header with the Bearer token
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  }
);
  

// Interceptor برای هندل کردن 401 و ریفرش توکن
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        

        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("❌ No refresh token found in cookies");
        }

        // ارسال refreshToken در بدنه
        const refreshResponse = await axios.post(`${API_BASE_URL}/users/refresh-token/`, {
          refresh: refreshToken,
        }, { withCredentials: true });

        
        const newAccessToken = refreshResponse.data.access;
        const newRefreshToken = refreshResponse.data.refresh;

        // ذخیره توکن‌های جدید
        saveTokens(newAccessToken, newRefreshToken);

        // اضافه کردن توکن جدید به درخواست اصلی و ارسال مجدد
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        // window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

