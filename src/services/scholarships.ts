import { fetchWithAuth } from './api';

export interface ScholarshipFilters {
  search?: string;
  type?: string;
  location?: string;
  ordering?: string;
  show_expired?: boolean;
  page?: number;
  page_size?: number;
  source?: string;
  exclude?: string | number;
}

export interface Scholarship {
  id: string | number;
  title: string;
  application_link?: string;
  source: string;
  amount?: string;
  deadline?: string;
  course?: string;
  gpa?: string;
  location: string;
  scraped_at?: string;
  overview?: string;
}

export interface ScholarshipsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Scholarship[];
}

export interface ScholarshipDetail extends Scholarship {
  full_description: string;
  provider_details: {
    name: string;
    description: string;
    website: string;
    logo: string;
  };
  benefits: string[];
  application_process: string;
  overview?: string;
}

// Get scholarships with filters
export const getScholarships = async (filters: ScholarshipFilters = {}): Promise<ScholarshipsResponse> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });
  const queryString = params.toString();
  const endpoint = `/api/scholarships/${queryString ? `?${queryString}` : ''}`;
  return fetchWithAuth(endpoint);
};

// Get a specific scholarship by ID
export const getScholarship = async (id: string): Promise<ScholarshipDetail> => {
  return fetchWithAuth(`/api/scholarships/${id}/`);
};

// Apply to a scholarship
export const applyToScholarship = async (scholarshipId: string, applicationData?: any): Promise<{ success: boolean; application_id: string }> => {
  return fetchWithAuth(`/api/scholarships/${scholarshipId}/apply/`, {
    method: 'POST',
    body: JSON.stringify(applicationData || {})
  });
};

// Save/unsave a scholarship
export const toggleSaveScholarship = async (scholarshipId: string): Promise<{ success: boolean; is_saved: boolean }> => {
  return fetchWithAuth(`/api/scholarships/${scholarshipId}/save/`, {
    method: 'POST'
  });
};

// Get saved scholarships
export const getSavedScholarships = async (filters: ScholarshipFilters = {}): Promise<ScholarshipsResponse> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });
  const queryString = params.toString();
  const endpoint = `/api/scholarships/saved/${queryString ? `?${queryString}` : ''}`;
  return fetchWithAuth(endpoint);
};

// Get application status for scholarships
export const getScholarshipApplicationStatus = async (): Promise<{
  total_applications: number;
  pending: number;
  reviewed: number;
  accepted: number;
  rejected: number;
  applications: Array<{
    id: string;
    scholarship: Scholarship;
    status: string;
    applied_at: string;
    last_updated: string;
  }>;
}> => {
  return fetchWithAuth('/api/scholarships/applications/');
};

// Get AI-matched scholarships
export const getAIMatchedScholarships = async (filters: ScholarshipFilters = {}): Promise<ScholarshipsResponse> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });
  const queryString = params.toString();
  const endpoint = `/api/scholarships/ai-matches/${queryString ? `?${queryString}` : ''}`;
  return fetchWithAuth(endpoint);
};
