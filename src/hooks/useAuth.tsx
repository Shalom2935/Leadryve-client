import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from './useProfile'; // Import useProfile
import Spinner from '../components/ui/spinner'; // Import the Spinner component

const AuthContext = createContext<{
  isAuthenticated: boolean;
  login: (token: string) => void; // Removed profileExists from login signature
  logout: () => void;
  token: string | null;
  isLoadingAuth: boolean;
} | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  // Removed profileExists state from AuthProvider
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoadingAuth(false);
  }, []);

  const login = useCallback((newToken: string) => { // Removed profileExists parameter
    localStorage.setItem('token', newToken);
    setToken(newToken);
    // Removed localStorage.setItem('profileExists', JSON.stringify(profileExists));
    // Removed setProfileExists(profileExists);
    // The logic for redirecting based on profile existence will be handled by ProfileProvider
    navigate('/'); // Default redirect to home, ProfileProvider will handle profile-specific redirects
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    // Removed localStorage.removeItem('profileExists');
    setToken(null);
    // Removed setProfileExists(false);
    navigate('/auth');
  }, [navigate]);

  const isLoading = isLoadingAuth;

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, login, logout, token, isLoadingAuth: isLoadingAuth }}>
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
  const { isAuthenticated, isLoadingAuth } = useAuth(); // Removed profileExists from destructuring
  const { profile, isLoading: isLoadingProfile } = useProfile(); // Import profile and its loading state
  const navigate = useNavigate();

  // Determine overall loading state by combining auth and profile loading
  const isLoading = isLoadingAuth || isLoadingProfile;

  useEffect(() => {
    // Only proceed with redirection logic if loading is complete
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/auth'); // Redirect to login if not authenticated
      } else if (!isLoadingProfile && !profile) { // Check if profile exists using the profile object
        // If authenticated but profile doesn't exist, redirect to profile setup
        // Only redirect if not already on the profile page to avoid loops
        if (window.location.pathname !== '/profile') {
          navigate('/profile');
        }
      }
    }
  }, [isAuthenticated, profile, isLoading, isLoadingProfile, navigate]); // Add profile and isLoading to dependencies

  // Render null if still loading to prevent flickering or incorrect UI
  if (isLoading) return null;

  // If authenticated and profile exists, render children.
  // If authenticated and profile does not exist, the useEffect above will handle redirection.
  return children;
}
