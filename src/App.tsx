import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Pricing from "./pages/Pricing";
import Missions from "./pages/Missions";
import MissionDetail from "./pages/MissionDetail";
import CreateMission from "./pages/CreateMission";
import Leads from "./pages/Leads";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProfileSetup from "./pages/ProfileSetup";
import Auth from "./pages/Auth";
import ConfirmEmail from "./pages/ConfirmEmail";
import ResetPassword from "./pages/ResetPassword";
import CheckEmail from "./pages/CheckEmail";
import PasswordResetSuccess from "./pages/PasswordResetSuccess";
import GmailCallback from "./pages/GmailCallback";
import MicrosoftCallback from "./pages/MicrosoftCallback"; // Import MicrosoftCallback
import TermsOfService from "./pages/TermsOfService"; // Import TermsOfService
import { RequireAuth } from "@/hooks/useAuth";
import ProfileUpdate from "./pages/ProfileUpdate";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore"; // Import the Zustand store
import usePageTitle from "./hooks/usePageTitle";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const initializeAuth = useAuthStore((state) => state.fetchProfile); // Get fetchProfile from store
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // This will trigger initial profile fetch if token exists on app load
    initializeAuth();
  }, [initializeAuth]);

  const isAppSubdomain = window.location.hostname.startsWith("app.") || (
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
    window.location.search.includes('mode=app')
  );

  useEffect(() => {
    if (isAppSubdomain && location.pathname === "/") {
      if (isAuthenticated) {
        navigate("/", { replace: true });
      } else {
        navigate("/auth", { replace: true });
      }
    }
  }, [isAppSubdomain, location.pathname, isAuthenticated, navigate]);


  if (isAppSubdomain) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthWithTitle title="Authentication" />} />
        <Route path="/auth/reset-password" element={<ResetPasswordWithTitle title="Reset Password" />} />
        <Route path="/auth/check-email" element={<CheckEmailWithTitle title="Check Email" />} />
        <Route path="/auth/password-reset-success" element={<PasswordResetSuccessWithTitle title="Password Reset Success" />} />
        <Route path="/profile" element={<RequireAuth><ProfileSetupWithTitle title="Profile Setup" /></RequireAuth>} />
        <Route path="/profile-update" element={<RequireAuth><ProfileUpdateWithTitle title="Update Profile" /></RequireAuth>} />
        <Route path="/auth/confirm-email" element={<ConfirmEmailWithTitle title="Confirm Email" />} />
        <Route path="/gmail/callback" element={<GmailCallbackWithTitle title="Gmail Callback" />} />
        <Route path="/microsoft/callback" element={<MicrosoftCallbackWithTitle title="Microsoft Callback" />} />
        <Route path="/" element={<RequireAuth><IndexWithTitle title="Dashboard" /></RequireAuth>} />
        <Route path="/missions" element={<RequireAuth><MissionsWithTitle title="Missions" /></RequireAuth>} />
        <Route path="/missions/create" element={<RequireAuth><CreateMissionWithTitle title="Create Mission" /></RequireAuth>} />
        <Route path="/missions/:id" element={<RequireAuth><MissionDetailWithTitle title="Mission Details" /></RequireAuth>} />
        {/* <Route path="/leads" element={<RequireAuth><LeadsWithTitle title="Leads" /></RequireAuth>} /> */}
        <Route path="/settings" element={<RequireAuth><SettingsWithTitle title="Settings" /></RequireAuth>} />
        <Route path="*" element={<RequireAuth><NotFoundWithTitle title="Page Not Found" /></RequireAuth>} />
      </Routes>
    );
  } else {
    return (
      <Routes>
        <Route path="/" element={<LandingPageWithTitle title="Leadryve - Génération de Leads B2B" />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyWithTitle title="Privacy Policy" />} />
        <Route path="/terms-of-service" element={<TermsOfServiceWithTitle title="Terms of Service" />} />
        <Route path="/pricing" element={<PricingWithTitle title="Pricing" />} />
        <Route path="*" element={<NotFoundWithTitle title="Page Not Found" />} />
      </Routes>
    );
  }
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

const ResetPasswordWithTitle = ({ title }: { title: string }) => {
  usePageTitle(title);
  return <ResetPassword />;
};

const CheckEmailWithTitle = ({ title }: { title: string }) => {
  usePageTitle(title);
  return <CheckEmail />;
};

const PasswordResetSuccessWithTitle = ({ title }: { title: string }) => {
  usePageTitle(title);
  return <PasswordResetSuccess />;
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

const GmailCallbackWithTitle = ({ title }: { title: string }) => {
  usePageTitle(title);
  return <GmailCallback />;
};

const LandingPageWithTitle = ({ title }: { title: string }) => {
  usePageTitle(title);
  return <LandingPage />;
};

const PrivacyPolicyWithTitle = ({ title }: { title: string }) => {
  usePageTitle(title);
  return <PrivacyPolicy />;
};

const PricingWithTitle = ({ title }: { title: string }) => {
  usePageTitle(title);
  return <Pricing />;
};

const TermsOfServiceWithTitle = ({ title }: { title: string }) => {
  usePageTitle(title);
  return <TermsOfService />;
};

const MicrosoftCallbackWithTitle = ({ title }: { title: string }) => {
  usePageTitle(title);
  return <MicrosoftCallback />;
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
