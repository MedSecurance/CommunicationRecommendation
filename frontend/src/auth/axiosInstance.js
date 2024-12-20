import axios from 'axios';
import { AuthContext } from './AuthContext';
import React, { useContext } from 'react';

const useAxios = () => {
  const { authTokens, refreshTokens, logout } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL: '/api',
    headers: {
      Authorization: authTokens ? `Bearer ${authTokens.accessToken}` : null,
    },
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await refreshTokens();
          axiosInstance.defaults.headers['Authorization'] = `Bearer ${authTokens.accessToken}`;
          return axiosInstance(originalRequest);
        } catch (e) {
          logout();
          return Promise.reject(e);
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios;
