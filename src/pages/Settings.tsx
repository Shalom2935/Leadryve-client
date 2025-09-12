import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from '@/components/ui/progress';
import { 
  Badge, 
  Bell, 
  CreditCard, 
  ChevronDown,
  Download, 
  Mail, 
  Plus, 
  Shield, 
  UserCircle,
  X,
  Loader2 // Import Loader2
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useProfile } from '@/hooks/useProfile';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore'; // Import useAuthStore

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const Settings = () => {
  const { profile, refetch: refetchProfile } = useProfile(); // Get refetch from useProfile
  const [isDisconnecting, setIsDisconnecting] = useState(false); // New state for disconnect button loading
  const { logout } = useAuthStore(); // Get logout from auth store

  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    mobile: false,
    weeklyReport: true,
    newLeads: true,
    responses: true,
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpSenderEmail, setSmtpSenderEmail] = useState('');

  useEffect(() => {
    const fetchSmtpConfig = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE}/email/smtp/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setSmtpHost(data.host);
          setSmtpPort(data.port);
          setSmtpUser(data.username);
          setSmtpSenderEmail(data.sender_email);
        }
      } catch (error) {
        console.error('Failed to fetch SMTP config', error);
      }
    };

    fetchSmtpConfig();
  }, []);

  const handleToggleChange = (key: string) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map((n) => n[0]).join('');
  };

  const handeUpdatePassword = async (old_password: string, new_password: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("No authentication token found. Please log in again.");
        return;
      }

      const res = await fetch(`${API_BASE}/auth/password-update/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password,
          new_password,
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = errorData.message || 'Failed to update password.';
        toast.error(`Error: ${errorMessage}`);
        throw new Error(errorMessage);
      }

      toast.success("Password updated successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

    } catch (error: any) {
      console.error("An unexpected error occurred:", error.message);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handlePasswordUpdateSubmit = async () => {
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }
    await handeUpdatePassword(currentPassword, newPassword);
  };

  const handleDisconnectGmail = async () => {
    setIsDisconnecting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("No authentication token found. Please log in again.");
        logout(); // Log out if token is missing
        return;
      }

      const res = await fetch(`${API_BASE}/email/gmail/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = errorData.message || 'Échec de la déconnexion de Gmail.';
        toast.error(`Erreur: ${errorMessage}`);
        throw new Error(errorMessage);
      }

      toast.success("Compte Gmail déconnecté avec succès !");
      refetchProfile(); // Refresh profile to update email_provider status

    } catch (error: any) {
      console.error("Une erreur inattendue est survenue lors de la déconnexion:", error.message);
      toast.error("Une erreur inattendue est survenue. Veuillez réessayer.");
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleDisconnectMicrosoft = async () => {
    setIsDisconnecting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("No authentication token found. Please log in again.");
        logout();
        return;
      }

      const res = await fetch(`${API_BASE}/email/microsoft/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = errorData.message || 'Échec de la déconnexion de Microsoft.';
        toast.error(`Erreur: ${errorMessage}`);
        throw new Error(errorMessage);
      }

      toast.success("Compte Microsoft déconnecté avec succès !");
      refetchProfile(); // Refresh profile to update email_provider status

    } catch (error: any) {
      console.error("Une erreur inattendue est survenue lors de la déconnexion:", error.message);
      toast.error("Une erreur inattendue est survenue. Veuillez réessayer.");
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleSaveSmtp = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("No authentication token found. Please log in again.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/email/smtp/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host: smtpHost,
          port: smtpPort,
          username: smtpUser,
          password: smtpPassword,
          sender_email: smtpSenderEmail,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to save SMTP settings');
      }

      toast.success('SMTP settings saved successfully!');
      refetchProfile();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleTestSmtp = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("No authentication token found. Please log in again.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/email/smtp/test`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to test SMTP connection');
      }

      toast.success('SMTP connection successful!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDisconnectSmtp = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("No authentication token found. Please log in again.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/email/smtp/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to disconnect SMTP');
      }

      toast.success('SMTP disconnected successfully!');
      setSmtpHost('');
      setSmtpPort(587);
      setSmtpUser('');
      setSmtpPassword('');
      setSmtpSenderEmail('');
      refetchProfile();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez les préférences et les paramètres de votre compte
          </p>
        </div>

        <Tabs defaultValue="account">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="account">
              <UserCircle className="h-4 w-4 mr-2" />
              Compte
            </TabsTrigger>
            <TabsTrigger value="plan" disabled>
              <CreditCard className="h-4 w-4 mr-2" />
              Forfait & Utilisation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations du profil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="" alt={profile?.name} />
                    <AvatarFallback className="bg-leadryve-purple text-white text-lg">
                      {profile ? getInitials(profile.name) : ''}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={profile?.name || ''}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile?.company_email || ''}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Entreprise</Label>
                    <Input
                      id="company"
                      name="company"
                      value={profile?.company_name || ''}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profile?.phone_number || ''}
                      readOnly
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-blue-600">
                  Pour modifier vos informations de profil, veuillez vous rendre sur la{' '}
                  <Link to="/profile-update" className="font-semibold hover:underline">
                    page de profil
                  </Link>
                  .
                </p>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>
                  Gérez votre mot de passe et vos paramètres de sécurité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mot de passe actuel</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={handlePasswordUpdateSubmit}>Mettre à jour le mot de passe</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intégrations</CardTitle>
                <CardDescription>
                  Connectez des services tiers à votre compte Leadryve
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                <Card className="flex flex-col bg-slate-50 border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <CardHeader className="flex-1">
                    <div className="flex items-center gap-4">
                      <img src="/google.png" alt="Google logo" className="h-8 w-8" />
                      <div>
                        <p className="font-medium">Intégration Gmail</p>
                        <p className="text-sm text-muted-foreground">
                          Connectez votre compte Gmail pour envoyer des e-mails.
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardFooter>
                    {profile?.email_provider === 'gmail' ? (
                      <Button
                        variant="destructive"
                        onClick={handleDisconnectGmail}
                        disabled={isDisconnecting}
                        className="w-full transition-all duration-300"
                      >
                        {isDisconnecting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Déconnexion...
                          </>
                        ) : (
                          <>
                            <X className="mr-2 h-4 w-4" />
                            Déconnecter Gmail
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => window.location.href = `${API_BASE}/email/gmail/auth/login`}
                        disabled={profile?.email_provider === 'microsoft' || profile?.email_provider === 'smtp'}
                        className="w-full"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Connecter avec Gmail
                      </Button>
                    )}
                  </CardFooter>
                </Card>
                <Card className="flex flex-col bg-slate-50 border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <CardHeader className="flex-1">
                    <div className="flex items-center gap-4">
                      <img src="/microsoft.png" alt="Microsoft logo" className="h-8 w-8" />
                      <div>
                        <p className="font-medium">Intégration Microsoft</p>
                        <p className="text-sm text-muted-foreground">
                          Connectez votre compte Microsoft pour envoyer des e-mails.
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardFooter>
                    {profile?.email_provider === 'microsoft' ? (
                      <Button
                        variant="destructive"
                        onClick={handleDisconnectMicrosoft}
                        disabled={isDisconnecting}
                        className="w-full transition-all duration-300"
                      >
                        {isDisconnecting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Déconnexion...
                          </>
                        ) : (
                          <>
                            <X className="mr-2 h-4 w-4" />
                            Déconnecter Microsoft
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => window.location.href = `${API_BASE}/email/microsoft/auth/login`}
                        disabled={profile?.email_provider === 'gmail' || profile?.email_provider === 'smtp'}
                        className="w-full"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Connecter avec Microsoft
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </CardContent>
            </Card>

            <Collapsible asChild>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Mail className="h-8 w-8" />
                      <div>
                        <p className="font-medium">Intégration SMTP</p>
                        <p className="text-sm text-muted-foreground">
                          Connectez votre propre serveur SMTP pour envoyer des e-mails.
                        </p>
                      </div>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <ChevronDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-host">Hôte</Label>
                      <Input id="smtp-host" placeholder="smtp.example.com" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="smtp-port">Port</Label>
                        <Input id="smtp-port" placeholder="587" value={smtpPort} onChange={(e) => setSmtpPort(parseInt(e.target.value))}/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-user">Utilisateur</Label>
                        <Input id="smtp-user" placeholder="user@example.com" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-password">Mot de passe</Label>
                      <Input id="smtp-password" type="password" placeholder="••••••••" value={smtpPassword} onChange={(e) => setSmtpPassword(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="smtp-sender-email">Sender Email</Label>
                      <Input id="smtp-sender-email" placeholder="sender@example.com" value={smtpSenderEmail} onChange={(e) => setSmtpSenderEmail(e.target.value)} />
                    </div>
                  </CardContent>
                  <CardFooter className="gap-2">
                    {profile?.email_provider === 'smtp' ? (
                      <Button variant="destructive" onClick={handleDisconnectSmtp}>Déconnecter SMTP</Button>
                    ) : (
                      <>
                        <Button variant="outline" onClick={handleTestSmtp}>Tester la connexion</Button>
                        <Button onClick={handleSaveSmtp}>Enregistrer</Button>
                      </>
                    )}
                  </CardFooter>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </TabsContent>
          
          {/* <TabsContent value="plan" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Forfait Actuel</CardTitle>
                    <CardDescription>
                      Votre forfait et votre utilisation
                    </CardDescription>
                  </div>
                  <Badge className="bg-deepinsight-purple font-medium">Forfait Pro</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Leads (435/650)</span>
                      <span className="text-xs text-slate-500">67% utilisé</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">E-mails (245/500)</span>
                      <span className="text-xs text-slate-500">49% utilisé</span>
                    </div>
                    <Progress value={49} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Missions Actives (3/5)</span>
                      <span className="text-xs text-slate-500">60% utilisé</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Fonctionnalités du Forfait Pro</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      Jusqu'à 5 missions actives
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      650 leads par mois
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      500 crédits d'envoi d'e-mails
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      Intégration LinkedIn
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      Filtres de leads avancés
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-slate-500">
                  Votre forfait se renouvelle le 1er mai 2025
                </div>
                <Button>Mettre à niveau le forfait</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Informations de Facturation</CardTitle>
                <CardDescription>
                  Gérez vos méthodes de paiement et vos détails de facturation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-slate-500" />
                      <div>
                        <p className="font-medium">Visa se terminant par 4242</p>
                        <p className="text-xs text-slate-500">Expire le 12/2025</p>
                      </div>
                    </div>
                    <Badge>Défaut</Badge>
                  </div>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="billing-name">Nom sur la carte</Label>
                    <Input
                      id="billing-name"
                      defaultValue="John Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billing-email">E-mail de facturation</Label>
                    <Input
                      id="billing-email"
                      type="email"
                      defaultValue="billing@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nom de l'entreprise</Label>
                    <Input
                      id="company-name"
                      defaultValue="Example Corp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Input
                      id="country"
                      defaultValue="United States"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Voir l'historique de facturation</Button>
                <Button variant="default">Mettre à niveau le moyen de paiement</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-semibold mb-2">Notification Channels</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-500" />
                      <Label htmlFor="email-notifications" className="cursor-pointer">
                        Email Notifications
                      </Label>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={() => handleToggleChange('email')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-slate-500" />
                      <Label htmlFor="browser-notifications" className="cursor-pointer">
                        Browser Notifications
                      </Label>
                    </div>
                    <Switch
                      id="browser-notifications"
                      checked={notifications.browser}
                      onCheckedChange={() => handleToggleChange('browser')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="h-4 w-4 text-slate-500" />
                      <Label htmlFor="mobile-notifications" className="cursor-pointer">
                        Mobile App Notifications
                      </Label>
                    </div>
                    <Switch
                      id="mobile-notifications"
                      checked={notifications.mobile}
                      onCheckedChange={() => handleToggleChange('mobile')}
                    />
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-2">Notification Types</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="weekly-report" className="cursor-pointer">
                        Weekly performance reports
                      </Label>
                      <Switch
                        id="weekly-report"
                        checked={notifications.weeklyReport}
                        onCheckedChange={() => handleToggleChange('weeklyReport')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="new-leads" className="cursor-pointer">
                        New leads found
                      </Label>
                      <Switch
                        id="new-leads"
                        checked={notifications.newLeads}
                        onCheckedChange={() => handleToggleChange('newLeads')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="responses" className="cursor-pointer">
                        Prospect responses
                      </Label>
                      <Switch
                        id="responses"
                        checked={notifications.responses}
                        onCheckedChange={() => handleToggleChange('responses')}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => toast.success('Notification preferences saved!')}>
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Communication Preferences</CardTitle>
                <CardDescription>
                  Manage your contact preferences and message templates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-signature">Default Email Signature</Label>
                  <Input
                    id="email-signature"
                    defaultValue="John Smith, Business Development Manager"
                  />
                  <p className="text-xs text-slate-500">
                    This signature will be added to all your outreach emails.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Contact Scheduling</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-time" className="text-xs">Work Hours Start</Label>
                      <Input
                        id="start-time"
                        type="time"
                        defaultValue="09:00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-time" className="text-xs">Work Hours End</Label>
                      <Input
                        id="end-time"
                        type="time"
                        defaultValue="17:00"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    Messages will only be sent during these hours.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => toast.success('Communication preferences saved!')}>
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
