import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Profile {
  name: string;
  company_name: string;
  role: string;
  services: string[];
  sector: string;
  geo_coverage: string[];
  employees: string;
  opening_hours: {
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
  website?: string;
  social_links: {  
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    x?: string;
  };
  pitch?: string;
  email_provider?: 'gmail' | 'microsoft' | 'smtp' |null; // Updated field
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  profile: Profile | null;
  isLoadingProfile: boolean;
  login: (token: string) => void;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  setProfile: (profile: Profile | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      isAuthenticated: false,
      isLoadingAuth: true,
      profile: null,
      isLoadingProfile: true,

          login: (newToken: string) => {
            console.log("AuthStore - login called, setting token and isAuthenticated to true.");
            set({ token: newToken, isAuthenticated: true });
            localStorage.setItem('token', newToken);
            get().fetchProfile(); // Fetch profile immediately after login
          },

      logout: () => {
        set({ token: null, isAuthenticated: false, profile: null });
        localStorage.removeItem('token');
        localStorage.removeItem('userProfile');
      },

      setProfile: (profile: Profile | null) => {
        set({ profile });
        if (profile) {
          localStorage.setItem('userProfile', JSON.stringify(profile));
        } else {
          localStorage.removeItem('userProfile');
        }
      },

          fetchProfile: async () => {
            const { token, logout, setProfile } = get();
            if (!token) {
              console.log("AuthStore - fetchProfile: No token, setting isLoadingProfile to false.");
              set({ isLoadingProfile: false });
              return;
            }

            console.log("AuthStore - fetchProfile: Token exists, setting isLoadingProfile to true and fetching profile.");
            set({ isLoadingProfile: true });
            try {
              const response = await fetch(`${import.meta.env.VITE_API_BASE || '/api'}/profile/`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
              });

              if (response.status === 401) {
                console.log("AuthStore - fetchProfile: 401 Unauthorized, logging out.");
                logout();
                return;
              }

              if (!response.ok) {
                const errorBody = await response.text();
                console.error(`AuthStore - Failed to fetch profile: Status ${response.status}, Body: ${errorBody}`);
                throw new Error(`Failed to fetch profile: Status ${response.status}`);
              }

              const profileData = await response.json();
              setProfile(profileData);
              console.log("AuthStore - Fetched profile from store:", profileData);
            } catch (error) {
              console.error("AuthStore - Error fetching profile from store:", error);
              setProfile(null);
            } finally {
              console.log("AuthStore - fetchProfile: Setting isLoadingProfile to false in finally block.");
              set({ isLoadingProfile: false });
            }
          },
    }),
    {
      name: 'auth-storage', // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ token: state.token, isAuthenticated: state.isAuthenticated, profile: state.profile }),
      onRehydrateStorage: (state) => {
        if (state) {
          state.isLoadingAuth = false;
          state.isLoadingProfile = false;
          if (state.token && !state.profile) {
            state.fetchProfile();
          }
        }
      },
    }
  )
);
