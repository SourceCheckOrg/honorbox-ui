import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import Router  from 'next/router';
import api from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserFromCookies() {
      const token = Cookies.get('token');
      if (token) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        try {
          const res = await api.get('users/me');
          const fetchedUser = res.data;
          if (fetchedUser && !user) {
            setUser(fetchedUser);
          }
        } catch (err) {
          if (err.message.indexOf('401') !== -1) {
            Cookies.remove('token');
          };
        }
      }
      setLoading(false);
    }
    loadUserFromCookies();
  }, []);

  const logout = (email, password) => {
    Cookies.remove('token');
    setUser(null);
    delete api.defaults.headers.Authorization;
    window.localStorage.setItem('logout', Date.now()); // sync logout between multiple windows
    Router.push('/')
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isReady: !!user && !loading,
        user,
        setUser,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
