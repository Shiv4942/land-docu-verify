
import { VerificationResult } from "@/components/ResultCard";

// Mock function to simulate document verification
export const verifyDocument = async (file: File): Promise<VerificationResult> => {
  // This is a mock implementation that would be replaced with actual verification logic
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 4000));
  
  // Randomly determine if document is authentic, suspicious, or invalid for demo purposes
  const statuses: Array<VerificationResult['status']> = ['authentic', 'suspicious', 'invalid'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Generate a random date in the past year for document issue date
  const pastDate = new Date();
  pastDate.setMonth(pastDate.getMonth() - Math.floor(Math.random() * 12));
  const formattedPastDate = pastDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Generate a verification score based on status
  let score: number;
  if (randomStatus === 'authentic') {
    score = 85 + Math.floor(Math.random() * 15); // 85-100
  } else if (randomStatus === 'suspicious') {
    score = 50 + Math.floor(Math.random() * 30); // 50-80
  } else {
    score = 10 + Math.floor(Math.random() * 40); // 10-50
  }
  
  // Generate findings based on status
  const findings = [];
  
  if (randomStatus === 'authentic') {
    findings.push({
      type: 'success' as const,
      message: 'Document structure and format are valid.'
    });
    findings.push({
      type: 'success' as const,
      message: 'Survey number verified successfully.'
    });
    findings.push({
      type: 'success' as const,
      message: 'Document signatures validated successfully.'
    });
    findings.push({
      type: 'info' as const,
      message: 'Document was issued by an authorized government entity.'
    });
  } else if (randomStatus === 'suspicious') {
    findings.push({
      type: 'success' as const,
      message: 'Document structure appears valid.'
    });
    findings.push({
      type: 'warning' as const,
      message: 'Inconsistencies detected in land ownership records.'
    });
    findings.push({
      type: 'warning' as const,
      message: 'Potential unauthorized modifications to document content.'
    });
    findings.push({
      type: 'info' as const,
      message: 'Multiple ownership claims detected on this land parcel.'
    });
  } else {
    findings.push({
      type: 'error' as const,
      message: 'Document contains invalid survey numbers.'
    });
    findings.push({
      type: 'error' as const,
      message: 'Detected unauthorized document alterations.'
    });
    findings.push({
      type: 'error' as const,
      message: 'Official seal or watermark missing or tampered.'
    });
    findings.push({
      type: 'warning' as const,
      message: 'Document signatures could not be verified.'
    });
  }
  
  // Generate recommendations based on status
  let recommendations: string[] = [];
  
  if (randomStatus === 'authentic') {
    recommendations = [
      'Store this document safely for future reference.',
      'Keep digital backup of this verified document.',
      'No further verification required at this time.'
    ];
  } else if (randomStatus === 'suspicious') {
    recommendations = [
      'Consult with a legal professional regarding the inconsistencies.',
      'Request a certified copy from the land records office.',
      'Consider conducting a field survey to verify boundaries.'
    ];
  } else {
    recommendations = [
      'Report this document to local authorities immediately.',
      'Do not proceed with any land transactions based on this document.',
      'Request an official verification from the land records department.'
    ];
  }
  
  return {
    status: randomStatus,
    documentName: file.name,
    documentType: '7/12 Land Extract',
    verificationDate: formattedDate,
    issueDate: formattedPastDate,
    score,
    findings,
    recommendations
  };
};

// Helper function to generate mock document history
export const getMockDocumentHistory = () => {
  const statuses: Array<VerificationResult['status']> = ['authentic', 'suspicious', 'invalid', 'processing'];
  
  const mockDocuments = [
    {
      id: '1',
      name: 'Land_Extract_Survey123.pdf',
      dateUploaded: 'May 15, 2023',
      status: statuses[Math.floor(Math.random() * (statuses.length - 1))] as VerificationResult['status']
    },
    {
      id: '2',
      name: '7-12_Extract_Village_Pune.pdf',
      dateUploaded: 'April 28, 2023',
      status: statuses[Math.floor(Math.random() * (statuses.length - 1))] as VerificationResult['status']
    },
    {
      id: '3',
      name: 'Property_Document_Plot45.jpg',
      dateUploaded: 'March 12, 2023',
      status: statuses[Math.floor(Math.random() * (statuses.length - 1))] as VerificationResult['status']
    }
  ];
  
  return mockDocuments;
};
