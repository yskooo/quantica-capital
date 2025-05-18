
// Common API response and data types

export interface AuthResponse {
  user: UserProfile;
  token: string;
  expiresAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  dateOfBirth?: string;
  profilePicture?: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  currency: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    priceAlerts: boolean;
    tradeConfirmations: boolean;
    accountUpdates: boolean;
    marketNews: boolean;
    promotions: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number | 'never';
    biometricEnabled: boolean;
  };
}

export interface PortfolioHolding {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  returnPct: number;
  returnAmt: number;
}

export interface PerformanceData {
  timeframe: string;
  data: { date: string; value: number }[];
  startValue: number;
  endValue: number;
  changePct: number;
  changeAmt: number;
}

export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAWAL' | 'DIVIDEND';
  symbol?: string;
  quantity?: number;
  price?: number;
  amount: number;
  date: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
}

export interface OrderRequest {
  symbol: string;
  type: 'MARKET' | 'LIMIT';
  side: 'BUY' | 'SELL';
  quantity: number;
  price?: number;
  timeInForce?: 'DAY' | 'GTC' | 'IOC';
}

export interface Order extends OrderRequest {
  id: string;
  status: 'OPEN' | 'FILLED' | 'PARTIALLY_FILLED' | 'CANCELLED' | 'REJECTED';
  filledQuantity: number;
  filledPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
}

export interface WalletBalance {
  available: number;
  pending: number;
  total: number;
}

export interface WalletTransaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRADE' | 'FEE' | 'INTEREST';
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  date: string;
  description?: string;
  bankAccountId?: string;
}

export interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  type: 'Checking' | 'Savings';
  isDefault?: boolean;
}

export interface FundingRequest {
  amount: number;
  bankAccountId: string;
  description?: string;
}

export interface ApplicationStatus {
  id: string;
  status: 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED' | 'ADDITIONAL_INFO_REQUIRED';
  submittedAt: string;
  updatedAt: string;
  notes?: string;
  requiredDocuments?: string[];
}

export interface BankVerificationRequest {
  accountNumber: string;
  routingNumber?: string;
  accountHolderName: string;
  bankName: string;
}

export interface BankVerificationResult {
  verified: boolean;
  message?: string;
  verificationId?: string;
}

export interface BankOption {
  id: string;
  name: string;
  code: string;
}

export interface BranchOption {
  id: string;
  name: string;
  address: string;
  code: string;
}

// Trade confirmation types
export interface TradeConfirmation {
  id: string;
  tradeId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  fees: number;
  total: number;
  executionTime: string;
  settlementDate: string;
  status: 'PENDING' | 'SETTLED' | 'FAILED';
  broker: string;
  accountId: string;
  downloadUrl?: string;
}

// PnL statement types
export interface PnLStatement {
  id: string;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  startDate: string;
  endDate: string;
  totalPnL: number;
  realizedPnL: number;
  unrealizedPnL: number;
  trades: number;
  fees: number;
  tax: number;
  generatedAt: string;
  status: 'GENERATED' | 'PENDING' | 'PROCESSING';
  downloadUrl?: string;
}

// Custom report request
export interface ReportRequest {
  type: 'TRANSACTION_HISTORY' | 'PERFORMANCE_ANALYSIS' | 'TAX_REPORT' | 'PORTFOLIO_VALUATION';
  startDate: string;
  endDate: string;
  format: 'PDF' | 'CSV' | 'EXCEL';
  includeDetails: boolean;
  symbols?: string[];
  customNotes?: string;
}

// Dispute resolution types
export interface DisputeRequest {
  type: 'TRADE_ERROR' | 'FEE_DISPUTE' | 'UNAUTHORIZED_TRANSACTION' | 'SYSTEM_ERROR' | 'OTHER';
  relatedId?: string;
  description: string;
  requestedResolution: string;
  attachments?: string[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface DisputeResponse extends DisputeRequest {
  id: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED' | 'MORE_INFO_NEEDED';
  submittedAt: string;
  updatedAt: string;
  resolutionDetails?: string;
  assignedTo?: string;
  expectedResolutionDate?: string;
  comments?: DisputeComment[];
}

export interface DisputeComment {
  id: string;
  disputeId: string;
  authorId: string;
  authorType: 'CLIENT' | 'SUPPORT' | 'COMPLIANCE';
  content: string;
  timestamp: string;
  attachments?: string[];
}

// Compliance audit types
export interface AuditRequest {
  startDate: string;
  endDate: string;
  type: 'ACCOUNT_ACTIVITY' | 'TRADING_PATTERN' | 'TAX_COMPLIANCE' | 'KYC_VERIFICATION';
  description?: string;
}

export interface AuditReport {
  id: string;
  requestId: string;
  status: 'REQUESTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  requestedAt: string;
  completedAt?: string;
  findings?: string;
  recommendations?: string;
  compliance: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'PENDING';
  auditor?: string;
  attachments?: string[];
  downloadUrl?: string;
}

// Support ticket types
export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: 'ACCOUNT' | 'TRADING' | 'TECHNICAL' | 'BILLING' | 'GENERAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_ON_CLIENT' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  attachments?: string[];
  responses?: SupportResponse[];
}

export interface SupportResponse {
  id: string;
  ticketId: string;
  authorId: string;
  authorType: 'CLIENT' | 'SUPPORT';
  content: string;
  timestamp: string;
  attachments?: string[];
}
