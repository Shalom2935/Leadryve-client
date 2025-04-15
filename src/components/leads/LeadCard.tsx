
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Linkedin, MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface LeadCardProps {
  lead: {
    id: number;
    companyName: string;
    contactName: string;
    title: string;
    industry: string;
    location: string;
    score: number;
    contactMethods: string[];
    status: string;
    mission: string;
  };
  openContactModal: (lead: any) => void;
  getScoreClass: (score: number) => string;
  getStatusBadge: (status: string) => React.ReactNode;
}

const LeadCard: React.FC<LeadCardProps> = ({ 
  lead, 
  openContactModal, 
  getScoreClass, 
  getStatusBadge 
}) => {
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-lg">{lead.companyName}</h3>
            <p className="text-sm text-slate-600">
              {lead.contactName}, {lead.title}
            </p>
          </div>
          <Badge className={getScoreClass(lead.score)}>
            {lead.score}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="text-sm">
            <span className="text-slate-500 block">Industry:</span>
            <span>{lead.industry}</span>
          </div>
          <div className="text-sm">
            <span className="text-slate-500 block">Location:</span>
            <span>{lead.location}</span>
          </div>
          <div className="text-sm">
            <span className="text-slate-500 block">Mission:</span>
            <span>{lead.mission}</span>
          </div>
          <div className="text-sm">
            <span className="text-slate-500 block">Status:</span>
            {getStatusBadge(lead.status)}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
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
          
          <div className="flex gap-2">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadCard;
