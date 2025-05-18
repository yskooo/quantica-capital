
// Registration API endpoints and methods
import { apiRequest } from './core';
import { ApplicationStatus } from './types';
import { RegistrationData } from '@/types/models';

export const registrationService = {
  submitApplication: (data: RegistrationData) => 
    apiRequest<{ applicationId: string }>('registration/submit', 'POST', data),
    
  getApplicationStatus: (applicationId: string) => 
    apiRequest<ApplicationStatus>(`registration/status/${applicationId}`, 'GET'),
    
  uploadDocument: (applicationId: string, documentType: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    // Custom implementation for file upload
    return apiRequest<{ documentId: string }>(`registration/documents/${applicationId}/${documentType}`, 'POST', formData);
  },
};
