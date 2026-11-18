import { useState, useCallback, useEffect } from 'react';
import { apiRequest } from '@/services/api-client';

const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';
const AUTH_CHANGE_EVENT = 'pooja-admin-auth-change';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  useEffect(() => {
    const syncAuth = () => {
      setToken(getStoredToken());
      setUser(getStoredUser());
    };
    window.addEventListener('storage', syncAuth);
    window.addEventListener(AUTH_CHANGE_EVENT, syncAuth);
    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener(AUTH_CHANGE_EVENT, syncAuth);
    };
  }, []);

  const getToken = useCallback((): string | null => {
    return getStoredToken();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<LoginResponse> => {
    const data = await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem(TOKEN_KEY, data.access_token);
    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    setToken(data.access_token);
    setUser(data.user ?? null);
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }, []);

  const isAuthenticated = Boolean(token);

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    getToken,
  };
}

export default useAuth;

