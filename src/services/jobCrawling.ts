import { fetchWithAuth } from './api';

export interface JobCrawlingFilters {
  keyword?: string;
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  salary?: string;
  datePosted?: string;
  remoteFilter?: string;
  limit?: number;
}

export interface CrawledJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  jobUrl: string;
  datePosted: string;
  source: string;
  companyLogo?: string;
  postedAgo: string;
  jobType?: string;
  experienceLevel?: string;
  skills?: string[];
  benefits?: string[];
  requirements?: string[];
}

export interface CrawlingResult {
  success: boolean;
  jobs: CrawledJob[];
  count: number;
  error?: string;
  sources?: string[];
  metadata?: {
    totalFound: number;
    processingTime: number;
    lastUpdated: string;
  };
}

export interface CrawlingStats {
  total: number;
  success: number;
  failed: number;
  lastRun: string;
  sources: {
    [key: string]: {
      jobs: number;
      success: boolean;
      lastRun: string;
    };
  };
}

/**
 * Crawl jobs from multiple sources
 */
export const crawlJobs = async (filters: JobCrawlingFilters = {}): Promise<CrawlingResult> => {
  try {
    const response = await fetchWithAuth('/api/opportunities/scrape-jobs/', {
      method: 'POST',
      body: JSON.stringify({
        keyword: filters.keyword || '',
        location: filters.location || '',
        job_type: filters.jobType || '',
        experience_level: filters.experienceLevel || '',
        salary: filters.salary || '',
        date_posted: filters.datePosted || '',
        remote_filter: filters.remoteFilter || '',
        limit: filters.limit || 50
      })
    });

    return {
      success: true,
      jobs: response.jobs || [],
      count: response.jobs?.length || 0,
      sources: response.sources || [],
      metadata: response.metadata
    };
  } catch (error) {
    console.error('Job crawling error:', error);
    return {
      success: false,
      jobs: [],
      count: 0,
      error: error instanceof Error ? error.message : 'Failed to crawl jobs'
    };
  }
};

/**
 * Get crawling statistics
 */
export const getCrawlingStats = async (): Promise<CrawlingStats> => {
  try {
    const response = await fetchWithAuth('/api/opportunities/crawl-stats/');
    return response;
  } catch (error) {
    console.error('Error fetching crawling stats:', error);
    return {
      total: 0,
      success: 0,
      failed: 0,
      lastRun: new Date().toISOString(),
      sources: {}
    };
  }
};

/**
 * Crawl jobs from a specific source
 */
export const crawlJobsFromSource = async (
  source: string,
  filters: JobCrawlingFilters = {}
): Promise<CrawlingResult> => {
  try {
    const response = await fetchWithAuth(`/api/opportunities/scrape-jobs/${source}/`, {
      method: 'POST',
      body: JSON.stringify(filters)
    });

    return {
      success: true,
      jobs: response.jobs || [],
      count: response.jobs?.length || 0,
      sources: [source],
      metadata: response.metadata
    };
  } catch (error) {
    console.error(`Error crawling jobs from ${source}:`, error);
    return {
      success: false,
      jobs: [],
      count: 0,
      error: error instanceof Error ? error.message : `Failed to crawl jobs from ${source}`,
      sources: [source]
    };
  }
};

/**
 * Get available job sources
 */
export const getJobSources = async (): Promise<string[]> => {
  try {
    const response = await fetchWithAuth('/api/opportunities/sources/');
    return response.sources || [];
  } catch (error) {
    console.error('Error fetching job sources:', error);
    return [];
  }
};

/**
 * Save crawled jobs to backend
 */
export const saveCrawledJobs = async (jobs: CrawledJob[]): Promise<{ success: boolean; saved: number }> => {
  try {
    const response = await fetchWithAuth('/api/opportunities/bulk-create/', {
      method: 'POST',
      body: JSON.stringify({ jobs })
    });

    return {
      success: true,
      saved: response.saved_count || 0
    };
  } catch (error) {
    console.error('Error saving crawled jobs:', error);
    return {
      success: false,
      saved: 0
    };
  }
};

/**
 * Get cached crawled jobs from localStorage
 */
export const getCachedCrawledJobs = (): CrawledJob[] => {
  try {
    const cached = localStorage.getItem('crawledJobs');
    if (cached) {
      const { jobs, timestamp } = JSON.parse(cached);
      // Check if cache is less than 1 hour old
      if (Date.now() - timestamp < 60 * 60 * 1000) {
        return jobs;
      }
    }
  } catch (error) {
    console.error('Error reading cached jobs:', error);
  }
  return [];
};

/**
 * Cache crawled jobs to localStorage
 */
export const cacheCrawledJobs = (jobs: CrawledJob[]): void => {
  try {
    localStorage.setItem('crawledJobs', JSON.stringify({
      jobs,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Error caching jobs:', error);
  }
};

/**
 * Clear cached crawled jobs
 */
export const clearCachedJobs = (): void => {
  try {
    localStorage.removeItem('crawledJobs');
  } catch (error) {
    console.error('Error clearing cached jobs:', error);
  }
};

/**
 * Transform crawled job data to standard format
 */
export const transformCrawledJob = (rawJob: any): CrawledJob => {
  return {
    id: rawJob.id || rawJob.job_id || `crawled_${Date.now()}_${Math.random()}`,
    title: rawJob.title || rawJob.position || rawJob.job_title || '',
    company: rawJob.company || rawJob.company_name || '',
    location: rawJob.location || rawJob.job_location || '',
    description: rawJob.description || rawJob.job_description || '',
    salary: rawJob.salary || rawJob.salary_range || '',
    jobUrl: rawJob.jobUrl || rawJob.url || rawJob.application_url || '',
    datePosted: rawJob.datePosted || rawJob.date_posted || rawJob.posted_date || '',
    source: rawJob.source || rawJob.platform || 'unknown',
    companyLogo: rawJob.companyLogo || rawJob.company_logo || '',
    postedAgo: rawJob.postedAgo || rawJob.posted_ago || '',
    jobType: rawJob.jobType || rawJob.employment_type || '',
    experienceLevel: rawJob.experienceLevel || rawJob.experience_level || '',
    skills: rawJob.skills || rawJob.required_skills || [],
    benefits: rawJob.benefits || rawJob.job_benefits || [],
    requirements: rawJob.requirements || rawJob.job_requirements || []
  };
};

/**
 * Filter and sort crawled jobs
 */
export const filterAndSortJobs = (
  jobs: CrawledJob[],
  filters: {
    keyword?: string;
    location?: string;
    jobType?: string;
    experienceLevel?: string;
    salary?: string;
    sortBy?: 'date' | 'relevance' | 'salary';
  } = {}
): CrawledJob[] => {
  let filteredJobs = [...jobs];

  // Filter by keyword
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase();
    filteredJobs = filteredJobs.filter(job =>
      job.title.toLowerCase().includes(keyword) ||
      job.description.toLowerCase().includes(keyword) ||
      job.company.toLowerCase().includes(keyword) ||
      job.skills?.some(skill => skill.toLowerCase().includes(keyword))
    );
  }

  // Filter by location
  if (filters.location) {
    const location = filters.location.toLowerCase();
    filteredJobs = filteredJobs.filter(job =>
      job.location.toLowerCase().includes(location)
    );
  }

  // Filter by job type
  if (filters.jobType) {
    filteredJobs = filteredJobs.filter(job =>
      job.jobType?.toLowerCase().includes(filters.jobType!.toLowerCase())
    );
  }

  // Filter by experience level
  if (filters.experienceLevel) {
    filteredJobs = filteredJobs.filter(job =>
      job.experienceLevel?.toLowerCase().includes(filters.experienceLevel!.toLowerCase())
    );
  }

  // Sort jobs
  switch (filters.sortBy) {
    case 'date':
      filteredJobs.sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime());
      break;
    case 'salary':
      filteredJobs.sort((a, b) => {
        const salaryA = extractSalaryValue(a.salary || '');
        const salaryB = extractSalaryValue(b.salary || '');
        return salaryB - salaryA;
      });
      break;
    case 'relevance':
    default:
      // Keep original order (most relevant first from API)
      break;
  }

  return filteredJobs;
};

/**
 * Extract numeric salary value for sorting
 */
const extractSalaryValue = (salary: string): number => {
  const numbers = salary.match(/\d+/g);
  if (numbers && numbers.length > 0) {
    return parseInt(numbers[0], 10);
  }
  return 0;
};

/**
 * Get job crawling status
 */
export const getCrawlingStatus = async (): Promise<{
  isRunning: boolean;
  progress?: number;
  currentSource?: string;
}> => {
  try {
    const response = await fetchWithAuth('/api/opportunities/crawling-status/');
    return response;
  } catch (error) {
    console.error('Error fetching crawling status:', error);
    return { isRunning: false };
  }
};

/**
 * Stop ongoing job crawling
 */
export const stopJobCrawling = async (): Promise<{ success: boolean }> => {
  try {
    await fetchWithAuth('/api/opportunities/stop-crawling/', {
      method: 'POST'
    });
    return { success: true };
  } catch (error) {
    console.error('Error stopping job crawling:', error);
    return { success: false };
  }
};

