import React, { createContext, useContext, useState, useCallback } from 'react';
import { loginRequest, registerRequest } from '../api/authApi';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers: decode a JWT payload without a library
// ─────────────────────────────────────────────────────────────────────────────
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  return decoded.exp * 1000 < Date.now();
};

// ─────────────────────────────────────────────────────────────────────────────
// Initialise from localStorage so a page refresh keeps the user logged in
// ─────────────────────────────────────────────────────────────────────────────
const initAuthState = () => {
  const token = localStorage.getItem('token');
  const user  = localStorage.getItem('user');

  if (token && !isTokenExpired(token) && user) {
    return { token, user: JSON.parse(user) };
  }
  // Stale / expired – clean up
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return { token: null, user: null };
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(initAuthState);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (credentials) => {
    const { data } = await loginRequest(credentials);

    if (!data.success || !data.token) {
      throw new Error(data.error || 'Login failed');
    }

    const decoded = decodeToken(data.token);
    const user = { id: decoded?.id, role: decoded?.role };

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState({ token: data.token, user });

    return user;
  }, []);

  // ── Register ───────────────────────────────────────────────────────────────
  const register = useCallback(async (formData) => {
    const { data } = await registerRequest(formData);

    if (!data.success || !data.token) {
      throw new Error(data.error || 'Registration failed');
    }

    const decoded = decodeToken(data.token);
    const user = { id: decoded?.id, role: decoded?.role };

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState({ token: data.token, user });

    return user;
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({ token: null, user: null });
  }, []);

  const isAuthenticated = Boolean(
    authState.token && !isTokenExpired(authState.token)
  );

  const isAdmin = isAuthenticated && authState.user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        token: authState.token,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ── Convenience hook ──────────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export default AuthContext;
