import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Le contexte inclut maintenant une fonction login qui gère la redirection
const AuthContext = createContext<{
  isAuthenticated: boolean;
  login: (token: string, profileExists: boolean) => void;
  logout: () => void;
  token: string | null;
  isLoading: boolean; // Added isLoading
} | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((newToken: string, profileExists: boolean) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    // Redirection basée sur l'existence du profil
    if (profileExists) {
      navigate('/');
    } else {
      navigate('/profile');
    }
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile'); // Nettoyer aussi le cache du profil
    setToken(null);
    navigate('/auth');
  }, [navigate]);

  if (isLoading) {
    return null; // Ou un spinner de chargement
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, login, logout, token, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !isAuthenticated) return null;
  return children;
}
