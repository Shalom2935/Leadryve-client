import React, { useState, useEffect } from 'react';
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
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
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
import { missionSchema } from '@/lib/schemas';
import { missionLeadsListSchema } from '@/lib/schemas';
import { SelectScrollUpButton } from '@/components/ui/select';
import ReportDialog from '@/components/ReportDialog'; // Import the new component

const API_BASE = import.meta.env.VITE_API_BASE;

const MissionDetail = () => {
  const { id } = useParams();
  const [mission, setMission] = useState(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [sendNow, setSendNow] = useState(true);
  const [message, setMessage] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false); // New state for report dialog
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    const fetchMissionData = async () => {
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/missions/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Erreur lors du chargement de la mission');
        const data = await res.json();
        const parsed = missionSchema.safeParse(data);
        if (!parsed.success) throw new Error('Format de mission invalide');
        setMission(parsed.data);
      } catch (e: any) {
        setError(e.message || 'Erreur inconnue');
      }
    };

    const fetchLeadsData = async () => {
      if (!id) return;
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/missions/${id}/leads/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Erreur lors du chargement des leads');
        const data = await res.json();
        console.log('Raw leads data received:', data); // Log raw data
        const parsed = missionLeadsListSchema.safeParse(data.items);
        if (!parsed.success) {
          console.error('Leads schema parsing error:', parsed.error); // Log parsing error
          throw new Error('Format de données inattendu');
        }
        setLeads(parsed.data); // Use parsed data
        console.log('Parsed leads data set to state:', parsed.data); // Log parsed data
      } catch (e: any) {
        // Optionally handle error
      }
    };

    // Initial load for both mission and leads
    const initialFetch = async () => {
      setLoading(true);
      await Promise.all([fetchMissionData(), fetchLeadsData()]);
      setLoading(false);
    };

    initialFetch();

    // Set up polling for mission and leads if mission is not completed
    let missionIntervalId: NodeJS.Timeout;
    let leadsIntervalId: NodeJS.Timeout;

    if (mission && mission.status !== 'completed') {
      missionIntervalId = setInterval(fetchMissionData, 5000);
      leadsIntervalId = setInterval(fetchLeadsData, 5000);
    }

    // Cleanup function to clear intervals
    return () => {
      if (missionIntervalId) {
        clearInterval(missionIntervalId);
      }
      if (leadsIntervalId) {
        clearInterval(leadsIntervalId);
      }
    };
  }, [id, mission?.status]); // Re-run effect if id or mission status changes

  const getScoreClass = (score: number) => {
    if (score >= 80) return 'lead-score-high';
    if (score >= 60) return 'lead-score-medium';
    return 'lead-score-low';
  };

  

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const openContactModal = (lead: any) => {
    setSelectedLead(lead);
    setMessage(`Hi, I came across ${lead.company_name} and I'd like to discuss how our solution might be valuable for your business.`);
    setContactModalOpen(true);
  };

  const openReportModal = (lead: any) => { // New function to open report dialog
    setSelectedLead(lead);
    setReportModalOpen(true);
  };

  const handleSendMessage = () => {
    toast.success(`Message ${sendNow ? 'sent' : 'scheduled'} to ${selectedLead.company_name}!`);
    setContactModalOpen(false);
    toast(`Lead status updated to "Contacted"`, {
      description: selectedLead.company_name,
    });
  };

  if (loading) {
    return (
      <AppLayout><div className="p-8 text-center">Chargement de la mission...</div></AppLayout>
    );
  }
  if (error) {
    return <AppLayout><div className="p-8 text-center text-red-600">{error}</div></AppLayout>;
  }
  if (!mission) {
    return <AppLayout><div className="p-8 text-center">Aucune mission trouvée.</div></AppLayout>;
  }

  return (
    <>
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{mission.name}</h1>
              <Badge className="bg-green-100 text-green-800">{mission.status}</Badge>
            </div>
            <p className="text-muted-foreground">Mission ID: {mission.id}</p>
          </div>
          {/* <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
            <Button>
              Edit Mission
            </Button>
          </div> */}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Détails de la mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2">
                  <MapPin size={18} className="text-leadryve-purple mt-0.5" />
                  <div>
                    <p className="font-medium">Localisation</p>
                    <p className="text-sm">{mission.target_location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Target size={18} className="text-leadryve-purple mt-0.5" />
                  <div>
                    <p className="font-medium">Secteur cible</p>
                    <p className="text-sm">{mission.target_sector}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users size={18} className="text-leadryve-purple mt-0.5" />
                  <div>
                    <p className="font-medium">Leads Demandés</p>
                    <p className="text-sm">{mission.lead_count}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock size={18} className="text-leadryve-purple mt-0.5" />
                  <div>
                    <p className="font-medium">Progression</p>
                    <Progress value={mission.progress} className="h-2" />
                    <p className="text-sm">{Math.floor(mission.progress)}% Terminée</p>
                  </div>
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
            {isMobile ? (
        <div className="flex flex-col gap-4">
          {leads.map((lead) => (
            <Card key={lead.id}>
              <CardContent className="p-4 space-y-2">
                <div className="font-bold text-lg">{lead.company_name}</div>
                <div className="text-sm text-slate-600">{lead.address}</div>
                <div>
                  <Badge
                                className={
                                  lead.score >= 80 ? "bg-green-100 text-green-700" :
                                  lead.score >= 50 ? "bg-yellow-100 text-yellow-700" :
                                  "bg-red-100 text-red-700"
                                }
                              >
                                {lead.score}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} /> {lead.email || <span className="text-slate-400">—</span>}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} /> {lead.phone || <span className="text-slate-400">—</span>}
                </div>
                <div>
                  {lead.reason ? (
                    <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openReportModal(lead)} // Use new function
                    className=" bg-none text-purple-600 px-3 py-1 font-semibold hover:text-purple-400 transition"
                  >
                    Afficher le rapport
                  </Button>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openContactModal(lead)}>Contact</Button>
                  {/* autres actions... */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Entreprise</TableHead>
                          <TableHead>Localisation</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Téléphone</TableHead>
                          <TableHead>Rapport</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leads.map((lead) => (
                          <TableRow key={lead.id}>
                            <TableCell className="font-medium">{lead.company_name}</TableCell>
                            <TableCell>{lead.address}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  lead.score >= 80 ? "bg-green-100 text-green-700" :
                                  lead.score >= 50 ? "bg-yellow-100 text-yellow-700" :
                                  "bg-red-100 text-red-700"
                                }
                              >
                                {lead.score}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {lead.email ? (
                                <span className="flex items-center gap-1"><Mail size={16} className="text-slate-600" />{lead.email}</span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {lead.phone ? (
                                <span className="flex items-center gap-1"><Phone size={16} className="text-slate-600" />{lead.phone}</span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                                {lead.reason ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openReportModal(lead)} // Use new function
                                    className=" bg-none text-purple-600 px-3 py-1 font-semibold hover:text-purple-400 transition"
                                  >
                                    Afficher le rapport
                                  </Button>
                                ) : (
                                  <span className="text-slate-400">—</span>
                                )}
                                                      </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openContactModal(lead)}
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
        </div>
      )}  
            </CardContent>
          </Card>
        </div>

        
      </div>


  </AppLayout>
  {selectedLead && (
        <ReportDialog
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          companyName={selectedLead.company_name}
          reportContent={selectedLead.reason || ''}
        />
      )}
  </>
  );
};

export default MissionDetail;

//
