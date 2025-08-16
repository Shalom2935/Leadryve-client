import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from './useProfile'; // Import useProfile
import Spinner from '../components/ui/spinner'; // Import the Spinner component

// Le contexte inclut maintenant une fonction login qui gère la redirection
const AuthContext = createContext<{
  isAuthenticated: boolean;
  login: (token: string, profileExists: boolean) => void;
  logout: () => void;
  token: string | null;
  isLoadingAuth: boolean; // Renamed to avoid conflict
  profileExists: boolean;
} | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoading: isLoadingProfile } = useProfile(); // Get isLoading from useProfile
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true); // Renamed state
  const [profileExists, setProfileExists] = useState<boolean>(() => {
    const storedProfileExists = localStorage.getItem('profileExists');
    return storedProfileExists ? JSON.parse(storedProfileExists) : false;
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoadingAuth(false); // Use renamed state
  }, []);

  const login = useCallback((newToken: string, profileExists: boolean) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    localStorage.setItem('profileExists', JSON.stringify(profileExists));
    setProfileExists(profileExists);
    if (profileExists) {
      navigate('/');
    } else {
      navigate('/profile');
    }
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('profileExists');
    setToken(null);
    setProfileExists(false);
    navigate('/auth');
  }, [navigate]);

  // Combine loading states
  const isLoading = isLoadingAuth || isLoadingProfile;

  if (isLoading) {
    return <Spinner />; // Render the spinner component when loading
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, login, logout, token, isLoadingAuth: isLoadingAuth, profileExists }}>
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
  const { isAuthenticated, profileExists } = useAuth(); // Destructure profileExists
  const { isLoading: isLoadingProfile } = useProfile(); // Get profile loading state
  const navigate = useNavigate();

  // Determine overall loading state
  const isLoading = !isAuthenticated || isLoadingProfile; // If not authenticated, it's loading until redirected to auth. If authenticated, wait for profile.

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

  if (isLoading) return null; // Render null if still loading

  // If authenticated and profile exists, render children.
  // If authenticated and profile does not exist, the useEffect above will handle redirection.
  return children;
}
