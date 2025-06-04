
// Registration API service for MySQL database
import { apiRequest } from './core';
import { RegistrationData } from '@/types/models';

export const registrationService = {
  register: async (registrationData: RegistrationData) => {
    console.log("Registering user with data:", registrationData);
    
    try {
      // Format data according to backend expectations
      const formattedData = {
        personalData: {
          P_Name: registrationData.personalData?.P_Name,
          P_Address: registrationData.personalData?.P_Address,
          P_Postal_Code: registrationData.personalData?.P_Postal_Code,
          P_Cell_Number: registrationData.personalData?.P_Cell_Number?.toString(), // Convert to string for backend validation
          Date_of_Birth: registrationData.personalData?.Date_of_Birth,
          Employment_Status: registrationData.personalData?.Employment_Status,
          Purpose_of_Opening: registrationData.personalData?.Purpose_of_Opening
        },
        bankDetails: {
          Bank_Acc_Name: registrationData.bankDetails?.Bank_Acc_Name,
          Bank_Acc_Date_of_Opening: registrationData.bankDetails?.Bank_Acc_Date_of_Opening,
          Bank_Name: registrationData.bankDetails?.Bank_Name,
          Branch: registrationData.bankDetails?.Branch
        },
        sourceOfFunding: {
          Nature_of_Work: registrationData.sourceOfFunding?.Nature_of_Work,
          'Business/School_Name': registrationData.sourceOfFunding?.['Business/School_Name'],
          'Office/School_Address': registrationData.sourceOfFunding?.['Office/School_Address'],
          'Office/School_Number': registrationData.sourceOfFunding?.['Office/School_Number'],
          Valid_ID: registrationData.sourceOfFunding?.Valid_ID,
          Source_of_Income: registrationData.sourceOfFunding?.Source_of_Income
        },
        contacts: registrationData.contacts?.map(contact => ({
          role: contact.role,
          relationship: contact.relationship,
          contactDetails: {
            C_Name: contact.contactDetails.C_Name,
            C_Address: contact.contactDetails.C_Address,
            C_Postal_Code: contact.contactDetails.C_Postal_Code,
            C_Email: contact.contactDetails.C_Email,
            C_Contact_Number: contact.contactDetails.C_Contact_Number
          }
        })) || [],
        credentials: {
          email: registrationData.credentials?.email,
          password: registrationData.credentials?.password
        }
      };

      console.log("Formatted data being sent:", formattedData);

      const response = await apiRequest('auth/register', 'POST', formattedData);
      
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
      const response = await apiRequest(`auth/check-email/${encodeURIComponent(email)}`);
      return response.data || { available: true };
    } catch (error) {
      console.error("Email check error:", error);
      return { available: false };
    }
  }
};
