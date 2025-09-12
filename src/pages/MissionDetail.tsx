import React, { useState, useEffect, useCallback } from 'react';
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
  MoreHorizontal,
  Loader2,
  Save
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
import { missionSchema, paginatedMissionLeadsSchema } from '@/lib/schemas';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import ReportDialog from '@/components/ReportDialog';
import { useProfile } from '@/hooks/useProfile';
import { MessageLoader } from '@/components/ui/MessageLoader'; // Assuming you create this

const API_BASE = import.meta.env.VITE_API_BASE;

const MissionDetail = () => {
  const { id } = useParams();
  const [mission, setMission] = useState(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const { profile } = useProfile();
  const [isSending, setIsSending] = useState(false);
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(10);
  const [totalLeads, setTotalLeads] = useState(0);
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
        
        if (data.mission_completed === 1) {
          data.status = 'completed';
          data.progress = 100;
        }

        const parsed = missionSchema.safeParse(data);
        if (!parsed.success) throw new Error('Format de mission invalide');
        setMission(parsed.data);
      } catch (e: any) {
        setError(e.message || 'Erreur inconnue');
      }
    };

    const fetchLeadsData = async (page: number, limit: number) => {
      if (!id) return;
      try {
        const token = localStorage.getItem('token');
        const skip = (page - 1) * limit;
        const res = await fetch(`${API_BASE}/missions/${id}/leads/?skip=${skip}&limit=${limit}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Erreur lors du chargement des leads');
        const data = await res.json();
        const parsed = paginatedMissionLeadsSchema.safeParse(data);
        if (!parsed.success) {
          throw new Error('Format de données inattendu');
        }
        setLeads(parsed.data.items);
        setTotalLeads(parsed.data.count);
      } catch (e: any) {
        // Optionally handle error
      }
    };

    const initialFetch = async () => {
      setLoading(true);
      await Promise.all([fetchMissionData(), fetchLeadsData(currentPage, leadsPerPage)]);
      setLoading(false);
    };

    initialFetch();

    let missionIntervalId: NodeJS.Timeout;
    let leadsIntervalId: NodeJS.Timeout;

    if (mission && mission.status !== 'completed') {
      missionIntervalId = setInterval(fetchMissionData, 5000);
      leadsIntervalId = setInterval(() => fetchLeadsData(currentPage, leadsPerPage), 5000);
    }

    return () => {
      if (missionIntervalId) clearInterval(missionIntervalId);
      if (leadsIntervalId) clearInterval(leadsIntervalId);
    };
  }, [id, mission?.status, currentPage, leadsPerPage]);

  const fetchMessage = useCallback(async (leadId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/messages/${leadId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch message');
      }
      const data = await res.json();
      if (data.status !== 'writing') {
        setMessage(data.body);
        setEmailSubject(data.subject);
        setIsGeneratingMessage(false);
        // Update the lead's status on the client-side
        setLeads(prevLeads =>
          prevLeads.map(l =>
            l.id === leadId ? { ...l, contact_status: 'draft' } : l
          )
        );
        return true; // Polling complete
      }
    } catch (err) {
      toast.error("Failed to fetch message update.");
      setIsGeneratingMessage(false);
      return true; // Stop polling on error
    }
    return false; // Polling continues
  }, []);

  const openContactModal = async (lead: any) => {
    setSelectedLead(lead);
    setRecipientEmail(lead.email || '');
    setContactModalOpen(true);
  
    // If message is already generated and in a final state
    if ((lead.contact_status === 'draft' || lead.contact_status === 'sent') && lead.draft_message) {
      setMessage(lead.draft_message);
      setEmailSubject(`Proposition de valeur pour ${lead.company_name}`);
      setIsGeneratingMessage(false);
      return;
    }
  
    setIsGeneratingMessage(true);
    setMessage('');
    setEmailSubject('');
  
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/messages/generate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lead_id: lead.id }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to initiate message generation");
      }
  
      const draft = await res.json();
  
      if (draft.status === 'writing') {
        const pollInterval = setInterval(async () => {
          const done = await fetchMessage(lead.id);
          if (done) {
            clearInterval(pollInterval);
            clearTimeout(timeout); // Clear the timeout if polling is successful
          }
        }, 3000); // Poll every 3 seconds

        const timeout = setTimeout(() => {
          clearInterval(pollInterval);
          toast.error("Message generation timed out. Please try again.");
          setIsGeneratingMessage(false);
        }, 120000); // 2 minutes timeout
      } else {
        setMessage(draft.body);
        setEmailSubject(draft.subject);
        setIsGeneratingMessage(false);
        setLeads(prevLeads =>
          prevLeads.map(l =>
            l.id === lead.id ? { ...l, contact_status: 'draft', draft_message: draft.body } : l
          )
        );
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
      setIsGeneratingMessage(false);
    }
  };

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

  const openReportModal = (lead: any) => {
    setSelectedLead(lead);
    setReportModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
                    onClick={() => openReportModal(lead)}
                    className=" bg-none text-purple-600 px-3 py-1 font-semibold hover:text-purple-400 transition"
                  >
                    Afficher le rapport
                  </Button>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openContactModal(lead)}
                          disabled={lead.contact_status === 'sent' || !lead.email}
                        >
                          Contact
                        </Button>
                      </TooltipTrigger>
                      {(lead.contact_status === 'sent' || !lead.email) && (
                        <TooltipContent>
                          {lead.contact_status === 'sent' ? (
                            <p>Message already sent to this lead.</p>
                          ) : (
                            <p>No email available for this lead.</p>
                          )}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
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
                                    onClick={() => openReportModal(lead)}
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
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => openContactModal(lead)}
                                        disabled={lead.contact_status === 'sent'}
                                      >
                                        Contact
                                      </Button>
                                    </TooltipTrigger>
                                    {lead.contact_status === 'sent' && (
                                      <TooltipContent>
                                        <p>Message already sent to this lead.</p>
                                      </TooltipContent>
                                    )}
                                  </Tooltip>
                                </TooltipProvider>
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
      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="sm:max-w-lg h-[90%] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contacter {selectedLead.company_name}</DialogTitle>
            <DialogDescription>
              Envoyez un e-mail à {selectedLead.company_name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sender-email">De</Label>
              <Input
                id="sender-email"
                type="email"
                value={profile?.company_email || ''}
                readOnly
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipient-email">Destinataire</Label>
              <Input
                id="recipient-email"
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Sujet</Label>
              <Input
                id="subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              {isGeneratingMessage ? (
                <div className="flex items-center justify-center h-48 bg-gray-50 rounded-md">
                  <MessageLoader />
                </div>
              ) : (
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  placeholder="Écrivez votre message ici..."
                />
              )}
            </div>
          </div>
          <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button variant="outline" onClick={() => setContactModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveDraft} disabled={isSavingDraft || isGeneratingMessage}>
              {isSavingDraft ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Draft
            </Button>
            <Button type="submit" onClick={() => handleSendMessage(selectedLead.id)} disabled={isSending || isGeneratingMessage}>
              {isSending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isSending ? 'Sending...' : 'Send Message'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )}

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