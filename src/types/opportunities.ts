export interface Opportunity {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  experience_level: 'entry' | 'mid' | 'senior' | 'executive';
  education_level: 'high_school' | 'bachelor' | 'master' | 'phd' | 'other';
  skills: string[];
  benefits: string[];
  application_url: string;
  deadline?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  match_percentage?: number;
  saved?: boolean;
  applied?: boolean;
  posted_by?: number;
  tags?: string[];
  remote_work?: boolean;
  relocation_assistance?: boolean;
  visa_sponsorship?: boolean;
}

export interface OpportunityFilters {
  search?: string;
  location?: string;
  job_type?: string;
  experience_level?: string;
  education_level?: string;
  skills?: string[];
  salary_min?: number;
  salary_max?: number;
  remote_work?: boolean;
  saved?: boolean;
  applied?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
  show_expired?: boolean;
}

export interface OpportunityResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Opportunity[];
}

export interface OpportunityApplication {
  id: number;
  opportunity: number;
  user: number;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'withdrawn';
  applied_at: string;
  updated_at: string;
  cover_letter?: string;
  resume_url?: string;
  notes?: string;
}

export interface OpportunityMatch {
  opportunity: Opportunity;
  match_percentage: number;
  matching_skills: string[];
  missing_skills: string[];
  recommendations: string[];
}
