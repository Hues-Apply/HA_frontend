// Base API services and constants for HuesApply

export const BASE_URL = 'https://ha-backend-pq2f.vercel.app'; 

  console.log('BASE_URL:', BASE_URL);

// Helper to handle API responses consistently
export const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    // Handle different error status codes
    if (response.status === 401) {
      // Clear tokens and redirect to login on auth failures
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Authentication expired. Please log in again.');
    }
    
    // Try to parse error response
    try {
      const errorData = await response.json();
      throw errorData;
    } catch (e) {
      // If parsing fails, throw generic error with status
      throw new Error(`API error: ${response.status}`);
    }
  }
  
  return response.json();
};

// Helper to get auth header for authenticated requests
export const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Basic fetch wrapper with auth headers
export const fetchWithAuth = (endpoint: string, options: RequestInit = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(getAuthHeader() as Record<string, string>),
    ...(options.headers as Record<string, string>)
  };
  
  return fetch(url, {
    ...options,
    headers
  }).then(handleApiResponse);
};
