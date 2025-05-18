
// Auth API endpoints and methods
import { apiRequest } from './core';
import { AuthResponse } from './types';
import { RegistrationData } from '@/types/models';

export const authService = {
  login: (credentials: { email: string; password: string }) => 
    apiRequest<AuthResponse>('auth/login', 'POST', credentials),
    
  register: (registrationData: RegistrationData) => 
    apiRequest<AuthResponse>('auth/register', 'POST', registrationData),
    
  logout: () => apiRequest<void>('auth/logout', 'POST'),
  
  verifyEmail: (token: string) => apiRequest<void>(`auth/verify-email/${token}`, 'GET'),
  
  resetPassword: (email: string) => apiRequest<void>('auth/reset-password', 'POST', { email }),
  
  setNewPassword: (data: { token: string; password: string }) => 
    apiRequest<void>('auth/set-password', 'POST', data),
};
