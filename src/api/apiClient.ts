import axios from 'axios';

import {
  emitAuthRequired,
  emitAuthResolved,
  onAuthResolved,
} from './authEvents';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/',
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const skipUrls = ['/api/auth/refresh', '/api/auth/login'];
    if (skipUrls.includes(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failQueue.push({ resolve, reject });
      }).then(() => apiClient(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await apiClient.post('/api/auth/refresh');
      failQueue.forEach(({ resolve }) => resolve());
      failQueue = [];
      return apiClient(originalRequest);
    } catch (err) {
      failQueue.forEach(({ reject }) => reject(err));
      failQueue = [];

      return new Promise((resolve, reject) => {
        emitAuthRequired();

        onAuthResolved(() => {
          emitAuthResolved();
          apiClient(originalRequest).then(resolve).catch(reject);
        });
      });
    } finally {
      isRefreshing = false;
    }
  },
);
