import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  Target, 
  MapPin, 
  Users, 
  Clock, 
  Mail, 
  Phone, 
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
import { MessageLoader } from '@/components/ui/MessageLoader';

const API_BASE = import.meta.env.VITE_API_BASE;

const MissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [mission, setMission] = useState<any>(null);
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
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(10);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768); // Use md breakpoint
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(totalLeads / leadsPerPage));
  }, [totalLeads, leadsPerPage]);

  const fetchMissionData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/missions/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
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
  }, [id]);

  const fetchLeadsData = useCallback(async (page: number) => {
    if (!id) return;
    try {
      const token = localStorage.getItem('token');
      const skip = (page - 1) * leadsPerPage;
      const res = await fetch(`${API_BASE}/missions/${id}/leads/?skip=${skip}&limit=${leadsPerPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erreur lors du chargement des leads');
      const data = await res.json();
      const parsed = paginatedMissionLeadsSchema.safeParse(data);
      if (!parsed.success) throw new Error('Format de données inattendu');
      setLeads(parsed.data.items);
      setTotalLeads(parsed.data.count);
    } catch (e: any) {
      console.error("Failed to fetch leads:", e);
    }
  }, [id, leadsPerPage]);

  useEffect(() => {
    const initialFetch = async () => {
      setLoading(true);
      setError('');
      await Promise.all([fetchMissionData(), fetchLeadsData(currentPage)]);
      setLoading(false);
    };
    initialFetch();
  }, [id, currentPage, fetchMissionData, fetchLeadsData]);

  useEffect(() => {
    if (mission && mission.status !== 'completed') {
      const intervalId = setInterval(() => {
        fetchMissionData();
        fetchLeadsData(currentPage);
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [mission, currentPage, fetchMissionData, fetchLeadsData]);

  const clearPolling = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
    pollIntervalRef.current = null;
    pollTimeoutRef.current = null;
  };

  const handleModalOpenChange = (isOpen: boolean) => {
    setContactModalOpen(isOpen);
    if (!isOpen) {
      clearPolling();
      setIsGeneratingMessage(false);
    }
  };

  const fetchMessageStatus = useCallback(async (leadId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/messages/${leadId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Failed to fetch message');
      }
      return await res.json();
    } catch (err) {
      toast.error("Failed to fetch message status.");
      return { status: 'error' };
    }
  }, []);

  const openContactModal = async (lead: any) => {
    setSelectedLead(lead);
    setRecipientEmail(lead.email || '');
    setContactModalOpen(true);
    setMessage('');
    setEmailSubject('');

    const messageData = await fetchMessageStatus(lead.id);

    if (messageData && (messageData.status === 'draft' || messageData.status === 'sent')) {
      setMessage(messageData.body);
      setEmailSubject(messageData.subject);
      return;
    }

    if (messageData && messageData.status === 'writing') {
      setIsGeneratingMessage(true);
    } else {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/messages/generate/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ lead_id: lead.id }),
        });
        if (!res.ok) throw new Error('Failed to initiate message generation');
        setIsGeneratingMessage(true);
      } catch (err: any) {
        toast.error(err.message || "An error occurred.");
        return;
      }
    }

    pollIntervalRef.current = setInterval(async () => {
      const polledMessage = await fetchMessageStatus(lead.id);
      if (polledMessage && polledMessage.status === 'draft') {
        clearPolling();
        setIsGeneratingMessage(false);
        setMessage(polledMessage.body);
        setEmailSubject(polledMessage.subject);
        setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, contact_status: 'draft' } : l));
      } else if (polledMessage && polledMessage.status === 'error') {
        clearPolling();
        setIsGeneratingMessage(false);
      }
    }, 3000);

    pollTimeoutRef.current = setTimeout(() => {
      clearPolling();
      setIsGeneratingMessage(false);
      toast.error("Message generation timed out. Please try again.");
    }, 120000);
  };
  
  const handleSaveDraft = async () => {
    if (!selectedLead) return;
    setIsSavingDraft(true);
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE}/messages/${selectedLead.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ body: message, subject: emailSubject, lead_id: selectedLead.id }),
      });
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, draft_message: message, contact_status: 'draft' } : l));
      toast.success("Draft saved successfully!");
      handleModalOpenChange(false);
    } catch (err) {
      toast.error("Failed to save draft.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedLead) return;
    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      if (!profile?.email_provider) {
        toast.error("Aucun fournisseur de messagerie connecté.");
        return;
      }
      const sendEndpoint = `${API_BASE}/email/${profile.email_provider}/send/`;
      await fetch(sendEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          lead_id: selectedLead.id,
          to: recipientEmail,
          subject: emailSubject,
          body: message,
        }),
      });
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, contact_status: 'sent' } : l));
      toast.success("Message sent successfully!");
      handleModalOpenChange(false);
    } catch (err) {
      toast.error("Failed to send message.");
    } finally {
      setIsSending(false);
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

  if (loading) return <AppLayout><div className="p-8 text-center">Chargement de la mission...</div></AppLayout>;
  if (error) return <AppLayout><div className="p-8 text-center text-red-600">{error}</div></AppLayout>;
  if (!mission) return <AppLayout><div className="p-8 text-center">Aucune mission trouvée.</div></AppLayout>;

  const renderLeadScore = (score: number) => {
    let scoreClass = "bg-red-100 text-red-700";
    if (score >= 80) scoreClass = "bg-green-100 text-green-700";
    else if (score >= 50) scoreClass = "bg-yellow-100 text-yellow-700";
    return <Badge className={scoreClass}>{score}</Badge>;
  }

  return (
    <>
      <AppLayout>
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-y-2">
            <div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{mission.name}</h1>
                <Badge className="shrink-0 bg-green-100 text-green-800">{mission.status}</Badge>
              </div>
              <p className="mt-1 text-muted-foreground">Mission ID: {mission.id}</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Détails de la mission</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3"><MapPin size={18} className="mt-1 shrink-0 text-leadryve-purple" /><div><p className="font-medium">Localisation</p><p className="text-sm text-muted-foreground">{mission.target_location}</p></div></div>
                  <div className="flex items-start gap-3"><Target size={18} className="mt-1 shrink-0 text-leadryve-purple" /><div><p className="font-medium">Secteur cible</p><p className="text-sm text-muted-foreground">{mission.target_sector}</p></div></div>
                  <div className="flex items-start gap-3"><Users size={18} className="mt-1 shrink-0 text-leadryve-purple" /><div><p className="font-medium">Leads Demandés</p><p className="text-sm text-muted-foreground">{mission.lead_count}</p></div></div>
                  <div className="flex items-start gap-3"><Clock size={18} className="mt-1 shrink-0 text-leadryve-purple" /><div><p className="font-medium">Progression</p><Progress value={mission.progress} className="mt-1 h-2" /><p className="text-sm text-muted-foreground">{Math.floor(mission.progress)}% Terminée</p></div></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Leads</h2>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search leads..." className="pl-8 w-full" />
                </div>
                <Button variant="outline" className="w-full sm:w-auto"><Filter className="h-4 w-4 mr-2" />Filter</Button>
              </div>
            </div>
            <Card>
              <CardContent className="p-0">
                {isMobile ? (
                  <div className="flex flex-col divide-y">
                    {leads.map((lead) => (
                      <div key={lead.id} className="p-4 space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <span className="font-bold text-lg break-words">{lead.company_name}</span>
                          {renderLeadScore(lead.score)}
                        </div>
                        <div className="text-sm text-muted-foreground break-words">{lead.address}</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2"><Mail size={16} className="shrink-0"/> <span className="truncate">{lead.email || '—'}</span></div>
                                                    <div className="flex items-start gap-2"><Phone size={16} className="shrink-0 mt-1"/> 
                            <div>
                              {Array.isArray(lead.phone) && lead.phone.length > 0 ? (
                                lead.phone.slice(0, 3).map((p, index) => (
                                  <div key={index}>{p}</div>
                                ))
                              ) : (
                                <span>—</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 pt-2">
                          {lead.reason && <Button variant="link" size="sm" onClick={() => openReportModal(lead)} className="p-0 h-auto justify-start text-leadryve-purple">Afficher le rapport</Button>}
                          <Button variant="outline" size="sm" onClick={() => openContactModal(lead)} disabled={lead.contact_status === 'sent' || !lead.email} className="w-full">Contact</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader><TableRow><TableHead>Entreprise</TableHead><TableHead>Localisation</TableHead><TableHead>Score</TableHead><TableHead>Contact</TableHead><TableHead>Rapport</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {leads.map((lead) => (
                          <TableRow key={lead.id}>
                            <TableCell className="font-medium">{lead.company_name}</TableCell>
                            <TableCell className="text-muted-foreground">{lead.address}</TableCell>
                            <TableCell>{renderLeadScore(lead.score)}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {lead.email && <div className="flex items-center gap-2"><Mail size={14} className="shrink-0"/> <span className="truncate">{lead.email}</span></div>}
                              {lead.phone && <div className="flex items-center gap-2 mt-1"><Phone size={14} className="shrink-0"/> <span>{lead.phone}</span></div>}
                            </TableCell>
                            <TableCell>{lead.reason ? <Button variant="link" size="sm" onClick={() => openReportModal(lead)} className="p-0 h-auto text-leadryve-purple">Afficher le rapport</Button> : <span className="text-muted-foreground">—</span>}</TableCell>
                            <TableCell className="text-right"><div className="flex justify-end gap-2">
                              <TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="outline" size="sm" onClick={() => openContactModal(lead)} disabled={lead.contact_status === 'sent' || !lead.email}>Contact</Button></TooltipTrigger>{(lead.contact_status === 'sent' || !lead.email) && <TooltipContent>{lead.contact_status === 'sent' ? <p>Message already sent.</p> : <p>No email available.</p>}</TooltipContent>}</Tooltip></TooltipProvider>
                              <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem>View Details</DropdownMenuItem><DropdownMenuItem>Mark as Qualified</DropdownMenuItem><DropdownMenuItem className="text-red-600">Remove Lead</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
                            </div></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
            {totalPages > 1 && <Pagination className="pt-4">
              <PaginationContent>
                <PaginationItem><PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} /></PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}><PaginationLink isActive={currentPage === i + 1} onClick={() => handlePageChange(i + 1)}>{i + 1}</PaginationLink></PaginationItem>
                ))}
                <PaginationItem><PaginationNext onClick={() => handlePageChange(currentPage + 1)} /></PaginationItem>
              </PaginationContent>
            </Pagination>}
          </div>
        </div>
      </AppLayout>

      {selectedLead && (
        <Dialog open={contactModalOpen} onOpenChange={handleModalOpenChange}>
          <DialogContent className="w-[95%] max-h-[90vh] overflow-y-auto sm:max-w-lg rounded-lg">
            <DialogHeader>
              <DialogTitle>Contacter {selectedLead.company_name}</DialogTitle>
              <DialogDescription>Envoyez un e-mail à {selectedLead.company_name}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2"><Label htmlFor="sender-email">De</Label><Input id="sender-email" type="email" value={profile?.company_email || ''} readOnly className="bg-gray-100 dark:bg-gray-800" /></div>
              <div className="space-y-2"><Label htmlFor="recipient-email">Destinataire</Label><Input id="recipient-email" type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="subject">Sujet</Label><Input id="subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} /></div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                {isGeneratingMessage ? <div className="flex items-center justify-center rounded-md bg-gray-50 dark:bg-gray-900 min-h-[200px]"><MessageLoader /></div> : <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={8} placeholder="Écrivez votre message ici..." />}
              </div>
            </div>
            <DialogFooter className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => handleModalOpenChange(false)} className="w-full sm:w-auto">Cancel</Button>
              <Button onClick={handleSaveDraft} disabled={isSavingDraft || isGeneratingMessage} className="w-full sm:w-auto">{isSavingDraft ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save Draft</Button>
              <Button type="submit" onClick={handleSendMessage} disabled={isSending || isGeneratingMessage} className="w-full sm:w-auto">{isSending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</> : 'Send Message'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {selectedLead && <ReportDialog isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} companyName={selectedLead.company_name} reportContent={selectedLead.reason || ''} />}
    </>
  );
};

export default MissionDetail;