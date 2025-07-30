import { fetchWithAuth } from './api';

export interface JobFilters {
  search?: string;
  location?: string;
  job_type?: string;
  experience_level?: string;
  skills?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  experience_level: string;
  skills: string;
  description: string;
  salary_range?: string;
  posted_at: string;
  updated_at: string;
  is_active: boolean;
  application_url?: string;
}

export interface JobsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Job[];
}

export interface JobDetail extends Job {
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

export interface JobFormData {
  id?: number;
  title: string;
  company: string;
  location: string;
  job_type: string;
  experience_level: string;
  skills: string;
  description: string;
  salary_range?: string | null;
  application_url?: string | null;
  is_active: boolean;
}

const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 2,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error: any) {
      lastError = error;

      if (attempt === maxRetries) {
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)));
    }
  }

  throw lastError;
};

export const getJobs = async (filters: JobFilters = {}): Promise<JobsResponse> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });

  const response = await retryRequest(() =>
    fetchWithAuth(`/api/jobs/?${params.toString()}`)
  );

  return response;
};

export const getJob = async (id: string): Promise<JobDetail> => {
  const response = await retryRequest(() =>
    fetchWithAuth(`/api/jobs/${id}/`)
  );

  return response;
};

export const createJob = async (data: JobFormData): Promise<Job> => {
  const response = await retryRequest(() =>
    fetchWithAuth('/api/jobs/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  );

  return response;
};

export const updateJob = async (id: number, data: JobFormData): Promise<Job> => {
  const response = await retryRequest(() =>
    fetchWithAuth(`/api/jobs/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  );

  return response;
};

export const deleteJob = async (id: number): Promise<void> => {
  await retryRequest(() =>
    fetchWithAuth(`/api/jobs/${id}/`, {
      method: 'DELETE',
    })
  );
};

export const applyToJob = async (jobId: string, applicationData?: any): Promise<{ success: boolean; application_id: string }> => {
  const response = await retryRequest(() =>
    fetchWithAuth(`/api/jobs/${jobId}/apply/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData || {}),
    })
  );

  return response;
};

export const toggleSaveJob = async (jobId: string): Promise<{ success: boolean; is_saved: boolean }> => {
  const response = await retryRequest(() =>
    fetchWithAuth(`/api/jobs/${jobId}/save/`, {
      method: 'POST',
    })
  );

  return response;
};

export const getSavedJobs = async (filters: JobFilters = {}): Promise<JobsResponse> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });

  const response = await retryRequest(() =>
    fetchWithAuth(`/api/jobs/saved/?${params.toString()}`)
  );

  return response;
};

export const getJobApplicationStatus = async (): Promise<{
  total_applications: number;
  pending: number;
  reviewed: number;
  accepted: number;
  rejected: number;
  applications: Array<{
    id: string;
    job: Job;
    status: string;
    applied_at: string;
    last_updated: string;
  }>;
}> => {
  const response = await retryRequest(() =>
    fetchWithAuth('/api/jobs/applications/')
  );

  return response;
};

export const getAIMatchedJobs = async (filters: JobFilters = {}): Promise<JobsResponse> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });

  const response = await retryRequest(() =>
    fetchWithAuth(`/api/jobs/ai-matches/?${params.toString()}`)
  );

  return response;
};
