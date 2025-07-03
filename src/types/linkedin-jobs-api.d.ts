declare module 'linkedin-jobs-api' {
  interface QueryOptions {
    keyword?: string;
    location?: string;
    dateSincePosted?: 'past month' | 'past week' | '24hr';
    jobType?: 'full time' | 'part time' | 'contract' | 'temporary' | 'volunteer' | 'internship';
    remoteFilter?: 'on site' | 'remote' | 'hybrid';
    salary?: '40000' | '60000' | '80000' | '100000' | '120000';
    experienceLevel?: 'internship' | 'entry level' | 'associate' | 'senior' | 'director' | 'executive';
    limit?: string;
    sortBy?: 'recent' | 'relevant';
    page?: string;
  }

  interface Job {
    position: string;
    company: string;
    companyLogo: string;
    location: string;
    date: string;
    agoTime: string;
    salary: string;
    jobUrl: string;
  }

  function query(options: QueryOptions): Promise<Job[]>;
  
  export { query, QueryOptions, Job };
}
