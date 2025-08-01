import { fetchWithAuth } from './api';

export interface ScholarshipFilters {
  search?: string;
  type?: string;
  location?: string;
  ordering?: string;
  show_expired?: boolean;
  page?: number;
  page_size?: number;
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

// Admin interface for creating/updating scholarships
export interface ScholarshipFormData {
  id?: number;
  title: string;
  source: string;
  location: string;
  amount?: string | null;
  deadline?: string | null;
  course?: string | null;
  gpa?: string | null;
  application_link?: string | null;
  overview?: string | null;
  scraped_at?: string;
}

const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 2,
  delay: number = 1000
): Promise<T> => {
  let lastError;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      if (i === maxRetries) break;

      if (error instanceof Error &&
        (error.message.includes('404') || error.message.includes('401'))
      ) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }

  throw lastError;
};

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
  return retryRequest(() => fetchWithAuth(endpoint));
};

// Get a specific scholarship by ID
export const getScholarship = async (id: string): Promise<ScholarshipDetail> => {
  return retryRequest(() => fetchWithAuth(`/api/scholarships/${id}/`));
};

// Admin Functions - Create new scholarship
export const createScholarship = async (data: ScholarshipFormData): Promise<Scholarship> => {
  return fetchWithAuth('/api/scholarships/', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

// Admin Functions - Update scholarship
export const updateScholarship = async (id: number, data: ScholarshipFormData): Promise<Scholarship> => {
  return fetchWithAuth(`/api/scholarships/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
};

// Admin Functions - Delete scholarship
export const deleteScholarship = async (id: number): Promise<void> => {
  return fetchWithAuth(`/api/scholarships/${id}/`, {
    method: 'DELETE'
  });
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
  return retryRequest(() => fetchWithAuth(endpoint));
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
  return retryRequest(() => fetchWithAuth('/api/scholarships/applications/'));
};

// Get matched scholarships
export const getMatchedScholarships = async (filters: ScholarshipFilters = {}): Promise<ScholarshipsResponse> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });
  const queryString = params.toString();
  const endpoint = `/api/scholarships/match/${queryString ? `?${queryString}` : ''}`;

  try {
    return await retryRequest(() => fetchWithAuth(endpoint));
  } catch (error: any) {
    console.log('Matched scholarships endpoint failed.', error);
    throw error;
  }
};
