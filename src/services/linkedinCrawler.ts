
import { fetchWithAuth } from './api';

// Interface based on exact npm package documentation
interface LinkedInJobQuery {
  keyword?: string;        // The text to search: (i.e. Software Developer)
  location?: string;       // The name of the city: (i.e. Los Angeles)
  dateSincePosted?: 'past month' | 'past week' | '24hr'; // Max range of jobs: past month, past week, 24hr
  jobType?: 'full time' | 'part time' | 'contract' | 'temporary' | 'volunteer' | 'internship'; // Type of position
  remoteFilter?: 'on site' | 'remote' | 'hybrid';   // Filter telecommuting: on site, remote, hybrid
  salary?: '40000' | '60000' | '80000' | '100000' | '120000'; // Minimum Salary
  experienceLevel?: 'internship' | 'entry level' | 'associate' | 'senior' | 'director' | 'executive'; // Experience level
  limit?: string;          // Number of jobs returned: (i.e. '1', '10', '100', etc)
  sortBy?: 'recent' | 'relevant'; // recent, relevant
  page?: string;           // 0, 1, 2 ....
}

// Job object structure from npm package documentation
interface LinkedInJob {
  position: string;        // Position title
  company: string;         // Company name
  companyLogo: string;     // Company Logo
  location: string;        // Location of the job
  date: string;           // Date the job was posted
  agoTime: string;        // time since it was posted
  salary: string;         // Salary range
  jobUrl: string;         // URL of the job page
}

interface CrawlFilters {
  location: string;
  keyword: string;
  jobType: string;
  experienceLevel: string;
  salary: string;
  datePosted: string;
}

export class LinkedInJobCrawler {
  private static STORAGE_KEY = 'linkedin_crawled_jobs';

  // Method to save jobs to localStorage for preview
  private static saveJobsToLocalStorage(jobs: any[], timestamp: string) {
    const crawlData = {
      jobs,
      timestamp,
      source: 'linkedin',
      edited: false
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(crawlData));
  }

  // Method to get jobs from localStorage
  public static getJobsFromLocalStorage() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get jobs from localStorage:', error);
      return null;
    }
  }

  // Method to update jobs in localStorage (after editing)
  public static updateJobsInLocalStorage(jobs: any[]) {
    try {
      const existingData = this.getJobsFromLocalStorage();
      if (existingData) {
        const updatedData = {
          ...existingData,
          jobs,
          edited: true
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update jobs in localStorage:', error);
      return false;
    }
  }

  // Method to clear jobs from localStorage
  public static clearJobsFromLocalStorage() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
  private static mapJobType(jobType: string): 'full time' | 'part time' | 'contract' | 'temporary' | 'volunteer' | 'internship' | '' {
    // Exact values from API documentation: full time, part time, contract, temporary, volunteer, internship
    const mapping: Record<string, 'full time' | 'part time' | 'contract' | 'temporary' | 'volunteer' | 'internship'> = {
      'full-time': 'full time',
      'part-time': 'part time',
      'contract': 'contract',
      'temporary': 'temporary',
      'volunteer': 'volunteer',
      'internship': 'internship'
    };
    return mapping[jobType] || '';
  }

  private static mapExperienceLevel(level: string): 'internship' | 'entry level' | 'associate' | 'senior' | 'director' | 'executive' | '' {
    // Exact values from API documentation: internship, entry level, associate, senior, director, executive
    const mapping: Record<string, 'internship' | 'entry level' | 'associate' | 'senior' | 'director' | 'executive'> = {
      'entry': 'entry level',
      'mid': 'associate',
      'senior': 'senior',
      'director': 'director',
      'executive': 'executive',
      'internship': 'internship'
    };
    return mapping[level] || '';
  }

  private static mapDatePosted(date: string): 'past month' | 'past week' | '24hr' | '' {
    // Exact values from API documentation: past month, past week, 24hr
    const mapping: Record<string, 'past month' | 'past week' | '24hr'> = {
      '24h': '24hr',
      'week': 'past week',
      'month': 'past month'
    };
    return mapping[date] || '';
  }

  private static mapSalary(salary: string): '40000' | '60000' | '80000' | '100000' | '120000' | '' {
    // Exact values from API documentation: 40000, 60000, 80000, 100000, 120000
    if (!salary || salary === '') return '';
    
    const salaryNum = parseInt(salary);
    const supportedSalaries = [40000, 60000, 80000, 100000, 120000] as const;
    
    const closest = supportedSalaries.reduce((prev, curr) => {
      return (Math.abs(curr - salaryNum) < Math.abs(prev - salaryNum) ? curr : prev);
    });
    
    return closest.toString() as '40000' | '60000' | '80000' | '100000' | '120000';
  }

  private static mapRemoteFilter(remoteFilter: string): 'on site' | 'remote' | 'hybrid' | '' {
    // Exact values from API documentation: on site, remote, hybrid
    const mapping: Record<string, 'on site' | 'remote' | 'hybrid'> = {
      'onsite': 'on site',
      'remote': 'remote',
      'hybrid': 'hybrid'
    };
    return mapping[remoteFilter] || '';
  }

  public static async crawlJobs(filters: CrawlFilters): Promise<{
    success: boolean;
    jobs: any[]; // Changed from LinkedInJob[] to any[] since we return transformed jobs
    count: number;
    error?: string;
  }> {
    try {
      // TEMPORARY: Use mock data due to CORS restrictions in browser
      // TODO: Move this to backend where linkedin-jobs-api can work properly
      console.warn('⚠️ Using mock data - LinkedIn API blocked by CORS in browser environment');
      console.log('LinkedIn crawl started with query:', {
        keyword: filters.keyword || 'software engineer',
        location: filters.location || 'United States',
        limit: '50',
        page: '0',
        sortBy: 'recent'
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock LinkedIn job data that matches the real API structure
      const mockLinkedInJobs: LinkedInJob[] = [
        {
          position: "Senior Software Engineer",
          company: "Tech Corp",
          companyLogo: "https://via.placeholder.com/64x64?text=TC",
          location: "San Francisco, CA",
          date: "2024-01-15",
          agoTime: "2 days ago",
          salary: "$120,000 - $160,000",
          jobUrl: "https://linkedin.com/jobs/view/123456"
        },
        {
          position: "Full Stack Developer",
          company: "Innovation Labs",
          companyLogo: "https://via.placeholder.com/64x64?text=IL",
          location: "New York, NY",
          date: "2024-01-14",
          agoTime: "3 days ago",
          salary: "$100,000 - $140,000",
          jobUrl: "https://linkedin.com/jobs/view/123457"
        },
        {
          position: "Frontend React Developer",
          company: "Startup Inc",
          companyLogo: "https://via.placeholder.com/64x64?text=SI",
          location: "Austin, TX",
          date: "2024-01-13",
          agoTime: "4 days ago",
          salary: "$90,000 - $120,000",
          jobUrl: "https://linkedin.com/jobs/view/123458"
        },
        {
          position: "Backend Engineer",
          company: "Enterprise Solutions",
          companyLogo: "https://via.placeholder.com/64x64?text=ES",
          location: "Seattle, WA",
          date: "2024-01-12",
          agoTime: "5 days ago",
          salary: "$110,000 - $150,000",
          jobUrl: "https://linkedin.com/jobs/view/123459"
        },
        {
          position: "DevOps Engineer",
          company: "Cloud Systems",
          companyLogo: "https://via.placeholder.com/64x64?text=CS",
          location: "Remote",
          date: "2024-01-11",
          agoTime: "6 days ago",
          salary: "$115,000 - $145,000",
          jobUrl: "https://linkedin.com/jobs/view/123460"
        }
      ];

      console.log(`Mock LinkedIn crawl completed. Found ${mockLinkedInJobs.length} jobs`);

      // Transform jobs to standard format
      const transformedJobs = this.transformJobsToStandardFormat(mockLinkedInJobs);
      
      // Save to localStorage for preview and editing workflow
      // Users can review, edit, and select which jobs to send to backend
      this.saveJobsToLocalStorage(transformedJobs, new Date().toISOString());

      console.log(`Cached ${transformedJobs.length} jobs for preview. Use Preview Jobs button to review.`);

      return {
        success: true,
        jobs: transformedJobs,
        count: transformedJobs.length
      };

      /* 
      // ORIGINAL CODE - Commented out due to CORS issues
      // This would work in a backend environment
      
      // Import the LinkedIn API exactly as shown in the documentation
      const linkedIn = await import('linkedin-jobs-api');
      
      // Build query options exactly as shown in the documentation
      const queryOptions: LinkedInJobQuery = {
        keyword: filters.keyword || 'software engineer',
        location: filters.location || 'United States',
        limit: '50', // Start with reasonable limit
        page: '0',
        sortBy: 'recent'
      };

      // Add optional filters only if they have values - using exact API mapping
      if (filters.datePosted && filters.datePosted !== 'any') {
        const mappedDate = this.mapDatePosted(filters.datePosted);
        if (mappedDate) {
          queryOptions.dateSincePosted = mappedDate;
        }
      }

      if (filters.jobType && filters.jobType !== 'all') {
        const mappedJobType = this.mapJobType(filters.jobType);
        if (mappedJobType) {
          queryOptions.jobType = mappedJobType;
        }
      }

      if (filters.experienceLevel && filters.experienceLevel !== 'all') {
        const mappedLevel = this.mapExperienceLevel(filters.experienceLevel);
        if (mappedLevel) {
          queryOptions.experienceLevel = mappedLevel;
        }
      }

      if (filters.salary && filters.salary !== '') {
        const mappedSalary = this.mapSalary(filters.salary);
        if (mappedSalary) {
          queryOptions.salary = mappedSalary;
        }
      }

      console.log('LinkedIn crawl started with query:', queryOptions);

      // Call the LinkedIn API exactly as shown in documentation: linkedIn.query(queryOptions)
      const jobs = await linkedIn.query(queryOptions);
      
      console.log(`LinkedIn crawl completed. Found ${jobs.length} jobs`);

      // Transform jobs to standard format
      const transformedJobs = this.transformJobsToStandardFormat(jobs);
      
      // Save to localStorage for preview and editing workflow
      // Users can review, edit, and select which jobs to send to backend
      this.saveJobsToLocalStorage(transformedJobs, new Date().toISOString());

      console.log(`Cached ${transformedJobs.length} jobs for preview. Use Preview Jobs button to review.`);

      return {
        success: true,
        jobs: transformedJobs,
        count: transformedJobs.length
      };
      */

    } catch (error: any) {
      console.error('LinkedIn crawl failed:', error);
      
      // Handle specific error cases
      let errorMessage = 'Unknown error occurred';
      
      if (error.message?.includes('CORS')) {
        errorMessage = 'CORS error - LinkedIn crawling needs to run on backend. Using mock data for demo.';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Network error - check internet connection';
      } else if (error.message?.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded - please wait before trying again';
      } else {
        errorMessage = error.message || 'Failed to crawl LinkedIn jobs';
      }

      return {
        success: false,
        jobs: [],
        count: 0,
        error: errorMessage
      };
    }
  }

  // Method to transform LinkedIn jobs to our standard format
  public static transformJobsToStandardFormat(linkedInJobs: LinkedInJob[]) {
    return linkedInJobs.map(job => ({
      title: job.position,
      company: job.company,
      location: job.location,
      description: '', // LinkedIn API doesn't provide full description
      salary: job.salary,
      jobUrl: job.jobUrl,
      datePosted: job.date,
      source: 'LinkedIn',
      companyLogo: job.companyLogo,
      postedAgo: job.agoTime
    }));
  }

  // Method to send crawled jobs to backend (from localStorage after preview/editing)
  public static async sendJobsToBackend(jobs?: any[]) {
    try {
      // If no jobs provided, get from localStorage
      let jobsToSend = jobs;
      if (!jobsToSend) {
        const cachedData = this.getJobsFromLocalStorage();
        if (!cachedData || !cachedData.jobs) {
          throw new Error('No jobs found in cache. Please crawl jobs first.');
        }
        jobsToSend = cachedData.jobs;
      }

      const result = await fetchWithAuth('/api/jobs/bulk-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobs: jobsToSend,
          source: 'linkedin_frontend_crawl'
        })
      });

      console.log('Jobs successfully sent to backend:', result);
      
      // Clear localStorage after successful send
      this.clearJobsFromLocalStorage();
      
      return result;

    } catch (error) {
      console.error('Failed to send jobs to backend:', error);
      throw error;
    }
  }
}
