import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';

const VALID_USERNAME = 'Isha';
const VALID_PASSWORD = 'isha@123';
const AUTH_STORAGE_KEY = 'marketing_learning_auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.isAuthenticated) {
          setUser(parsed);
        }
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((username: string, password: string): { success: boolean; error?: string } => {
    // Case-insensitive username comparison
    if (username.toLowerCase() === VALID_USERNAME.toLowerCase() && password === VALID_PASSWORD) {
      const userData: User = {
        username: VALID_USERNAME,
        isAuthenticated: true,
      };
      setUser(userData);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user?.isAuthenticated,
    login,
    logout,
  };
}
