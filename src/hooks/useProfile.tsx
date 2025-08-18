
import { useAuthStore } from '../store/authStore'; // Import the Zustand store

export const useProfile = () => {
  const { profile, isLoadingProfile, fetchProfile, setProfile } = useAuthStore();
  return { profile, isLoading: isLoadingProfile, refetch: fetchProfile, setProfile };
};
