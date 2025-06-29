import { BASE_URL, fetchWithAuth } from './api';

// Types for document upload and parsing
export interface DocumentUploadResponse {
  success: boolean;
  document_id: string;
  parsed_data: ParsedCVData;
}

export interface ParsedCVData {
  personal_info: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    linkedin?: string;
    portfolio?: string;
  };
  summary?: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: string[];
  certifications: CertificationEntry[];
  languages: LanguageEntry[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  gpa?: string;
  description?: string;
}

export interface ExperienceEntry {
  company: string;
  position: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
  achievements?: string[];
}

export interface CertificationEntry {
  name: string;
  issuer: string;
  issue_date?: string;
  expiry_date?: string;
  credential_id?: string;
}

export interface LanguageEntry {
  language: string;
  proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Native';
}

// Upload CV/Resume document
export const uploadDocument = async (file: File): Promise<DocumentUploadResponse> => {
  const formData = new FormData();
  formData.append('document', file);
  
  const response = await fetch(`${BASE_URL}/api/profile/upload-document/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: formData
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Document upload failed');
  }
  
  return response.json();
};

// Update parsed profile data
export const updateParsedProfile = async (profileData: ParsedCVData): Promise<{success: boolean}> => {
  return fetchWithAuth('/api/profile/update-parsed/', {
    method: 'POST',
    body: JSON.stringify(profileData)
  });
};

// Get user's profile completion status
export const getProfileCompletionStatus = async (): Promise<{
  completion_percentage: number;
  missing_sections: string[];
  completed_sections: string[];
}> => {
  return fetchWithAuth('/api/profile/completion-status/');
};

// Update user's selected goals
export const updateUserGoals = async (goals: string[]): Promise<{success: boolean}> => {
  return fetchWithAuth('/api/profile/update-goals/', {
    method: 'POST',
    body: JSON.stringify({ goals })
  });
};
