import { BASE_URL, fetchWithAuth, handleApiResponse, getAuthHeader } from './api';
import { deleteEducation } from './profile';

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


// Get user profile
export const getUserProfile = async (): Promise<User> => {
  const response = await fetchWithAuth('/api/profile/');
  return handleApiResponse(response);
}

// Update user profile
export const updateUserProfile = async (profileData : Partial<User> ) : Promise<User> => {
  const response = await fetchWithAuth('/api/profile/', {
    method: 'PUT',
    headers: {
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify(profileData)
  });
  return handleApiResponse(response);
};

// Get user by ID
export const getUserById = async (userId : number) : Promise<User> => {
  const response = await fetchWithAuth(`/api/users/${userId}/`);
  return handleApiResponse(response);
};

// Get all Users
export const getAllUsers = async (): Promise<User[]> => {
  const response = await fetchWithAuth('/api/users/');
  return handleApiResponse(response);
}

// Update user by ID
export const updateUserById = async (userId: number, userData : Partial<User>): Promise<User> => {
  const response = await fetchWithAuth(`/api/users/${userId}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  });
  
  return handleApiResponse(response);
};

// Delete user by ID
export const deleteUserById = async (user: User): Promise<{message: string}> => {

  const response = await fetchWithAuth(`/api/users/${user.id}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const result = await handleApiResponse(response);

  if(user.role === 'applicant') {
    await deleteEducation(user.id);
  }

  return result;
};

// Get user authentication header
export const getUserAuthHeader = async (): Promise<{ Authorization: string } | { Authorization?: undefined }> => {
  return getAuthHeader();
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const response = await fetchWithAuth('/api/auth/check-auth/');
    return response.ok;
  } catch (error) {
    console.error('Error checking auth: ', error);
    return false;
  }
};

// Get user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const response = await fetchWithAuth(`/api/users/email/${email}/`);

  if(response.ok) {
    return handleApiResponse(response);
  } else if(response.status === 404) {
    return null;
  } else {
    throw new Error(`Error fetching user by email: ${response.statusText}`);
  }
};

