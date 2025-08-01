import { BASE_URL, fetchWithAuth } from './api';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
  last_login: string;
  google_data?: {
    picture: string;
    email: string;
  };
}

export interface UserRole {
  role: string;
  permissions: string[];
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface SignupResponse {
  user: User;
  message: string;
}

// Helper function to handle API responses
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Exchange Google authorization code for tokens
export const exchangeGoogleAuthCode = async (code: string): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/auth/google/callback/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  return handleApiResponse(response);
};

// Login function
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  return handleApiResponse(response);
};

// Signup function
export const signup = async (userData: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}): Promise<SignupResponse> => {
  const response = await fetch(`${BASE_URL}/auth/signup/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  return handleApiResponse(response);
};

// Get user role
export const getUserRole = async (): Promise<UserRole> => {
  const response = await fetchWithAuth(`${BASE_URL}/auth/role/`);
  return handleApiResponse(response);
};

// Sign out function
export const signOut = async (refreshToken: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/auth/logout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    console.error('Logout failed:', response.status);
  }
};

// Update user by ID
export const updateUserById = async (userId: number, userData: Partial<User>): Promise<User> => {
  const response = await fetchWithAuth(`${BASE_URL}/users/${userId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  return handleApiResponse(response);
};

// Update user role by ID
export const updateUserRoleById = async (userId: number, role: string): Promise<User> => {
  const response = await fetchWithAuth(`${BASE_URL}/users/${userId}/role/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role }),
  });

  return handleApiResponse(response);
};

// Update user completion status
export const updateUserComplete = async (userId: number, isComplete: boolean): Promise<User> => {
  const response = await fetchWithAuth(`${BASE_URL}/users/${userId}/complete/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ is_complete: isComplete }),
  });

  return handleApiResponse(response);
};

