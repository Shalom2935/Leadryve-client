import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Le contexte inclut maintenant une fonction login qui gère la redirection
const AuthContext = createContext<{
  isAuthenticated: boolean;
  login: (token: string, profileExists: boolean) => void;
  logout: () => void;
  token: string | null;
  isLoading: boolean;
  profileExists: boolean; // Added profileExists
} | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profileExists, setProfileExists] = useState<boolean>(() => { // Added state
    const storedProfileExists = localStorage.getItem('profileExists');
    return storedProfileExists ? JSON.parse(storedProfileExists) : false;
  });
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
    localStorage.setItem('profileExists', JSON.stringify(profileExists)); // Add this line
    setProfileExists(profileExists); // Add this line
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
    localStorage.removeItem('profileExists'); // Add this line
    setToken(null);
    setProfileExists(false); // Add this line
    navigate('/auth');
  }, [navigate]);

  if (isLoading) {
    return null; // Ou un spinner de chargement
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, login, logout, token, isLoading, profileExists }}>
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
  const { isAuthenticated, isLoading, profileExists } = useAuth(); // Destructure profileExists
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      return; // Wait for loading to finish
    }

    if (!isAuthenticated) {
      navigate('/auth'); // Redirect to login if not authenticated
    } else if (!profileExists) {
      // If authenticated but profile doesn't exist, redirect to profile setup
      // Only redirect if not already on the profile page to avoid loops
      if (window.location.pathname !== '/profile') {
        navigate('/profile');
      }
    }
  }, [isAuthenticated, profileExists, isLoading, navigate]); // Add dependencies

  if (isLoading || !isAuthenticated) return null;
  // If authenticated and profile exists, render children.
  // If authenticated and profile does not exist, the useEffect above will handle redirection.
  // We still need to ensure that if the user is on /profile and profileExists is false, they see the profile page.
  // The current logic handles this by not redirecting if window.location.pathname === '/profile'.
  return children;
}
