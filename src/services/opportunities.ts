import { fetchWithAuth, handleApiResponse, BASE_URL } from './api';

// Types for opportunities
export interface Category {
  name: string;
  slug: string;
}

export interface Tag {
  name: string;
  slug: string;
}

export interface Opportunity {
  id: number;
  title: string;
  organization: string;
  description: string;
  type: string;
  location: string;
  is_remote: boolean;
  deadline: string;
  category: Category;
  tags: Tag[];
  posted_by: string;
  created_at: string;
}

export interface OpportunitiesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Opportunity[];
}

export interface RecommendedOpportunity {
  opportunity: Opportunity;
  score: number;
  match_reasons: string[];
}

export interface RecommendedOpportunitiesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RecommendedOpportunity[];
}

// Params for filtering opportunities
export interface OpportunitiesParams {
  page?: number;
  page_size?: number;
  search?: string;
  type?: string;
  location?: string;
  is_remote?: boolean;
  category__slug?: string;
  tags__slug?: string;
  deadline?: string;
  show_expired?: boolean;
  ordering?: string;
}

// Convert params object to query string
const buildQueryString = (params: Record<string, any>): string => {
  const filteredParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');
  
  return filteredParams ? `?${filteredParams}` : '';
};

// Get list of opportunities
export const getOpportunities = async (params: OpportunitiesParams = {}): Promise<OpportunitiesResponse> => {
  const queryString = buildQueryString(params);
  const response = await fetch(`${BASE_URL}/api/opportunities/${queryString}`);
  return handleApiResponse(response);
};

// Get opportunity details
export const getOpportunityById = async (id: number): Promise<Opportunity> => {
  const response = await fetch(`${BASE_URL}/api/opportunities/${id}/`);
  return handleApiResponse(response);
};

// Get recommended opportunities (requires auth)
export const getRecommendedOpportunities = async (
  params: OpportunitiesParams = {}
): Promise<RecommendedOpportunitiesResponse> => {
  const queryString = buildQueryString(params);
  return fetchWithAuth(`/api/opportunities/recommended/${queryString}`);
};

// Track opportunity view
export const trackOpportunityView = async (id: number): Promise<{status: string, view_count: number}> => {
  const response = await fetch(`${BASE_URL}/api/opportunities/${id}/track_view/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return handleApiResponse(response);
};

// Track opportunity application (requires auth)
export const trackOpportunityApplication = async (id: number): Promise<{status: string, application_count: number}> => {
  return fetchWithAuth(`/api/opportunities/${id}/track_application/`, {
    method: 'POST'
  });
};
