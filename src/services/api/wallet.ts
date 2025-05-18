
// Wallet API endpoints and methods
import { apiRequest } from './core';
import { WalletBalance, WalletTransaction, BankAccount, FundingRequest } from './types';

export const walletService = {
  getBalance: () => apiRequest<WalletBalance>('wallet/balance'),
  
  getTransactions: () => apiRequest<WalletTransaction[]>('wallet/transactions'),
  
  deposit: (data: FundingRequest) => 
    apiRequest<WalletTransaction>('wallet/deposit', 'POST', data),
    
  withdraw: (data: FundingRequest) => 
    apiRequest<WalletTransaction>('wallet/withdraw', 'POST', data),
    
  getBankAccounts: () => apiRequest<BankAccount[]>('wallet/bank-accounts'),
  
  addBankAccount: (data: BankAccount) => 
    apiRequest<BankAccount>('wallet/bank-accounts', 'POST', data),
};
