import React, { useContext, createContext, useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/btn.css';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const HOST = process.env.REACT_APP_API_HOST || '127.0.0.1:8000';
  const ROOT_URL = `http://${HOST}/api/v1`;

  const AxiosInstance = axios.create({
    baseURL: ROOT_URL,
  });

  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      AxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setAuthState(prevState => ({
        ...prevState,
        isAuthenticated: true,
        token: token,
      }));
    }
  }, []);

  const handleError = (error) => {
    let errorMsg = 'An error occurred. Please try again.';
    if (error.response && error.response.data.msg) {
      errorMsg = error.response.data.msg;
    } else if (error.request) {
      errorMsg = "No response from the server. Please check your internet connection and try again.";
    }
    console.error('Operation failed:', errorMsg);
    throw new Error(errorMsg);
  };

  const updateAuthState = ({ user, token }) => {
    localStorage.setItem('token', token);
    AxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setAuthState({
      isAuthenticated: true,
      user: user,
      token: token,
    });
  };

  const loginUser = async (endpoint, payload) => {
    try {
      const response = await AxiosInstance.post(endpoint, payload);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      updateAuthState({ user: response.data.userID, token: response.data.accessToken });
    } catch (error) {
      handleError(error);
    }
  };

  const signoutUser = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await AxiosInstance.post('/users/logout/post/', { refreshToken });
        console.log('Logout successful.');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
    localStorage.clear();
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
    window.location.href = '/';
  };

  const googleLogin = (user, token) => {
    updateAuthState({ user, token });
    console.log('Google login successful.');
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn: authState.isAuthenticated,
      authState,
      googleLogin,
      loginUser,
      signoutUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
