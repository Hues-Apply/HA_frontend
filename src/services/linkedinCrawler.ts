
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
      // Build request body for /api/opportunities/scrape-jobs/
      const body = {
        site_names: ["linkedin"],
        location: filters.location || "United States",
        search_term: filters.keyword || "",
        job_type: filters.jobType || null,
        results_wanted: 50,
        hours_old: 168,
        is_remote: false,
        country_indeed: "USA",
        linkedin_fetch_description: false,
        proxies: [],
        dry_run: false
      };

      const response = await fetchWithAuth('/api/opportunities/scrape_jobs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      // The backend returns jobs already mapped to the Opportunity model
      // Use 'created_opportunity_ids' and 'stats' for reporting, but for preview, use the jobs if returned
      let jobs = [];
      let count = 0;
      if (response && response.stats && typeof response.stats.scraped_count === 'number') {
        count = response.stats.scraped_count;
      }
      // If backend returns sample_data (dry_run), use that for preview
      if (response.sample_data) {
        jobs = response.sample_data;
        count = jobs.length;
      } else if (response.jobs) {
        jobs = response.jobs;
        count = jobs.length;
      }

      // Save to localStorage for preview and editing workflow
      this.saveJobsToLocalStorage(jobs, new Date().toISOString());

      return {
        success: true,
        jobs,
        count
      };
    } catch (error: any) {
      console.error('LinkedIn crawl failed:', error);
      let errorMessage = error.message || 'Failed to crawl LinkedIn jobs';
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
    // Map LinkedIn jobs to the backend's expected format (see JOBSPY_API.md)
    return linkedInJobs.map(job => {
      // Parse salary range if possible
      let salary_min = undefined;
      let salary_max = undefined;
      let salary_period = 'yearly';
      let salary_currency = 'USD';
      if (job.salary) {
        const match = job.salary.match(/\$([\d,]+)\s*-\s*\$([\d,]+)/);
        if (match) {
          salary_min = parseInt(match[1].replace(/,/g, ''));
          salary_max = parseInt(match[2].replace(/,/g, ''));
        } else {
          const single = job.salary.match(/\$([\d,]+)/);
          if (single) {
            salary_min = parseInt(single[1].replace(/,/g, ''));
          }
        }
      }
      return {
        title: job.position,
        type: 'job',
        organization: job.company,
        location: job.location,
        is_remote: job.location.toLowerCase().includes('remote'),
        experience_level: '', // Could be parsed from job.position if needed
        description: '', // LinkedIn API doesn't provide full description
        application_url: job.jobUrl,
        source: 'linkedin',
        external_id: job.jobUrl, // Use jobUrl as unique external_id
        salary_min,
        salary_max,
        salary_period,
        salary_currency,
        skills_required: [], // Could be extracted from description if available
        company_logo: job.companyLogo,
        posted_ago: job.agoTime,
        date_posted: job.date
      };
    });
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


      // Generate a batch_id for tracking
      const batch_id = `import_batch_${new Date().toISOString().replace(/[-:.TZ]/g, '')}`;
      const result = await fetchWithAuth('/api/opportunities/bulk-create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobs: jobsToSend,
          batch_id,
          source: 'linkedin'
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
