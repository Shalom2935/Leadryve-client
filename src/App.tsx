import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Missions from "./pages/Missions";
import MissionDetail from "./pages/MissionDetail";
import CreateMission from "./pages/CreateMission";
import Leads from "./pages/Leads";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProfileSetup from "./pages/ProfileSetup";
import Auth from "./pages/Auth";
import ConfirmEmail from "./pages/ConfirmEmail";
import { RequireAuth } from "@/hooks/useAuth";
import ProfileUpdate from "./pages/ProfileUpdate";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore"; // Import the Zustand store
import usePageTitle from "./hooks/usePageTitle";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const initializeAuth = useAuthStore((state) => state.fetchProfile); // Get fetchProfile from store

  useEffect(() => {
    // This will trigger initial profile fetch if token exists on app load
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Routes>
      <Route path="/auth" element={<AuthWithTitle title="Authentication" />} />
      <Route path="/profile" element={<RequireAuth><ProfileSetupWithTitle title="Profile Setup" /></RequireAuth>} />
      <Route path="/profile-update" element={<RequireAuth><ProfileUpdateWithTitle title="Update Profile" /></RequireAuth>} />
      <Route path="/auth/confirm-email" element={<ConfirmEmailWithTitle title="Confirm Email" />} />
      <Route path="/" element={<RequireAuth><IndexWithTitle title="Dashboard" /></RequireAuth>} />
      <Route path="/missions" element={<RequireAuth><MissionsWithTitle title="Missions" /></RequireAuth>} />
      <Route path="/missions/create" element={<RequireAuth><CreateMissionWithTitle title="Create Mission" /></RequireAuth>} />
      <Route path="/missions/:id" element={<RequireAuth><MissionDetailWithTitle title="Mission Details" /></RequireAuth>} />
      {/* <Route path="/leads" element={<RequireAuth><LeadsWithTitle title="Leads" /></RequireAuth>} /> */}
      <Route path="/settings" element={<RequireAuth><SettingsWithTitle title="Settings" /></RequireAuth>} />
      <Route path="*" element={<RequireAuth><NotFoundWithTitle title="Page Not Found" /></RequireAuth>} />
    </Routes>
  );
};

const AuthWithTitle = ({ title }: { title: string }) => {
  usePageTitle(title);
  return <Auth />;
};

const ProfileSetupWithTitle = ({ title }: { title: string }) => {
  usePageTitle(title);
  return <ProfileSetup />;
};

const ProfileUpdateWithTitle = ({ title }: { title: string }) => {
  usePageTitle(title);
  return <ProfileUpdate />;
};

const ConfirmEmailWithTitle = ({ title }: { title: string }) => {
  usePageTitle(title);
  return <ConfirmEmail />;
};

const IndexWithTitle = ({ title }: { title: string }) => {
  usePageTitle(title);
  return <Index />;
};

const MissionsWithTitle = ({ title }: { title: string }) => {
  usePageTitle(title);
  return <Missions />;
};

const CreateMissionWithTitle = ({ title }: { title: string }) => {
  usePageTitle(title);
  return <CreateMission />;
};

const MissionDetailWithTitle = ({ title }: { title: string }) => {
  usePageTitle(title);
  return <MissionDetail />;
};

const LeadsWithTitle = ({ title }: { title: string }) => {
  usePageTitle(title);
  return <Leads />;
};

const SettingsWithTitle = ({ title }: { title: string }) => {
  usePageTitle(title);
  return <Settings />;
};

const NotFoundWithTitle = ({ title }: { title: string }) => {
  usePageTitle(title);
  return <NotFound />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
