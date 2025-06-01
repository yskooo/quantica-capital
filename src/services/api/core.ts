
// Core API utilities for making requests to MySQL backend

const API_BASE_URL = 'http://localhost:3001/api';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  message?: string;
}

// Generic API request handler
export async function apiRequest<T>(
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

    console.log(`Making ${method} request to: ${API_BASE_URL}/${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API Response:', result);

    return { 
      data: result.data || result, 
      error: null, 
      message: result.message 
    };
  } catch (error) {
    console.error('API request error:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Authentication specific API calls
export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    apiRequest<any>('auth/login', 'POST', credentials),
    
  register: (registrationData: any) => 
    apiRequest<any>('auth/register', 'POST', registrationData),
    
  logout: () => {
    localStorage.removeItem('auth_token');
    return Promise.resolve({ data: null, error: null });
  }
};

// User profile specific API calls
export const userAPI = {
  getProfile: (accId: string) => 
    apiRequest<any>(`users/profile/${accId}`),
    
  updateProfile: (accId: string, profileData: any) => 
    apiRequest<any>(`users/profile/${accId}`, 'PUT', profileData),
    
  deleteProfile: (accId: string) => 
    apiRequest<any>(`users/profile/${accId}`, 'DELETE')
};
