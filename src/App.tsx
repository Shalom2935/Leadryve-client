import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
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
import { RequireAuth, AuthProvider } from "@/hooks/useAuth";
import { ProfileProvider, useProfile } from "@/hooks/useProfile";
import { useEffect } from "react";

function RequireProfile({ children }: { children: JSX.Element }) {
  const { profile, isLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !profile) {
      navigate("/profile");
    }
  }, [profile, isLoading, navigate]);

  if (isLoading || !profile) {
    return null; // Or a loading spinner
  }

  return children;
}

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<Auth />} />
    <Route path="/profile" element={<RequireAuth><ProfileSetup /></RequireAuth>} />
    <Route path="/auth/confirm-email" element={<ConfirmEmail />} />
    <Route path="/" element={<RequireAuth><RequireProfile><Index /></RequireProfile></RequireAuth>} />
    <Route path="/missions" element={<RequireAuth><RequireProfile><Missions /></RequireProfile></RequireAuth>} />
    <Route path="/missions/create" element={<RequireAuth><RequireProfile><CreateMission /></RequireProfile></RequireAuth>} />
    <Route path="/missions/:id" element={<RequireAuth><RequireProfile><MissionDetail /></RequireProfile></RequireAuth>} />
    <Route path="/leads" element={<RequireAuth><RequireProfile><Leads /></RequireProfile></RequireAuth>} />
    <Route path="/settings" element={<RequireAuth><RequireProfile><Settings /></RequireProfile></RequireAuth>} />
    <Route path="*" element={<RequireAuth><RequireProfile><NotFound /></RequireProfile></RequireAuth>} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ProfileProvider>
            <AppRoutes />
          </ProfileProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
