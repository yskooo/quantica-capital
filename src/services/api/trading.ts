
// Trading API endpoints and methods
import { apiRequest } from './core';
import { Order, OrderRequest, WatchlistItem } from './types';

export const tradingService = {
  placeOrder: (order: OrderRequest) => 
    apiRequest<Order>('trading/orders', 'POST', order),
    
  getOrders: (status?: 'open' | 'filled' | 'cancelled') => 
    apiRequest<Order[]>(`trading/orders${status ? `?status=${status}` : ''}`),
    
  cancelOrder: (orderId: string) => 
    apiRequest<boolean>(`trading/orders/${orderId}/cancel`, 'PUT'),
    
  getWatchlist: () => apiRequest<WatchlistItem[]>('trading/watchlist'),
  
  addToWatchlist: (symbol: string) => 
    apiRequest<WatchlistItem>('trading/watchlist', 'POST', { symbol }),
    
  removeFromWatchlist: (symbol: string) => 
    apiRequest<boolean>(`trading/watchlist/${symbol}`, 'DELETE'),
};
