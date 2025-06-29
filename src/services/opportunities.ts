import { fetchWithAuth } from './api';

export interface OpportunityFilters {
  search?: string;
  type?: string;
  location?: string;
  ordering?: string;
  show_expired?: boolean;
  page?: number;
  page_size?: number;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  salary_range: string;
  deadline: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  match_percentage?: number;
  application_url?: string;
  skills_required: string[];
  experience_level: string;
  employment_type: string;
}

export interface OpportunitiesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Opportunity[];
}

export interface OpportunityDetail extends Opportunity {
  full_description: string;
  company_details: {
    name: string;
    description: string;
    website: string;
    logo: string;
  };
  benefits: string[];
  application_process: string;
}

// Get opportunities with filters
export const getOpportunities = async (filters: OpportunityFilters = {}): Promise<OpportunitiesResponse> => {
  const params = new URLSearchParams();
  
  // Add filters to params
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });
  
  const queryString = params.toString();
  const endpoint = `/api/opportunities/${queryString ? `?${queryString}` : ''}`;
  
  return fetchWithAuth(endpoint);
};

// Get a specific opportunity by ID
export const getOpportunity = async (id: string): Promise<OpportunityDetail> => {
  return fetchWithAuth(`/api/opportunities/${id}/`);
};

// Apply to an opportunity
export const applyToOpportunity = async (opportunityId: string, applicationData?: any): Promise<{success: boolean; application_id: string}> => {
  return fetchWithAuth(`/api/opportunities/${opportunityId}/apply/`, {
    method: 'POST',
    body: JSON.stringify(applicationData || {})
  });
};

// Save/unsave an opportunity
export const toggleSaveOpportunity = async (opportunityId: string): Promise<{success: boolean; is_saved: boolean}> => {
  return fetchWithAuth(`/api/opportunities/${opportunityId}/save/`, {
    method: 'POST'
  });
};

// Get saved opportunities
export const getSavedOpportunities = async (filters: OpportunityFilters = {}): Promise<OpportunitiesResponse> => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });
  
  const queryString = params.toString();
  const endpoint = `/api/opportunities/saved/${queryString ? `?${queryString}` : ''}`;
  
  return fetchWithAuth(endpoint);
};

// Get application status for opportunities
export const getApplicationStatus = async (): Promise<{
  total_applications: number;
  pending: number;
  reviewed: number;
  accepted: number;
  rejected: number;
  applications: Array<{
    id: string;
    opportunity: Opportunity;
    status: string;
    applied_at: string;
    last_updated: string;
  }>;
}> => {
  return fetchWithAuth('/api/opportunities/applications/');
};

// Get AI-matched opportunities
export const getAIMatches = async (filters: OpportunityFilters = {}): Promise<OpportunitiesResponse> => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, value.toString());
    }
  });
  
  const queryString = params.toString();
  const endpoint = `/api/opportunities/ai-matches/${queryString ? `?${queryString}` : ''}`;
  
  return fetchWithAuth(endpoint);
};
