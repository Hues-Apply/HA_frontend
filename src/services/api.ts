// Base API services and constants for HuesApply

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend.huesapply.com';

// Helper to handle API responses consistently
export const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    // Handle different error status codes
    if (response.status === 401) {
      // Clear tokens and redirect to login on auth failures
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('user');
      throw new Error('Authentication expired. Please log in again.');
    }

    // Try to parse error response
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || `API error: ${response.status}`);
    } catch (e) {
      // If parsing fails, throw generic error with status
      throw new Error(`API error: ${response.status}`);
    }
  }

  return response.json();
};

// Helper to get auth header for authenticated requests
export const getAuthHeader = (): Record<string, string> => {
  const token = sessionStorage.getItem('accessToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Basic fetch wrapper with auth headers
export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers as Record<string, string>)
  };

  const response = await fetch(url, {
    ...options,
    headers
  });
  return handleApiResponse(response);
};
