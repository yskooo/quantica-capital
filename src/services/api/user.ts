
// User API endpoints and methods
import { apiRequest } from './core';
import { UserProfile, UserSettings } from './types';

export const userService = {
  getProfile: () => apiRequest<UserProfile>('users/profile'),
  
  updateProfile: (data: Partial<UserProfile>) => 
    apiRequest<UserProfile>('users/profile', 'PUT', data),
    
  updateSettings: (data: UserSettings) => 
    apiRequest<UserSettings>('users/settings', 'PUT', data),
};
