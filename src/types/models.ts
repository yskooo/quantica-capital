
// Database models matching MySQL schema exactly

export interface BankDetails {
  Bank_Acc_No: string; // VARCHAR(19) PRIMARY KEY
  Bank_Acc_Name?: string; // VARCHAR(50)
  Bank_Acc_Date_of_Opening?: string; // DATE
  Bank_Name?: string; // VARCHAR(50)
  Branch?: string; // VARCHAR(30)
}

export interface ContactPersonDetails {
  Contact_ID: string; // CHAR(5) PRIMARY KEY
  C_Name?: string; // VARCHAR(50)
  C_Address?: string; // VARCHAR(150)
  C_Postal_Code?: string; // CHAR(5)
  C_Email?: string; // VARCHAR(60)
  C_Contact_Number: string; // VARCHAR(45)
}

export interface SourceOfFunding {
  Funding_ID: string; // CHAR(7) PRIMARY KEY
  Nature_of_Work: string; // VARCHAR(50)
  'Business/School_Name'?: string; // VARCHAR(80)
  'Office/School_Address'?: string; // VARCHAR(150)
  'Office/School_Number'?: string; // VARCHAR(15)
  Valid_ID?: "Driver's License" | "Passport" | "SSS ID" | "PhilHealth ID" | "Student ID" | "National ID" | "Others";
  Source_of_Income?: 'Salary' | 'Business' | 'Remittance' | 'Scholarship' | 'Pension' | 'Others';
}

export interface PersonalData {
  Acc_ID: string; // CHAR(4) PRIMARY KEY
  P_Name?: string; // VARCHAR(50)
  P_Address?: string; // VARCHAR(150)
  P_Postal_Code?: string; // CHAR(5)
  P_Cell_Number: number; // BIGINT
  P_Email?: string; // VARCHAR(60)
  P_Password?: string; // VARCHAR(255) - credentials now stored here
  Date_of_Birth?: string; // DATE
  Employment_Status?: 'Employed' | 'Self-Employed' | 'Unemployed' | 'Student' | 'Retired';
  Purpose_of_Opening?: 'Savings' | 'Investment' | 'Business' | 'Personal Use' | 'Retirement' | 'Others';
  Funding_ID: string; // CHAR(7) FOREIGN KEY
  Bank_Acc_No: string; // VARCHAR(45) FOREIGN KEY
  created_at?: string; // TIMESTAMP
  updated_at?: string; // TIMESTAMP
}

export interface RoleOfContact {
  Acc_ID: string; // CHAR(4) FOREIGN KEY
  C_Role: 'Kin' | 'Referee 1' | 'Referee 2';
  Contact_ID: string; // CHAR(5) FOREIGN KEY
  C_Relationship?: 'Father' | 'Mother' | 'Spouse' | 'Son' | 'Daughter' | 'Friend' | 'Colleague' | 'Mentor' | 'Others';
}

// Add ContactRole type for the registration components
export interface ContactRole {
  role: RoleOfContact['C_Role'];
  relationship?: RoleOfContact['C_Relationship'];
  contactDetails: Omit<ContactPersonDetails, 'Contact_ID'>;
}

// Complete registration data structure
export interface RegistrationData {
  personalData: Omit<PersonalData, 'Acc_ID' | 'Funding_ID' | 'Bank_Acc_No' | 'P_Password'>;
  bankDetails: Omit<BankDetails, 'Bank_Acc_No'>;
  sourceOfFunding: Omit<SourceOfFunding, 'Funding_ID'>;
  contacts: Array<ContactRole>;
  credentials?: {
    email: string;
    password: string;
  };
}

// Login request/response types
export interface LoginRequest {
  email?: string;
  password?: string;
  phone?: number; // Allow login with phone number
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: PersonalData;
  token?: string;
}

// Profile update types
export interface ProfileUpdateRequest {
  personalData?: Partial<PersonalData>;
  bankDetails?: Partial<BankDetails>;
  sourceOfFunding?: Partial<SourceOfFunding>;
}
