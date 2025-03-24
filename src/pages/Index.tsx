
import React, { useState } from 'react';
import Header from '@/components/Header';
import AnimatedBackground from '@/components/AnimatedBackground';
import UploadArea from '@/components/UploadArea';
import VerificationProcess from '@/components/VerificationProcess';
import ResultCard, { VerificationResult } from '@/components/ResultCard';
import DocumentHistory from '@/components/DocumentHistory';
import { verifyDocument, getMockDocumentHistory } from '@/utils/verificationUtils';
import { Shield, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  
  // Verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  
  // Document history
  const [documentHistory, setDocumentHistory] = useState(getMockDocumentHistory());
  
  const handleFileUpload = async (file: File) => {
    // Reset verification state
    setIsVerifying(true);
    setVerificationComplete(false);
    setVerificationError(false);
    setCurrentStep(0);
    setVerificationResult(null);
    
    try {
      // Simulate step-by-step process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(1);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(2);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(3);
      
      // Get verification result
      const result = await verifyDocument(file);
      
      // Update state with result
      setVerificationResult(result);
      setVerificationComplete(true);
      
      // Add to document history
      const newDoc = {
        id: (documentHistory.length + 1).toString(),
        name: file.name,
        dateUploaded: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        status: result.status
      };
      
      setDocumentHistory([newDoc, ...documentHistory]);
      
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationError(true);
      toast({
        title: "Verification Failed",
        description: "An error occurred during document verification",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleDismissResult = () => {
    setVerificationResult(null);
    setCurrentStep(-1);
  };
  
  const handleSelectHistoryDocument = (id: string) => {
    // In a real app, this would fetch the document details from the server
    // For this demo, we'll just show a toast
    toast({
      title: "Document Selected",
      description: `You selected document #${id}`,
    });
  };
  
  return (
    <div className="relative min-h-screen flex flex-col">
      <AnimatedBackground />
      <Header />
      
      <main className="flex-1 container px-4 py-8 md:py-12">
        <section className="max-w-screen-xl mx-auto mb-16 animate-fade-in">
          <div className="text-center mb-8 md:mb-14">
            <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-sm">
              <Shield className="w-4 h-4 mr-2" />
              <span>Land Document Verification Platform</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 leading-tight">
              Verify Your 7/12 Land Extract<br />With Confidence
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our advanced verification system helps detect fraud and ensures the authenticity of your land records.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              {/* Upload area */}
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-xl font-medium mb-4">Upload Document</h2>
                <UploadArea onFileUpload={handleFileUpload} />
              </div>
              
              {/* Document history */}
              <div className="glass-panel rounded-xl p-6">
                <DocumentHistory 
                  documents={documentHistory} 
                  onSelectDocument={handleSelectHistoryDocument} 
                />
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Verification process */}
              {(currentStep >= 0 || isVerifying) && (
                <div className="glass-panel rounded-xl p-6 animate-slide-up">
                  <h2 className="text-xl font-medium mb-4">Verification Process</h2>
                  <VerificationProcess 
                    isVerifying={isVerifying}
                    verificationComplete={verificationComplete}
                    verificationError={verificationError}
                    currentStep={currentStep}
                  />
                </div>
              )}
              
              {/* Verification result */}
              {verificationResult && (
                <div className="animate-slide-up mt-4">
                  <ResultCard 
                    result={verificationResult} 
                    onDismiss={handleDismissResult}
                  />
                </div>
              )}
              
              {/* Info card (only show if not verifying) */}
              {currentStep === -1 && !isVerifying && (
                <div className="glass-panel rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-full bg-primary/10 mt-1">
                      <HelpCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">How It Works</h3>
                      <p className="text-muted-foreground mb-4">
                        Our system uses advanced algorithms to verify the authenticity of your 7/12 land extract documents by checking for:
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                          <span>Fake survey numbers or unauthorized modifications</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                          <span>Tampering with ownership details or area information</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                          <span>Duplicate entries or potential Power of Attorney misuse</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                          <span>Government land encroachment indicators</span>
                        </li>
                      </ul>
                      <div className="mt-4 pt-4 border-t">
                        <Button className="w-full sm:w-auto">Learn More</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section className="max-w-screen-xl mx-auto py-8 md:py-12 animate-fade-in">
          <Separator className="mb-12" />
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">Why Verify Your Documents?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ensure your land transactions are secure by verifying document authenticity before proceeding.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Detect Fraud",
                description: "Identify fake survey numbers, tampering, and unauthorized modifications to protect your investment."
              },
              {
                title: "Ensure Authenticity",
                description: "Verify that your 7/12 extract is legitimate and issued by the proper government authority."
              },
              {
                title: "Secure Transactions",
                description: "Proceed with land transactions confidently knowing your documents are authentic and legally valid."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="glass-panel rounded-xl p-6 hover:shadow-medium hover:translate-y-[-2px] transition-all"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-medium">{index + 1}</span>
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <footer className="border-t py-6 bg-background/80 backdrop-blur-sm">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-semibold">DocuVerify</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Secure document verification platform
              </p>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </a>
            </div>
          </div>
          <div className="mt-6 text-center md:text-left">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} DocuVerify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
