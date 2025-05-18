
// Portfolio API endpoints and methods
import { apiRequest } from './core';
import { PortfolioHolding, PerformanceData, Transaction } from './types';

export const portfolioService = {
  getHoldings: () => apiRequest<PortfolioHolding[]>('portfolio/holdings'),
  
  getPerformance: (timeframe: string) => 
    apiRequest<PerformanceData>(`portfolio/performance?timeframe=${timeframe}`),
    
  addTransaction: (transaction: Transaction) => 
    apiRequest<Transaction>('portfolio/transactions', 'POST', transaction),
};
