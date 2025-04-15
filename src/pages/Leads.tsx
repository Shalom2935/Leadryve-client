
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Linkedin, 
  MessageSquare, 
  Download, 
  MoreHorizontal,
  LayoutGrid,
  List
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import LeadCard from '@/components/leads/LeadCard';

const Leads = () => {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [sendNow, setSendNow] = useState(true);
  const [message, setMessage] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  
  const isMobile = useIsMobile();
  
  // If mobile, default to card view
  React.useEffect(() => {
    if (isMobile) {
      setViewMode('card');
    } else {
      setViewMode('table');
    }
  }, [isMobile]);
  
  const leads = [
    {
      id: 1,
      companyName: 'TechFlow Solutions',
      contactName: 'Sarah Johnson',
      title: 'CTO',
      industry: 'Software',
      location: 'San Francisco, CA',
      score: 95,
      contactMethods: ['email', 'linkedin', 'phone'],
      status: 'pending',
      mission: 'Tech SaaS in California'
    },
    {
      id: 2,
      companyName: 'DataSphere Inc.',
      contactName: 'Michael Chen',
      title: 'CEO',
      industry: 'Data Analytics',
      location: 'San Jose, CA',
      score: 87,
      contactMethods: ['email', 'linkedin'],
      status: 'contacted',
      mission: 'Tech SaaS in California'
    },
    {
      id: 3,
      companyName: 'CloudNest',
      contactName: 'Jessica Lee',
      title: 'VP of Sales',
      industry: 'Cloud Computing',
      location: 'Los Angeles, CA',
      score: 76,
      contactMethods: ['email'],
      status: 'responded',
      mission: 'Tech SaaS in California'
    },
    {
      id: 4,
      companyName: 'SecureNet Solutions',
      contactName: 'David Wilson',
      title: 'CISO',
      industry: 'Cybersecurity',
      location: 'Palo Alto, CA',
      score: 92,
      contactMethods: ['email', 'phone'],
      status: 'qualified',
      mission: 'Tech SaaS in California'
    },
    {
      id: 5,
      companyName: 'InnovateTech',
      contactName: 'Alex Rivera',
      title: 'COO',
      industry: 'Software',
      location: 'Oakland, CA',
      score: 65,
      contactMethods: ['linkedin'],
      status: 'pending',
      mission: 'Tech SaaS in California'
    },
    {
      id: 6,
      companyName: 'MediHealth Systems',
      contactName: 'Emily Brown',
      title: 'Director',
      industry: 'Healthcare',
      location: 'New York, NY',
      score: 89,
      contactMethods: ['email', 'phone'],
      status: 'pending',
      mission: 'Healthcare Providers NYC'
    },
    {
      id: 7,
      companyName: 'Finova Partners',
      contactName: 'Robert Taylor',
      title: 'Managing Partner',
      industry: 'Finance',
      location: 'London, UK',
      score: 91,
      contactMethods: ['email', 'linkedin', 'phone'],
      status: 'contacted',
      mission: 'UK Startups'
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
    setMessage(`Hi ${lead.contactName}, I came across ${lead.companyName} and I'm impressed with your work in the ${lead.industry} industry. I'd like to discuss how our solution might be valuable for your business.`);
    setContactModalOpen(true);
  };

  const handleSendMessage = () => {
    toast.success(`Message ${sendNow ? 'sent' : 'scheduled'} to ${selectedLead.contactName}!`);
    setContactModalOpen(false);
    
    toast(`Lead status updated to "Contacted"`, {
      description: selectedLead.companyName,
    });
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'table' ? 'card' : 'table');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">All Leads</h1>
            <p className="text-muted-foreground">
              Manage and contact your potential clients
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
            <Button size="sm" className="whitespace-nowrap">
              <MessageSquare className="h-4 w-4 mr-1" /> Bulk Contact
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Lead Management</CardTitle>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    type="search"
                    placeholder="Search leads..."
                    className="pl-8"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" /> Filter
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleViewMode}
                  className="hidden sm:flex" // Only show on desktop
                >
                  {viewMode === 'table' ? (
                    <><LayoutGrid className="h-4 w-4 mr-1" /> Cards</>
                  ) : (
                    <><List className="h-4 w-4 mr-1" /> Table</>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-b border-slate-200 px-4 py-3 bg-slate-50 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Mission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Missions</SelectItem>
                    <SelectItem value="tech">Tech SaaS in California</SelectItem>
                    <SelectItem value="healthcare">Healthcare Providers NYC</SelectItem>
                    <SelectItem value="uk">UK Startups</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="responded">Responded</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-sm text-slate-500">Showing {leads.length} leads</div>
            </div>
            
            {/* Card view for small screens */}
            {viewMode === 'card' && (
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {leads.map((lead) => (
                    <LeadCard 
                      key={lead.id}
                      lead={lead}
                      openContactModal={openContactModal}
                      getScoreClass={getScoreClass}
                      getStatusBadge={getStatusBadge}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Table view for larger screens */}
            {viewMode === 'table' && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[220px]">Company / Contact</TableHead>
                      <TableHead className="min-w-[180px]">Mission</TableHead>
                      <TableHead className="min-w-[80px]">Score</TableHead>
                      <TableHead className="min-w-[100px]">Contact Methods</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="text-right min-w-[140px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-medium">{lead.companyName}</p>
                            <div className="text-sm text-slate-500">
                              {lead.contactName}, {lead.title}
                            </div>
                            <div className="text-xs text-slate-400">
                              {lead.location}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{lead.mission}</TableCell>
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
                              className="whitespace-nowrap"
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
                                <DropdownMenuItem>Add Notes</DropdownMenuItem>
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
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Lead Dialog */}
        <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Contact {selectedLead?.contactName}</DialogTitle>
              <DialogDescription>
                Customize your message before sending.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-slate-50 p-3 rounded-lg text-sm mb-2">
                <p className="font-medium">{selectedLead?.companyName}</p>
                <p>{selectedLead?.contactName}, {selectedLead?.title}</p>
                <p className="text-xs text-slate-500 mt-1">{selectedLead?.location}</p>
              </div>
              
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

export default Leads;
