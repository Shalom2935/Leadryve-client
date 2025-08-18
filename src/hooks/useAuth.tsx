import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/ui/spinner';
import { useAuthStore } from '../store/authStore'; // Import the Zustand store

export function useAuth() {
  const { isAuthenticated, login, logout, token, isLoadingAuth } = useAuthStore();
  return { isAuthenticated, login, logout, token, isLoadingAuth };
}

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoadingAuth, profile, isLoadingProfile } = useAuthStore();
  const navigate = useNavigate();

  const overallLoading = isLoadingAuth || isLoadingProfile;

  useEffect(() => {
    console.log("RequireAuth Effect - isAuthenticated:", isAuthenticated, "profile:", profile ? "Exists" : "Null", "isLoadingAuth:", isLoadingAuth, "isLoadingProfile:", isLoadingProfile, "overallLoading:", overallLoading, "currentPath:", window.location.pathname);

    if (!overallLoading) {
      console.log("RequireAuth Effect - Loading complete. Checking redirection conditions.");
      if (!isAuthenticated) {
        console.log("RequireAuth Effect - Not authenticated, navigating to /auth");
        navigate('/auth');
      } else if (!profile) {
        console.log("RequireAuth Effect - Authenticated but profile is null, checking current path.");
        if (window.location.pathname !== '/profile') {
          console.log("RequireAuth Effect - Not on /profile, navigating to /profile");
          navigate('/profile');
        } else {
          console.log("RequireAuth Effect - Already on /profile, no redirection needed.");
        }
      } else {
        console.log("RequireAuth Effect - Authenticated and profile exists. No redirection needed by RequireAuth.");
      }
    } else {
      console.log("RequireAuth Effect - Still loading (auth or profile), waiting...");
    }
  }, [isAuthenticated, profile, isLoadingAuth, isLoadingProfile, overallLoading, navigate]);

  if (overallLoading) {
    return <Spinner />;
  }

  return children;
}
