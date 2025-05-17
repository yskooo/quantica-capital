
// This file will handle all API communications with the backend database

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Generic API request handler
async function apiRequest<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<ApiResponse<T>> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authorization token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
      credentials: 'include',
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`/api/${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'An error occurred');
    }

    return { data: result.data, error: null };
  } catch (error) {
    console.error('API request error:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// User related API calls
export const userService = {
  getProfile: () => apiRequest<UserProfile>('users/profile'),
  updateProfile: (data: Partial<UserProfile>) => apiRequest<UserProfile>('users/profile', 'PUT', data),
  updateSettings: (data: UserSettings) => apiRequest<UserSettings>('users/settings', 'PUT', data),
};

// Portfolio related API calls
export const portfolioService = {
  getHoldings: () => apiRequest<PortfolioHolding[]>('portfolio/holdings'),
  getPerformance: (timeframe: string) => apiRequest<PerformanceData>(`portfolio/performance?timeframe=${timeframe}`),
  addTransaction: (transaction: Transaction) => apiRequest<Transaction>('portfolio/transactions', 'POST', transaction),
};

// Trading related API calls
export const tradingService = {
  placeOrder: (order: OrderRequest) => apiRequest<Order>('trading/orders', 'POST', order),
  getOrders: (status?: 'open' | 'filled' | 'cancelled') => 
    apiRequest<Order[]>(`trading/orders${status ? `?status=${status}` : ''}`),
  cancelOrder: (orderId: string) => apiRequest<boolean>(`trading/orders/${orderId}/cancel`, 'PUT'),
  getWatchlist: () => apiRequest<WatchlistItem[]>('trading/watchlist'),
  addToWatchlist: (symbol: string) => apiRequest<WatchlistItem>('trading/watchlist', 'POST', { symbol }),
  removeFromWatchlist: (symbol: string) => apiRequest<boolean>(`trading/watchlist/${symbol}`, 'DELETE'),
};

// Wallet related API calls
export const walletService = {
  getBalance: () => apiRequest<WalletBalance>('wallet/balance'),
  getTransactions: () => apiRequest<WalletTransaction[]>('wallet/transactions'),
  deposit: (data: FundingRequest) => apiRequest<WalletTransaction>('wallet/deposit', 'POST', data),
  withdraw: (data: FundingRequest) => apiRequest<WalletTransaction>('wallet/withdraw', 'POST', data),
  getBankAccounts: () => apiRequest<BankAccount[]>('wallet/bank-accounts'),
  addBankAccount: (data: BankAccount) => apiRequest<BankAccount>('wallet/bank-accounts', 'POST', data),
};

// Type definitions for database models
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
