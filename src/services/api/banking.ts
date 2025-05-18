
// Banking API endpoints and methods
import { apiRequest } from './core';
import { BankVerificationResult, BankOption, BranchOption } from './types';
import { BankVerificationRequest } from './types';

export const bankingService = {
  verifyBankAccount: (accountDetails: BankVerificationRequest) => 
    apiRequest<BankVerificationResult>('banking/verify-account', 'POST', accountDetails),
    
  getBankOptions: () => apiRequest<BankOption[]>('banking/bank-options'),
  
  getBranchOptions: (bankId: string) => 
    apiRequest<BranchOption[]>(`banking/branch-options/${bankId}`, 'GET'),
};
