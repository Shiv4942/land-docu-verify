
import { VerificationResult } from "@/components/ResultCard";

// Define validation interfaces
interface BasicInformation {
  surveyNumber: string;
  khataNumber: string;
}

interface OwnerDetails {
  name: string;
  address: {
    street?: string;
    city?: string;
    district?: string;
    zipCode?: string;
  };
}

interface LandDetails {
  type: string;
  area: number;
  unit: string;
}

interface EncumbranceDetails {
  status: 'clear' | 'under_dispute' | 'lien_exists';
  details?: string;
}

interface DocumentDates {
  creationDate: Date;
  lastUpdated: Date;
}

interface DocumentMetadata {
  hasRequiredAttachments: boolean;
  hasValidSignatures: boolean;
}

// Land type constants
const VALID_LAND_TYPES = ['agricultural', 'residential', 'commercial', 'industrial', 'forest', 'wasteland'];
const VALID_AREA_UNITS = ['acres', 'hectares', 'square_meters', 'guntha'];

// Mock function to simulate document verification
export const verifyDocument = async (file: File): Promise<VerificationResult> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 4000));
  
  // Initialize validation results
  const validationResults = {
    basicInfo: initializeRandomBasicInfo(),
    ownerDetails: initializeRandomOwnerDetails(),
    landDetails: initializeRandomLandDetails(),
    encumbrance: initializeRandomEncumbrance(),
    dates: initializeRandomDates(),
    metadata: initializeRandomMetadata()
  };
  
  // Validate all document components
  const basicInfoResults = validateBasicInfo(validationResults.basicInfo);
  const ownerDetailsResults = validateOwnerDetails(validationResults.ownerDetails);
  const landDetailsResults = validateLandDetails(validationResults.landDetails);
  const encumbranceResults = validateEncumbrance(validationResults.encumbrance);
  const dateResults = validateDates(validationResults.dates);
  const metadataResults = validateMetadata(validationResults.metadata);
  
  // Combine all findings
  const allFindings = [
    ...basicInfoResults.findings,
    ...ownerDetailsResults.findings,
    ...landDetailsResults.findings,
    ...encumbranceResults.findings,
    ...dateResults.findings,
    ...metadataResults.findings
  ];
  
  // Determine overall status based on findings
  const errorCount = allFindings.filter(f => f.type === 'error').length;
  const warningCount = allFindings.filter(f => f.type === 'warning').length;
  
  let status: VerificationResult['status'];
  let score: number;
  
  if (errorCount > 2) {
    status = 'invalid';
    score = 10 + Math.floor(Math.random() * 40); // 10-50
  } else if (errorCount > 0 || warningCount > 2) {
    status = 'suspicious';
    score = 50 + Math.floor(Math.random() * 30); // 50-80
  } else {
    status = 'authentic';
    score = 85 + Math.floor(Math.random() * 15); // 85-100
  }
  
  // Generate recommendations based on status
  const recommendations = generateRecommendations(status, allFindings);
  
  // Format dates
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Generate a random date in the past year for document issue date
  const pastDate = validationResults.dates.creationDate;
  const formattedPastDate = pastDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return {
    status,
    documentName: file.name,
    documentType: '7/12 Land Extract',
    verificationDate: formattedDate,
    issueDate: formattedPastDate,
    score,
    findings: allFindings.slice(0, 6), // Limit to most important findings
    recommendations
  };
};

// Helper functions to initialize random test data
function initializeRandomBasicInfo(): BasicInformation {
  // 80% chance of valid survey number
  const isValidSurvey = Math.random() > 0.2;
  
  return {
    surveyNumber: isValidSurvey ? `${Math.floor(Math.random() * 1000)}` : Math.random() > 0.5 ? 'ABC123' : '',
    khataNumber: Math.random() > 0.2 ? `K-${Math.floor(Math.random() * 500)}/A` : Math.random() > 0.5 ? '123' : ''
  };
}

function initializeRandomOwnerDetails(): OwnerDetails {
  const hasValidName = Math.random() > 0.2;
  const hasCompleteAddress = Math.random() > 0.3;
  
  return {
    name: hasValidName ? 
      ['Amit Kumar', 'Priya Sharma', 'Rajesh Patel', 'Sunita Devi', 'Vikram Singh'][Math.floor(Math.random() * 5)] : 
      Math.random() > 0.5 ? 'John123' : '',
    address: {
      street: hasCompleteAddress ? `${Math.floor(Math.random() * 100)} Main Road` : '',
      city: hasCompleteAddress ? ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'][Math.floor(Math.random() * 5)] : '',
      district: hasCompleteAddress ? ['Thane', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'][Math.floor(Math.random() * 5)] : '',
      zipCode: hasCompleteAddress ? 
        `${4}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}` : 
        Math.random() > 0.5 ? '123' : ''
    }
  };
}

function initializeRandomLandDetails(): LandDetails {
  const hasValidType = Math.random() > 0.2;
  const hasValidArea = Math.random() > 0.2;
  
  return {
    type: hasValidType ? 
      VALID_LAND_TYPES[Math.floor(Math.random() * VALID_LAND_TYPES.length)] : 
      'unknown',
    area: hasValidArea ? 
      parseFloat((Math.random() * 20).toFixed(2)) : 
      Math.random() > 0.5 ? -5 : 0,
    unit: Math.random() > 0.2 ? 
      VALID_AREA_UNITS[Math.floor(Math.random() * VALID_AREA_UNITS.length)] : 
      'unknown'
  };
}

function initializeRandomEncumbrance(): EncumbranceDetails {
  const statuses: Array<EncumbranceDetails['status']> = ['clear', 'under_dispute', 'lien_exists'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    status: randomStatus,
    details: randomStatus !== 'clear' ? 
      'There is an active loan from State Bank of India registered against this property.' : 
      undefined
  };
}

function initializeRandomDates(): DocumentDates {
  const now = new Date();
  const pastDate = new Date();
  pastDate.setMonth(pastDate.getMonth() - Math.floor(Math.random() * 24)); // Up to 2 years in past
  
  const validLastUpdated = Math.random() > 0.2;
  const lastUpdated = new Date(pastDate);
  
  if (validLastUpdated) {
    lastUpdated.setMonth(lastUpdated.getMonth() + Math.floor(Math.random() * 6)); // 0-6 months after creation
  } else {
    lastUpdated.setMonth(lastUpdated.getMonth() - 6); // Invalid: before creation
  }
  
  return {
    creationDate: pastDate,
    lastUpdated: lastUpdated
  };
}

function initializeRandomMetadata(): DocumentMetadata {
  return {
    hasRequiredAttachments: Math.random() > 0.3,
    hasValidSignatures: Math.random() > 0.3
  };
}

// Validation functions
function validateBasicInfo(info: BasicInformation) {
  const findings: Array<{type: 'warning' | 'error' | 'info' | 'success'; message: string}> = [];
  
  // Survey Number validation
  if (!info.surveyNumber) {
    findings.push({
      type: 'error',
      message: 'Survey number is missing from the document.'
    });
  } else if (!/^\d+$/.test(info.surveyNumber)) {
    findings.push({
      type: 'error',
      message: 'Survey number contains non-numeric characters.'
    });
  } else {
    findings.push({
      type: 'success',
      message: 'Survey number is valid and exists in the registry.'
    });
  }
  
  // Khata Number validation
  if (!info.khataNumber) {
    findings.push({
      type: 'error',
      message: 'Khata number is missing from the document.'
    });
  } else if (!/^K-\d+\/[A-Z]$/.test(info.khataNumber)) {
    findings.push({
      type: 'warning',
      message: 'Khata number format does not match local regulations.'
    });
  } else {
    findings.push({
      type: 'success',
      message: 'Khata number format is valid and verified against records.'
    });
  }
  
  return { findings };
}

function validateOwnerDetails(details: OwnerDetails) {
  const findings: Array<{type: 'warning' | 'error' | 'info' | 'success'; message: string}> = [];
  
  // Owner Name validation
  if (!details.name) {
    findings.push({
      type: 'error',
      message: 'Owner name is missing from the document.'
    });
  } else if (/\d/.test(details.name)) {
    findings.push({
      type: 'warning',
      message: 'Owner name contains numeric characters.'
    });
  } else if (/[^a-zA-Z\s]/.test(details.name)) {
    findings.push({
      type: 'warning',
      message: 'Owner name contains special characters.'
    });
  } else {
    findings.push({
      type: 'success',
      message: 'Owner name is properly formatted.'
    });
  }
  
  // Address validation
  if (!details.address.street || !details.address.city || !details.address.district) {
    findings.push({
      type: 'warning',
      message: 'Owner address is incomplete (missing street, city, or district).'
    });
  }
  
  if (!details.address.zipCode) {
    findings.push({
      type: 'warning',
      message: 'ZIP code is missing from owner address.'
    });
  } else if (!/^\d{6}$/.test(details.address.zipCode)) {
    findings.push({
      type: 'warning',
      message: 'ZIP code format is invalid (should be 6 digits).'
    });
  } else {
    findings.push({
      type: 'success',
      message: 'Owner address details are complete and valid.'
    });
  }
  
  return { findings };
}

function validateLandDetails(details: LandDetails) {
  const findings: Array<{type: 'warning' | 'error' | 'info' | 'success'; message: string}> = [];
  
  // Land Type validation
  if (!VALID_LAND_TYPES.includes(details.type)) {
    findings.push({
      type: 'warning',
      message: `Land type "${details.type}" is not recognized in the official records.`
    });
  } else {
    findings.push({
      type: 'success',
      message: `Land is properly classified as "${details.type}".`
    });
  }
  
  // Area validation
  if (details.area <= 0) {
    findings.push({
      type: 'error',
      message: 'Land area must be a positive value.'
    });
  } else {
    findings.push({
      type: 'success',
      message: `Land area of ${details.area} ${details.unit} verified.`
    });
  }
  
  // Unit validation
  if (!VALID_AREA_UNITS.includes(details.unit)) {
    findings.push({
      type: 'warning',
      message: `Unit of measurement "${details.unit}" is not standard for land records.`
    });
  }
  
  return { findings };
}

function validateEncumbrance(details: EncumbranceDetails) {
  const findings: Array<{type: 'warning' | 'error' | 'info' | 'success'; message: string}> = [];
  
  switch(details.status) {
    case 'clear':
      findings.push({
        type: 'success',
        message: 'Property is free from encumbrances and liens.'
      });
      break;
    case 'under_dispute':
      findings.push({
        type: 'warning',
        message: 'Property is currently under legal dispute. Proceed with caution.'
      });
      break;
    case 'lien_exists':
      findings.push({
        type: 'warning',
        message: 'Property has existing liens or loans registered against it.'
      });
      if (details.details) {
        findings.push({
          type: 'info',
          message: details.details
        });
      }
      break;
  }
  
  return { findings };
}

function validateDates(dates: DocumentDates) {
  const findings: Array<{type: 'warning' | 'error' | 'info' | 'success'; message: string}> = [];
  const now = new Date();
  
  // Creation Date validation
  if (dates.creationDate > now) {
    findings.push({
      type: 'error',
      message: 'Document creation date is in the future.'
    });
  } else {
    findings.push({
      type: 'success',
      message: 'Document creation date is valid.'
    });
  }
  
  // Last Updated Date validation
  if (dates.lastUpdated < dates.creationDate) {
    findings.push({
      type: 'error',
      message: 'Last updated date is before the document creation date.'
    });
  } else if (dates.lastUpdated > now) {
    findings.push({
      type: 'error',
      message: 'Last updated date is in the future.'
    });
  } else {
    findings.push({
      type: 'success',
      message: 'Document update history is valid.'
    });
  }
  
  return { findings };
}

function validateMetadata(metadata: DocumentMetadata) {
  const findings: Array<{type: 'warning' | 'error' | 'info' | 'success'; message: string}> = [];
  
  if (!metadata.hasRequiredAttachments) {
    findings.push({
      type: 'warning',
      message: 'Required attachments or photographs are missing.'
    });
  } else {
    findings.push({
      type: 'success',
      message: 'All required attachments are present.'
    });
  }
  
  if (!metadata.hasValidSignatures) {
    findings.push({
      type: 'error',
      message: 'Document is missing required signatures or stamps.'
    });
  } else {
    findings.push({
      type: 'success',
      message: 'All required signatures and stamps are present and valid.'
    });
  }
  
  return { findings };
}

function generateRecommendations(status: VerificationResult['status'], findings: Array<{type: string; message: string}>): string[] {
  const errorFindings = findings.filter(f => f.type === 'error');
  const warningFindings = findings.filter(f => f.type === 'warning');
  
  if (status === 'authentic') {
    return [
      'Store this document safely for future reference.',
      'Keep digital backup of this verified document.',
      'No further verification required at this time.'
    ];
  } else if (status === 'suspicious') {
    const recommendations = [
      'Consult with a legal professional regarding the inconsistencies.',
      'Request a certified copy from the land records office.'
    ];
    
    if (warningFindings.some(f => f.message.includes('dispute'))) {
      recommendations.push('Verify the legal status of any ongoing disputes mentioned in the document.');
    }
    
    if (warningFindings.some(f => f.message.includes('lien'))) {
      recommendations.push('Obtain an encumbrance certificate to confirm all loans and liens against the property.');
    }
    
    return recommendations;
  } else {
    const recommendations = [
      'Report this document to local authorities immediately.',
      'Do not proceed with any land transactions based on this document.',
      'Request an official verification from the land records department.'
    ];
    
    if (errorFindings.some(f => f.message.includes('Survey'))) {
      recommendations.push('Verify the survey number with the land registry office.');
    }
    
    if (errorFindings.some(f => f.message.includes('signature'))) {
      recommendations.push('Document appears to have missing or invalid signatures. Verify with issuing authority.');
    }
    
    return recommendations;
  }
}

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
