import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5287";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const login = async (email, password) => {
    console.log(process.env);
    const response = await fetch(`${API_BASE_URL}/account/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setAuthTokens(data);
      localStorage.setItem('authTokens', JSON.stringify(data));
      navigate('/riskassessment'); // Redirect to a protected route after successful login
    } else {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    setAuthTokens(null);
    localStorage.removeItem('authTokens');
    navigate('/login');
  };

  const refreshToken = async () => {
    if (!authTokens) {
      return;
    }

    const response = await fetch(`${API_BASE_URL}/account/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: authTokens.refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      setAuthTokens(data);
      localStorage.setItem('authTokens', JSON.stringify(data));
      return true;
    } else {
      logout();
    }
  };

  useEffect(() => {
    if (authTokens) {
      const interval = setInterval(() => {
        refreshToken();
      }, 1000 * 60 * 1); // Refresh token every 2 minutes

      return () => clearInterval(interval);
    }
  }, [authTokens]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const getAuthHeaders = () => {
    if (authTokens && authTokens.accessToken) {
      return {
        Authorization: `Bearer ${authTokens.accessToken}`,
      };
    } else {
      logout();
      return {};
    }
  };

  return (
    <AuthContext.Provider value={{ authTokens, login, logout, getAuthHeaders , refreshToken }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
