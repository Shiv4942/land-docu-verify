
import React from 'react';
import { cn } from '@/lib/utils';
import { Shield, AlertTriangle, Info, CheckCircle2, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

export type VerificationResult = {
  status: 'authentic' | 'suspicious' | 'invalid' | 'processing' | 'error';
  documentName: string;
  documentType: string;
  verificationDate: string;
  issueDate?: string;
  score?: number;
  findings: {
    type: 'warning' | 'error' | 'info' | 'success';
    message: string;
  }[];
  recommendations?: string[];
};

interface ResultCardProps {
  result: VerificationResult;
  className?: string;
  onDismiss?: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  result, 
  className,
  onDismiss 
}) => {
  // Status styling
  const getStatusColor = (status: VerificationResult['status']) => {
    switch (status) {
      case 'authentic': return 'text-verification-success bg-verification-success/10';
      case 'suspicious': return 'text-verification-pending bg-verification-pending/10';
      case 'invalid': return 'text-verification-error bg-verification-error/10';
      case 'processing': return 'text-verification-info bg-verification-info/10';
      case 'error': return 'text-verification-error bg-verification-error/10';
      default: return 'text-muted-foreground bg-muted/20';
    }
  };

  const getStatusIcon = (status: VerificationResult['status']) => {
    switch (status) {
      case 'authentic': return <CheckCircle2 className="h-5 w-5" />;
      case 'suspicious': return <AlertTriangle className="h-5 w-5" />;
      case 'invalid': return <AlertTriangle className="h-5 w-5" />;
      case 'processing': return <Info className="h-5 w-5" />;
      case 'error': return <AlertTriangle className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getStatusText = (status: VerificationResult['status']) => {
    switch (status) {
      case 'authentic': return 'Verified Authentic';
      case 'suspicious': return 'Potentially Suspicious';
      case 'invalid': return 'Invalid Document';
      case 'processing': return 'Processing';
      case 'error': return 'Verification Error';
      default: return 'Unknown';
    }
  };

  const getItemIcon = (type: 'warning' | 'error' | 'info' | 'success') => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-verification-pending" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-verification-error" />;
      case 'info': return <Info className="h-4 w-4 text-verification-info" />;
      case 'success': return <CheckCircle2 className="h-4 w-4 text-verification-success" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Card className={cn(
      "w-full max-w-lg mx-auto overflow-hidden transition-all animate-fade-in",
      className
    )}>
      <div className="relative">
        {/* Decorative top bar */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-1.5",
          result.status === 'authentic' ? "bg-verification-success" : 
          result.status === 'suspicious' ? "bg-verification-pending" :
          result.status === 'invalid' ? "bg-verification-error" :
          result.status === 'processing' ? "bg-verification-info" :
          "bg-verification-error"
        )} />
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2 mb-1">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Document Verification Result
              </p>
            </div>
            <div className={cn(
              "text-xs font-medium px-2 py-1 rounded-full flex items-center space-x-1",
              getStatusColor(result.status)
            )}>
              {getStatusIcon(result.status)}
              <span>{getStatusText(result.status)}</span>
            </div>
          </div>
          <CardTitle className="text-xl">{result.documentName}</CardTitle>
          <CardDescription>
            {result.documentType} • Verified on {result.verificationDate}
            {result.issueDate && ` • Issued on ${result.issueDate}`}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-6">
          {result.score !== undefined && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-1">Verification Score</p>
              <div className="w-full bg-secondary rounded-full h-2.5">
                <div 
                  className={cn(
                    "h-2.5 rounded-full",
                    result.score >= 80 ? "bg-verification-success" : 
                    result.score >= 50 ? "bg-verification-pending" : 
                    "bg-verification-error"
                  )}
                  style={{ width: `${result.score}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>0%</span>
                <span>{result.score}%</span>
                <span>100%</span>
              </div>
            </div>
          )}
          
          {/* Findings */}
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Findings</p>
            <div className="space-y-3">
              {result.findings.map((finding, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm">
                  <div className="mt-0.5">
                    {getItemIcon(finding.type)}
                  </div>
                  <p>{finding.message}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recommendations if any */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium mb-2">Recommendations</p>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <ClipboardList className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-2 pb-4 flex justify-between items-center border-t">
          <Button variant="outline" onClick={onDismiss}>
            Dismiss
          </Button>
          <Button>
            Download Report
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ResultCard;
