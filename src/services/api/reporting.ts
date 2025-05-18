
// Reporting API endpoints and methods
import { apiRequest } from './core';
import { TradeConfirmation, PnLStatement, ReportRequest } from './types';

export const reportingService = {
  // Trade confirmations
  getTradeConfirmations: (filters?: { startDate?: string; endDate?: string; symbol?: string }) => 
    apiRequest<TradeConfirmation[]>('reporting/trade-confirmations', 'GET', filters),
    
  getTradeConfirmationById: (confirmationId: string) => 
    apiRequest<TradeConfirmation>(`reporting/trade-confirmations/${confirmationId}`),
    
  downloadTradeConfirmation: (confirmationId: string, format: 'pdf' | 'csv' = 'pdf') => 
    apiRequest<{ downloadUrl: string }>(`reporting/trade-confirmations/${confirmationId}/download?format=${format}`),
  
  // PnL statements
  getPnLStatements: (filters?: { period?: string; year?: number; quarter?: number }) => 
    apiRequest<PnLStatement[]>('reporting/pnl-statements', 'GET', filters),
    
  getPnLStatementById: (statementId: string) => 
    apiRequest<PnLStatement>(`reporting/pnl-statements/${statementId}`),
    
  downloadPnLStatement: (statementId: string, format: 'pdf' | 'csv' = 'pdf') => 
    apiRequest<{ downloadUrl: string }>(`reporting/pnl-statements/${statementId}/download?format=${format}`),
    
  // Generate custom reports
  requestCustomReport: (reportRequest: ReportRequest) => 
    apiRequest<{ reportId: string; estimatedDelivery: string }>('reporting/custom', 'POST', reportRequest)
};
