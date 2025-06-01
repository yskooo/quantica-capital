
// Registration API service for MySQL database
import { authAPI } from './core';
import { RegistrationData } from '@/types/models';

export const registrationService = {
  register: async (registrationData: RegistrationData) => {
    console.log("Registering user with data:", registrationData);
    
    try {
      const response = await authAPI.register(registrationData);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },
  
  // Validate email availability
  checkEmailAvailability: async (email: string) => {
    try {
      // This would be implemented when backend is ready
      console.log("Checking email availability for:", email);
      return { available: true };
    } catch (error) {
      console.error("Email check error:", error);
      return { available: false };
    }
  }
};
