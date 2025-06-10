import { BASE_URL, fetchWithAuth, handleApiResponse } from './api';

// Types for authentication responses
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_new_user: boolean;
  google_data?: {
    name: string;
    picture: string;
  };
}

export interface UserRole {
  role: string;
  is_applicant: boolean;
  is_employer: boolean;
  is_admin: boolean;
}

// Exchange Google authorization code for tokens
export const exchangeGoogleAuthCode = async (code: string): Promise<AuthResponse> => {
  const response = await fetch(`${BASE_URL}/api/auth/google/callback/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code })
  });
  
  return handleApiResponse(response);
};

// Register a new user
export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'applicant' | 'employer';
}

export const registerUser = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await fetch(`${BASE_URL}/api/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  
  return handleApiResponse(response);
};

// Sign out
export const signOut = async (refreshToken: string): Promise<{success: string}> => {
  return fetchWithAuth('/api/auth/sign-out/', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken })
  });
};

// Get user role
export const getUserRole = async (): Promise<UserRole> => {
  return fetchWithAuth('/api/role/');
};

// Update user role
export const updateUserRole = async (role: 'applicant' | 'employer'): Promise<{message: string}> => {
  return fetchWithAuth('/api/role/', {
    method: 'POST',
    body: JSON.stringify({ role })
  });
};
