
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Download, 
  Filter, 
  Target, 
  MapPin, 
  Users, 
  Clock, 
  Mail, 
  Phone, 
  Linkedin, 
  MoreHorizontal 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

const MissionDetail = () => {
  const { id } = useParams();
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [sendNow, setSendNow] = useState(true);
  const [message, setMessage] = useState('');

  const mission = {
    id: 1,
    name: 'Tech SaaS in California',
    status: 'active',
    progress: 65,
    target: {
      industry: 'Technology',
      location: 'California, USA',
      clientType: 'B2B',
      leadTarget: 150,
    },
    stats: {
      leadsFound: 87,
      contacted: 42,
      responded: 18,
      qualified: 12,
    },
    startDate: 'Apr 2, 2025',
    lastUpdated: '2 hours ago',
  };

  const leads = [
    {
      id: 1,
      companyName: 'TechFlow Solutions',
      industry: 'Software',
      location: 'San Francisco, CA',
      score: 95,
      contactMethods: ['email', 'linkedin', 'phone'],
      status: 'pending',
    },
    {
      id: 2,
      companyName: 'DataSphere Inc.',
      industry: 'Data Analytics',
      location: 'San Jose, CA',
      score: 87,
      contactMethods: ['email', 'linkedin'],
      status: 'contacted',
    },
    {
      id: 3,
      companyName: 'CloudNest',
      industry: 'Cloud Computing',
      location: 'Los Angeles, CA',
      score: 76,
      contactMethods: ['email'],
      status: 'responded',
    },
    {
      id: 4,
      companyName: 'SecureNet Solutions',
      industry: 'Cybersecurity',
      location: 'Palo Alto, CA',
      score: 92,
      contactMethods: ['email', 'phone'],
      status: 'qualified',
    },
    {
      id: 5,
      companyName: 'InnovateTech',
      industry: 'Software',
      location: 'Oakland, CA',
      score: 65,
      contactMethods: ['linkedin'],
      status: 'pending',
    },
  ];

  const getScoreClass = (score: number) => {
    if (score >= 80) return 'lead-score-high';
    if (score >= 60) return 'lead-score-medium';
    return 'lead-score-low';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-slate-200">Pending</Badge>;
      case 'contacted':
        return <Badge className="bg-blue-100 text-blue-800">Contacted</Badge>;
      case 'responded':
        return <Badge className="bg-purple-100 text-purple-800">Responded</Badge>;
      case 'qualified':
        return <Badge className="bg-green-100 text-green-800">Qualified</Badge>;
      default:
        return null;
    }
  };

  const openContactModal = (lead: any) => {
    setSelectedLead(lead);
    setMessage(`Hi, I came across ${lead.companyName} and I'm impressed with your work in the ${lead.industry} industry. I'd like to discuss how our solution might be valuable for your business.`);
    setContactModalOpen(true);
  };

  const handleSendMessage = () => {
    toast.success(`Message ${sendNow ? 'sent' : 'scheduled'} to ${selectedLead.companyName}!`);
    setContactModalOpen(false);
    
    // Update the lead status
    // In a real app, this would update the state or call an API
    toast(`Lead status updated to "Contacted"`, {
      description: selectedLead.companyName,
    });
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{mission.name}</h1>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <p className="text-muted-foreground">Mission ID: {id}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
            <Button>
              Edit Mission
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Mission Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2">
                  <Target size={18} className="text-deepinsight-purple mt-0.5" />
                  <div>
                    <p className="font-medium">Target Industry</p>
                    <p className="text-sm">{mission.target.industry}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={18} className="text-deepinsight-purple mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm">{mission.target.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users size={18} className="text-deepinsight-purple mt-0.5" />
                  <div>
                    <p className="font-medium">Client Type</p>
                    <p className="text-sm">{mission.target.clientType}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock size={18} className="text-deepinsight-purple mt-0.5" />
                  <div>
                    <p className="font-medium">Timeline</p>
                    <p className="text-sm">Started on {mission.startDate}</p>
                    <p className="text-xs text-slate-500">Last updated {mission.lastUpdated}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Leads Found</span>
                  <span className="text-deepinsight-purple font-medium">
                    {mission.stats.leadsFound}/{mission.target.leadTarget}
                  </span>
                </div>
                <Progress value={(mission.stats.leadsFound / mission.target.leadTarget) * 100} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-500">Contacted</p>
                  <p className="text-xl font-semibold">{mission.stats.contacted}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-500">Responded</p>
                  <p className="text-xl font-semibold">{mission.stats.responded}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-500">Qualified</p>
                  <p className="text-xl font-semibold">{mission.stats.qualified}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-500">Response Rate</p>
                  <p className="text-xl font-semibold">
                    {Math.round((mission.stats.responded / mission.stats.contacted) * 100) || 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Leads</h2>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="search"
                  placeholder="Search leads..."
                  className="pl-8"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-1" /> Filter
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Contact Methods</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.companyName}</TableCell>
                      <TableCell>{lead.location}</TableCell>
                      <TableCell>
                        <Badge className={getScoreClass(lead.score)}>
                          {lead.score}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {lead.contactMethods.includes('email') && (
                            <Mail size={16} className="text-slate-600" />
                          )}
                          {lead.contactMethods.includes('phone') && (
                            <Phone size={16} className="text-slate-600" />
                          )}
                          {lead.contactMethods.includes('linkedin') && (
                            <Linkedin size={16} className="text-slate-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(lead.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openContactModal(lead)}
                            disabled={lead.status === 'contacted' || lead.status === 'qualified'}
                          >
                            Contact
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Mark as Qualified</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Remove Lead</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Contact Lead Dialog */}
        <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Contact {selectedLead?.companyName}</DialogTitle>
              <DialogDescription>
                Customize your message before sending.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message here..."
                className="min-h-32"
              />
              <div className="flex items-center space-x-2">
                <Switch
                  id="send-now"
                  checked={sendNow}
                  onCheckedChange={setSendNow}
                />
                <Label htmlFor="send-now">Send message now</Label>
              </div>
            </div>
            <DialogFooter className="flex space-x-2 sm:space-x-0">
              <Button type="button" variant="outline" onClick={() => setContactModalOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSendMessage}>
                {sendNow ? 'Send Message' : 'Schedule Message'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default MissionDetail;
