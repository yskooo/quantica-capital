
// Compliance and Support API endpoints and methods
import { apiRequest } from './core';
import { 
  DisputeRequest, 
  DisputeResponse, 
  AuditRequest, 
  AuditReport,
  SupportTicket
} from './types';

export const complianceService = {
  // Dispute resolution
  submitDispute: (dispute: DisputeRequest) => 
    apiRequest<DisputeResponse>('compliance/disputes', 'POST', dispute),
    
  getDisputeById: (disputeId: string) => 
    apiRequest<DisputeResponse>(`compliance/disputes/${disputeId}`),
    
  getAllDisputes: () => 
    apiRequest<DisputeResponse[]>('compliance/disputes'),
    
  updateDispute: (disputeId: string, updates: Partial<DisputeRequest>) => 
    apiRequest<DisputeResponse>(`compliance/disputes/${disputeId}`, 'PUT', updates),
    
  cancelDispute: (disputeId: string) => 
    apiRequest<{ success: boolean }>(`compliance/disputes/${disputeId}/cancel`, 'PUT'),
  
  // Compliance audits  
  requestAudit: (auditRequest: AuditRequest) => 
    apiRequest<{ auditId: string; estimatedCompletion: string }>('compliance/audits', 'POST', auditRequest),
    
  getAuditById: (auditId: string) => 
    apiRequest<AuditReport>(`compliance/audits/${auditId}`),
    
  getAllAudits: () => 
    apiRequest<AuditReport[]>('compliance/audits'),
    
  // Support tickets
  createSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => 
    apiRequest<SupportTicket>('support/tickets', 'POST', ticket),
    
  getSupportTicketById: (ticketId: string) => 
    apiRequest<SupportTicket>(`support/tickets/${ticketId}`),
    
  getAllSupportTickets: () => 
    apiRequest<SupportTicket[]>('support/tickets'),
    
  updateSupportTicket: (ticketId: string, updates: Partial<SupportTicket>) => 
    apiRequest<SupportTicket>(`support/tickets/${ticketId}`, 'PUT', updates),
    
  closeSupportTicket: (ticketId: string) => 
    apiRequest<{ success: boolean }>(`support/tickets/${ticketId}/close`, 'PUT')
};
