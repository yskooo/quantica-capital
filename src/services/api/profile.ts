
// Profile API service for MySQL database CRUD operations
import { userAPI } from './core';
import { PersonalData, BankDetails, SourceOfFunding, ProfileUpdateRequest } from '@/types/models';

export const profileService = {
  // READ - Get user profile
  getProfile: async (accId: string) => {
    console.log("Fetching profile for Acc_ID:", accId);
    
    try {
      const response = await userAPI.getProfile(accId);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.data;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  },

  // UPDATE - Update user profile
  updateProfile: async (accId: string, profileData: ProfileUpdateRequest) => {
    console.log("Updating profile for Acc_ID:", accId, "with data:", profileData);
    
    try {
      const response = await userAPI.updateProfile(accId, profileData);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.data;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  },

  // DELETE - Delete user profile (soft delete recommended)
  deleteProfile: async (accId: string) => {
    console.log("Deleting profile for Acc_ID:", accId);
    
    try {
      const response = await userAPI.deleteProfile(accId);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response.data;
    } catch (error) {
      console.error("Delete profile error:", error);
      throw error;
    }
  },

  // Helper method to get current user from localStorage
  getCurrentUser: (): PersonalData | null => {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }
};
