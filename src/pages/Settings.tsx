import React, { useState } from 'react';
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
import { Progress } from '@/components/ui/progress';
import { 
  Badge, 
  Bell, 
  CreditCard, 
  Download, 
  Mail, 
  Shield, 
  UserCircle 
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useProfile } from '@/hooks/useProfile';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { profile } = useProfile();

  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    mobile: false,
    weeklyReport: true,
    newLeads: true,
    responses: true,
  });

  const handleToggleChange = (key: string) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map((n) => n[0]).join('');
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
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Mettre à jour le mot de passe</Button>
              </CardFooter>
            </Card>
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
                <Button variant="default">Mettre à jour le moyen de paiement</Button>
              </CardFooter>
            </Card>
          </TabsContent> */}
          
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
