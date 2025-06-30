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

// Get comprehensive user profile
export const getComprehensiveProfile = async (): Promise<{
  success: boolean;
  data: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    country: string;
    date_joined: string;
    profile_picture?: string;
    phone_number?: string;
    goal?: string;
    career_profile?: {
      industry: string;
      job_title: string;
      profile_summary: string;
    };
    education_profiles?: Array<{
      id: number;
      degree: string;
      school: string;
      start_date: string;
      end_date?: string;
      is_currently_studying: boolean;
      extra_curricular: string;
    }>;
    experience_profiles?: Array<{
      id: number;
      job_title: string;
      company_name: string;
      location: string;
      start_date: string;
      end_date?: string;
      is_currently_working: boolean;
      description: string;
    }>;
    project_profiles?: Array<{
      id: number;
      project_title: string;
      start_date: string;
      end_date?: string;
      is_currently_working: boolean;
      project_link: string;
      description: string;
    }>;
    opportunities_interest?: {
      scholarships: boolean;
      jobs: boolean;
      grants: boolean;
      internships: boolean;
    };
    recommendation_priority?: {
      academic_background: boolean;
      work_experience: boolean;
      preferred_locations: boolean;
      others: boolean;
      additional_preferences: string;
    };
    parsed_profile_data?: ParsedCVData;
    user_goals?: Array<{
      goal: string;
      goal_display: string;
      priority: number;
    }>;
  };
  user_goals?: Array<{
    goal: string;
    goal_display: string;
    priority: number;
  }>;
}> => {
  return fetchWithAuth('/api/profile/comprehensive/');
};

// Update personal information
export const updatePersonalInfo = async (data: {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country: string;
  goal: string;
}): Promise<{success: boolean}> => {
  return fetchWithAuth('/api/profile/personal/', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

// Career profile management
export const getCareerProfile = async (): Promise<any> => {
  return fetchWithAuth('/api/profile/career/');
};

export const updateCareerProfile = async (data: {
  industry: string;
  job_title: string;
  profile_summary: string;
}): Promise<{success: boolean}> => {
  return fetchWithAuth('/api/profile/career/', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

// Education management
export const createEducation = async (data: {
  degree: string;
  school: string;
  start_date: string;
  end_date?: string;
  is_currently_studying: boolean;
  extra_curricular: string;
}): Promise<{success: boolean; id: number}> => {
  return fetchWithAuth('/api/profile/education/', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const updateEducation = async (id: number, data: {
  degree: string;
  school: string;
  start_date: string;
  end_date?: string;
  is_currently_studying: boolean;
  extra_curricular: string;
}): Promise<{success: boolean}> => {
  return fetchWithAuth(`/api/profile/education/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
};

export const deleteEducation = async (id: number): Promise<{success: boolean}> => {
  return fetchWithAuth(`/api/profile/education/${id}/`, {
    method: 'DELETE'
  });
};

// Experience management
export const createExperience = async (data: {
  job_title: string;
  company_name: string;
  location: string;
  start_date: string;
  end_date?: string;
  is_currently_working: boolean;
  description: string;
}): Promise<{success: boolean; id: number}> => {
  return fetchWithAuth('/api/profile/experience/', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const updateExperience = async (id: number, data: {
  job_title: string;
  company_name: string;
  location: string;
  start_date: string;
  end_date?: string;
  is_currently_working: boolean;
  description: string;
}): Promise<{success: boolean}> => {
  return fetchWithAuth(`/api/profile/experience/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
};

export const deleteExperience = async (id: number): Promise<{success: boolean}> => {
  return fetchWithAuth(`/api/profile/experience/${id}/`, {
    method: 'DELETE'
  });
};

// Project management
export const createProject = async (data: {
  project_title: string;
  start_date: string;
  end_date?: string;
  is_currently_working: boolean;
  project_link: string;
  description: string;
}): Promise<{success: boolean; id: number}> => {
  return fetchWithAuth('/api/profile/project/', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const updateProject = async (id: number, data: {
  project_title: string;
  start_date: string;
  end_date?: string;
  is_currently_working: boolean;
  project_link: string;
  description: string;
}): Promise<{success: boolean}> => {
  return fetchWithAuth(`/api/profile/project/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
};

export const deleteProject = async (id: number): Promise<{success: boolean}> => {
  return fetchWithAuth(`/api/profile/project/${id}/`, {
    method: 'DELETE'
  });
};

// Opportunities interest management
export const updateOpportunitiesInterest = async (data: {
  scholarships: boolean;
  jobs: boolean;
  grants: boolean;
  internships: boolean;
}): Promise<{success: boolean}> => {
  return fetchWithAuth('/api/profile/opportunities-interest/', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

// Recommendation priority management
export const updateRecommendationPriority = async (data: {
  academic_background: boolean;
  work_experience: boolean;
  preferred_locations: boolean;
  others: boolean;
  additional_preferences: string;
}): Promise<{success: boolean}> => {
  return fetchWithAuth('/api/profile/recommendation-priority/', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};
