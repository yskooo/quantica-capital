
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
