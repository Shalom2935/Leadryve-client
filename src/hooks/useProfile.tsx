
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface Profile {
  name: string;
  company_name: string;
  role: string;
  services: string[];
  sector: string;
  geo_coverage: string[];
  employees: string;
  openingHours: {
    monday: { start: string; end: string };
    tuesday: { start: string; end: string };
    wednesday: { start: string; end: string };
    thursday: { start: string; end: string };
    friday: { start: string; end: string };
    saturday: { start: string; end: string };
    sunday: { start: string; end: string };
  };
  address: string;
  company_email: string;
  phone_number: string;
  website: string;
  social_links: {  
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    x?: string;
  };
  pitch?: string;
}

interface ProfileContextType {
  profile: Profile | null;
  isLoading: boolean;
  refetch: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, logout, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(() => {
    const storedProfile = localStorage.getItem('userProfile');
    return storedProfile ? JSON.parse(storedProfile) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE || '/api'}/profile/`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const profileData = await response.json();
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      setProfile(profileData);
    } catch (error) {
      console.error(error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true); // Add this line to ensure loading state is true immediately
      fetchProfile();
    } else {
      setProfile(null);
      localStorage.removeItem('userProfile');
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchProfile]);

  return (
    <ProfileContext.Provider value={{ profile, isLoading, refetch: fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
