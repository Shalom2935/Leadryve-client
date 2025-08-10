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
import { RequireAuth, AuthProvider } from "@/hooks/useAuth";
import { ProfileProvider } from "@/hooks/useProfile";

import ProfileUpdate from "./pages/ProfileUpdate";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<Auth />} />
    <Route path="/profile" element={<RequireAuth><ProfileSetup /></RequireAuth>} />
    <Route path="/profile-update" element={<RequireAuth><ProfileUpdate /></RequireAuth>} />
    <Route path="/auth/confirm-email" element={<ConfirmEmail />} />
    <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
    <Route path="/missions" element={<RequireAuth><Missions /></RequireAuth>} />
    <Route path="/missions/create" element={<RequireAuth><CreateMission /></RequireAuth>} />
    <Route path="/missions/:id" element={<RequireAuth><MissionDetail /></RequireAuth>} />
    {/* <Route path="/leads" element={<RequireAuth><Leads /></RequireAuth>} /> */}
    <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
    <Route path="*" element={<RequireAuth><NotFound /></RequireAuth>} />
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