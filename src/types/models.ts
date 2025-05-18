
// User registration and account interfaces
export interface BankDetails {
  bankAccNo: string;
  bankAccName: string;
  bankAccDateOfOpening: string; // ISO date string
  bankName: string;
  branch: string;
}

export interface SourceOfFunding {
  fundingId?: string; // Generated on backend
  natureOfWork: string;
  businessNameOrEducInstitution: string;
  officeSchoolAddress: string;
  companySchoolNumber?: string;
  validId: 'Driver\'s License' | 'Passport' | 'SSS ID' | 'PhilHealth' | 'Other';
  sourceOfIncome: 'Salary' | 'Business' | 'Remittance' | 'Scholarship' | 'Allowance';
}

export interface ContactDetails {
  contactId?: string; // Generated on backend
  name: string;
  address: string;
  postalCode: string;
  email: string;
  contactNumber: string;
}

export interface ContactRole {
  role: 'Kin' | 'Referee 1' | 'Referee 2';
  relationship: 'Father' | 'Mother' | 'Sibling' | 'Spouse' | 'Daughter' | 'Son' | 'Friend' | 'Colleague' | 'Other';
  contactDetails: ContactDetails;
}

export interface PersonalData {
  accId?: string; // Generated on backend
  name: string;
  address: string;
  postalCode: string;
  cellNo: string;
  email: string;
  dateOfBirth: string; // ISO date string
  employmentStatus: 'Employed' | 'Unemployed' | 'Self-employed' | 'Student' | 'Retired';
  purposeOfOpening: 'Savings' | 'Investment' | 'Business' | 'Personal Use' | 'Others';
  fundingId?: string; // Linked to SourceOfFunding
  bankAccNo: string; // Linked to BankDetails
}

export interface RegistrationData {
  personalData: PersonalData;
  fundingSource: SourceOfFunding;
  bankDetails: BankDetails;
  contacts: ContactRole[];
  credentials: {
    email: string;
    password: string;
  }
}
