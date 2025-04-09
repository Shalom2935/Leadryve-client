
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

const Settings = () => {
  const [formData, setFormData] = useState({
    fullName: 'John Smith',
    email: 'john@example.com',
    company: 'Example Corp',
    phone: '+1 (555) 123-4567',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    mobile: false,
    weeklyReport: true,
    newLeads: true,
    responses: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (key: string) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = () => {
    toast.success('Profile information saved successfully!');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and settings
          </p>
        </div>

        <Tabs defaultValue="account">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="account">
              <UserCircle className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="plan">
              <CreditCard className="h-4 w-4 mr-2" />
              Plan & Usage
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Bell className="h-4 w-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>
          
          {/* Account Information Tab */}
          <TabsContent value="account" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal details and company information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="" alt="John Smith" />
                    <AvatarFallback className="bg-deepinsight-purple text-white text-lg">JS</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Change Photo
                    </Button>
                  </div>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Manage your password and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Update Password</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
                <CardDescription>
                  Download all your missions and lead data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-slate-500">
                  Your export will include all your missions, leads, and campaign performance data.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Plan & Usage Tab */}
          <TabsContent value="plan" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>
                      Your subscription plan and usage
                    </CardDescription>
                  </div>
                  <Badge className="bg-deepinsight-purple font-medium">Pro Plan</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Leads (435/650)</span>
                      <span className="text-xs text-slate-500">67% used</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Emails (245/500)</span>
                      <span className="text-xs text-slate-500">49% used</span>
                    </div>
                    <Progress value={49} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Active Missions (3/5)</span>
                      <span className="text-xs text-slate-500">60% used</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Pro Plan Features</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      Up to 5 active missions
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      650 leads per month
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      500 email outreach credits
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      LinkedIn integration
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      Advanced lead filters
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-slate-500">
                  Your plan renews on May 1, 2025
                </div>
                <Button>Upgrade Plan</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>
                  Manage your payment methods and billing details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-slate-500" />
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-xs text-slate-500">Expires 12/2025</p>
                      </div>
                    </div>
                    <Badge>Default</Badge>
                  </div>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="billing-name">Name on Card</Label>
                    <Input
                      id="billing-name"
                      defaultValue="John Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billing-email">Billing Email</Label>
                    <Input
                      id="billing-email"
                      type="email"
                      defaultValue="billing@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      defaultValue="Example Corp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      defaultValue="United States"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">View Billing History</Button>
                <Button variant="default">Update Payment Method</Button>
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
