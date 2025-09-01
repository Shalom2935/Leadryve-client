import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import usePageTitle from "@/hooks/usePageTitle";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuthStore } from '@/store/authStore'; // Import useAuthStore

const API_BASE_URL = import.meta.env.VITE_API_BASE;

const MicrosoftCallback = () => {
  usePageTitle("Microsoft Integration");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [status, setStatus] = React.useState("Processing...");

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      setStatus(`Error: ${error}`);
      toast({
        title: "Microsoft Connection Failed",
        description: `Error: ${error}`,
        variant: "destructive",
      });
      navigate('/settings'); // Redirect to settings or an error page
      return;
    }

    if (code) {
      setStatus("Exchanging authorization code...");
      const exchangeCode = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/email/microsoft/auth/exchange/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ code }),
          });

          if (response.ok) {
            setStatus("Microsoft account connected successfully!");
            toast({
              title: "Microsoft Connected",
              description: "Your Microsoft account has been successfully integrated.",
            });
            // Refresh profile to update has_email_integration status
            const { fetchProfile } = useAuthStore.getState();
            fetchProfile();
            navigate('/settings'); // Redirect to settings page
          } else {
            const errorData = await response.json();
            setStatus(`Error: ${errorData.message || 'Failed to exchange code'}`);
            toast({
              title: "Microsoft Connection Failed",
              description: errorData.message || 'Failed to exchange authorization code.',
              variant: "destructive",
            });
            navigate('/settings'); // Redirect to settings or an error page
          }
        } catch (err) {
          setStatus(`Network Error: ${err.message}`);
          toast({
            title: "Microsoft Connection Failed",
            description: `Network error: ${err.message}`,
            variant: "destructive",
          });
          navigate('/settings'); // Redirect to settings or an error page
        }
      };
      exchangeCode();
    } else {
      setStatus("No authorization code found.");
      toast({
        title: "Microsoft Connection Failed",
        description: "No authorization code received from Microsoft.",
        variant: "destructive",
      });
      navigate('/settings'); // Redirect to settings or an error page
    }
  }, [searchParams, navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Microsoft Integration</CardTitle>
          <CardDescription>
            {status}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status.includes("Processing") || status.includes("Exchanging") ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default MicrosoftCallback;
