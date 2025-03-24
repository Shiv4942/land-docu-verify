
import React from 'react';
import { cn } from '@/lib/utils';
import { File, Clock, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { VerificationResult } from './ResultCard';
import { Button } from '@/components/ui/button';

interface DocumentHistoryProps {
  documents: {
    id: string;
    name: string;
    dateUploaded: string;
    status: VerificationResult['status'];
  }[];
  onSelectDocument: (id: string) => void;
  className?: string;
}

const DocumentHistory: React.FC<DocumentHistoryProps> = ({ 
  documents,
  onSelectDocument,
  className 
}) => {
  const getStatusIcon = (status: VerificationResult['status']) => {
    switch (status) {
      case 'authentic': return <CheckCircle className="h-4 w-4 text-verification-success" />;
      case 'suspicious': return <AlertTriangle className="h-4 w-4 text-verification-pending" />;
      case 'invalid': return <AlertCircle className="h-4 w-4 text-verification-error" />;
      case 'processing': return <Clock className="h-4 w-4 text-verification-info animate-spin-slow" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-verification-error" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Document History</h3>
        <Button variant="ghost" size="sm" className="text-xs">View All</Button>
      </div>
      
      <div className="space-y-3">
        {documents.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground text-sm">
            No documents have been verified yet
          </p>
        ) : (
          documents.map((doc) => (
            <div 
              key={doc.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors cursor-pointer"
              onClick={() => onSelectDocument(doc.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-md bg-primary/10">
                  <File className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">{doc.name}</h4>
                  <p className="text-xs text-muted-foreground">{doc.dateUploaded}</p>
                </div>
              </div>
              <div className="flex items-center">
                {getStatusIcon(doc.status)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DocumentHistory;
