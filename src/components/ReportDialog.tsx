import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  reportContent: string;
}

const ReportDialog: React.FC<ReportDialogProps> = ({
  isOpen,
  onClose,
  companyName,
  reportContent,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rapport sur {companyName}</DialogTitle>
          <DialogDescription>
            Détails du rapport d'analyse pour {companyName}.
          </DialogDescription>
        </DialogHeader>
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{reportContent}</ReactMarkdown>
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose}>Fermer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
