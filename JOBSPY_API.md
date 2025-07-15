# JobSpy Integration API Documentation

## Overview

The HuesApply backend now includes JobSpy integration for scraping job opportunities from multiple job boards including LinkedIn, Indeed, Glassdoor, ZipRecruiter, Google Jobs, Bayt, and Naukri.

## Available Endpoints

### 1. POST /api/opportunities/scrape-jobs/

Scrape jobs from various job boards and automatically import them into the opportunity database.

#### Request Body

```json
{
  "site_names": ["indeed", "linkedin", "glassdoor"],
  "location": "United States", 
  "search_term": "",
  "job_type": "fulltime",
  "results_wanted": 50,
  "hours_old": 168,
  "is_remote": false,
  "country_indeed": "USA",
  "linkedin_fetch_description": false,
  "proxies": [],
  "dry_run": false
}
```

#### Parameters

| Parameter                      | Type    | Default                                 | Description                                                                                                                          |
| ------------------------------ | ------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `site_names`                 | array   | `["indeed", "linkedin", "glassdoor"]` | Job sites to scrape from. Valid options:`indeed`, `linkedin`, `zip_recruiter`, `glassdoor`, `google`, `bayt`, `naukri` |
| `location`                   | string  | `"United States"`                     | Geographic location to search for jobs                                                                                               |
| `search_term`                | string  | `""`                                  | Optional search term (leave empty to get all job types)                                                                              |
| `job_type`                   | string  | `null`                                | Employment type filter:`fulltime`, `parttime`, `internship`, `contract`                                                      |
| `results_wanted`             | integer | `50`                                  | Number of results per site (1-1000)                                                                                                  |
| `hours_old`                  | integer | `168`                                 | Filter jobs posted within this many hours (1-8760)                                                                                   |
| `is_remote`                  | boolean | `false`                               | Filter for remote jobs only                                                                                                          |
| `country_indeed`             | string  | `"USA"`                               | Country for Indeed/Glassdoor searches                                                                                                |
| `linkedin_fetch_description` | boolean | `false`                               | Fetch full descriptions for LinkedIn (slower)                                                                                        |
| `proxies`                    | array   | `[]`                                  | List of proxy URLs in format `"user:pass@host:port"`                                                                               |
| `dry_run`                    | boolean | `false`                               | Return sample data without saving to database                                                                                        |

#### Response (Success)

```json
{
  "success": true,
  "message": "Successfully scraped and imported 45 jobs",
  "stats": {
    "scraped_count": 50,
    "created_count": 45,
    "skipped_count": 5,
    "error_count": 0,
    "batch_id": "jobspy_a1b2c3d4",
    "parameters": {
      "site_name": ["indeed", "linkedin"],
      "location": "San Francisco, CA",
      "results_wanted": 50
    }
  },
  "created_opportunity_ids": [1001, 1002, 1003],
  "errors": []
}
```

#### Response (Dry Run)

```json
{
  "success": true,
  "message": "DRY RUN: Found 50 jobs (showing first 5)",
  "sample_data": [
    {
      "SITE": "indeed",
      "TITLE": "Software Engineer",
      "COMPANY": "Tech Corp",
      "CITY": "San Francisco",
      "STATE": "CA",
      "JOB_TYPE": "fulltime",
      "INTERVAL": "yearly",
      "MIN_AMOUNT": 100000,
      "MAX_AMOUNT": 150000,
      "JOB_URL": "https://...",
      "DESCRIPTION": "Job description..."
    }
  ],
  "stats": {
    "scraped_count": 50,
    "parameters": {...}
  }
}
```

#### Response (Error)

```json
{
  "error": "Invalid parameters",
  "details": {
    "site_names": ["This field is required."],
    "results_wanted": ["Ensure this value is less than or equal to 1000."]
  }
}
```

### 2. POST /api/opportunities/bulk-create/

Bulk create opportunities with data validation and transformation. Supports automatic skill extraction, salary parsing, and duplicate prevention.

#### Request Body

```json
{
  "jobs": [
    {
      "title": "Software Engineer",
      "type": "job",
      "organization": "Tech Corp",
      "location": "San Francisco, CA",
      "is_remote": false,
      "experience_level": "entry",
      "description": "Job description...",
      "application_url": "https://...",
      "source": "indeed",
      "external_id": "indeed_123456",
      "salary_min": 100000,
      "salary_max": 150000,
      "salary_period": "yearly",
      "salary_currency": "USD",
      "skills_required": ["python", "django"]
    }
  ],
  "batch_id": "import_batch_20250713",
  "source": "indeed"
}
```

#### Response (Success)

```json
{
  "success": true,
  "message": "Bulk creation completed successfully",
  "stats": {
    "created_count": 45,
    "skipped_count": 5,
    "error_count": 0,
    "batch_id": "import_batch_20250713"
  },
  "created_opportunity_ids": [1001, 1002, 1003],
  "errors": []
}
```

#### Response (Error)

```json
{
  "error": "Bulk creation failed: ...",
  "details": {...}
}
```

### 3. GET /api/opportunities/crawl-stats/

Get dashboard statistics for opportunity crawling and creation. Provides insights into data sources, verification status, and recent activity.

#### Response (Success)

```json
{
  "overview": {
    "total_opportunities": 1000,
    "verified_count": 800,
    "unverified_count": 200,
    "verification_rate": 80.0,
    "opportunities_with_salary": 700,
    "salary_coverage": 70.0
  },
  "sources": {
    "breakdown": [
      {"source": "indeed", "count": 500},
      {"source": "linkedin", "count": 300}
    ],
    "total_sources": 2
  },
  "recent_activity": {
    "last_30_days": 200,
    "last_7_days": 50,
    "today": 10,
    "daily_breakdown": [
      {"day": "2025-07-10", "count": 5},
      {"day": "2025-07-11", "count": 7}
    ]
  },
  "batch_imports": {
    "recent_batches": [
      {"import_batch_id": "import_batch_20250713", "source": "indeed", "count": 45, "verified_count": 40}
    ],
    "total_batches": 5
  },
  "content_distribution": {
    "by_type": [
      {"type": "job", "count": 900},
      {"type": "internship", "count": 100}
    ],
    "by_category": [
      {"category__name": "Engineering", "count": 600}
    ],
    "by_location": [
      {"location": "San Francisco, CA", "count": 200}
    ],
    "remote_vs_onsite": {
      "remote": 300,
      "onsite": 700,
      "remote_percentage": 30.0
    }
  },
  "salary_insights": {
    "by_currency": [
      {"salary_currency": "USD", "count": 650}
    ],
    "coverage_percentage": 65.0
  },
  "performance": {
    "avg_view_count": 12.5,
    "avg_application_count": 3.2,
    "total_views": 12500,
    "total_applications": 3200
  },
  "data_quality": {
    "opportunities_with_external_id": 950,
    "opportunities_with_tags": 800,
    "opportunities_with_skills": 700
  },
  "generated_at": "2025-07-13T12:00:00Z"
}
```

#### Response (Error)

```json
{
  "error": "Failed to generate crawl statistics: ..."
}
```

## Data Mapping

JobSpy data is automatically mapped to the HuesApply opportunity model:

| JobSpy Field                     | Opportunity Field              | Transformation                                |
| -------------------------------- | ------------------------------ | --------------------------------------------- |
| `TITLE`                        | `title`                      | Direct mapping                                |
| `COMPANY`                      | `organization`               | Direct mapping                                |
| `CITY`, `STATE`, `country` | `location`                   | Combined as "City, State, Country"            |
| `JOB_TYPE`                     | `type`                       | Mapped to opportunity types (job, internship) |
| `DESCRIPTION`                  | `description`                | Direct mapping                                |
| `JOB_URL`                      | `application_url`            | Direct mapping                                |
| `MIN_AMOUNT`, `MAX_AMOUNT`   | `salary_min`, `salary_max` | Parsed as decimals                            |
| `INTERVAL`                     | `salary_period`              | Mapped to period choices                      |
| `SITE`                         | `source`                     | Mapped to source choices                      |
| `is_remote`                    | `is_remote`                  | Boolean conversion                            |

### Experience Level Detection

The system automatically determines experience level from job titles and descriptions:

- **Senior**: Contains keywords like "senior", "lead", "principal", "manager", "director"
- **Entry**: Contains keywords like "junior", "entry", "associate", "trainee", "intern", "graduate"
- **Mid**: Default for jobs that don't match senior or entry patterns

### Skill Extraction

For platforms that provide skills (like Naukri), the system automatically extracts and parses skills into the `skills_required` field.

### Duplicate Prevention

The system prevents duplicates by:

1. Generating unique `external_id` based on job URL or content hash
2. Checking for existing opportunities with the same external ID
3. Skipping duplicates and reporting them in the response

## Example Use Cases

### 1. Scrape Remote Software Jobs

```json
{
  "site_names": ["indeed", "linkedin", "glassdoor"],
  "location": "United States",
  "search_term": "software engineer",
  "is_remote": true,
  "results_wanted": 100,
  "hours_old": 48
}
```

### 2. Get Entry-Level Positions

```json
{
  "site_names": ["indeed", "glassdoor"],
  "location": "San Francisco, CA",
  "search_term": "entry level OR junior OR graduate",
  "job_type": "fulltime",
  "results_wanted": 50
}
```

### 3. Scrape Internships

```json
{
  "site_names": ["indeed", "linkedin", "glassdoor"],
  "location": "United States",
  "job_type": "internship",
  "results_wanted": 200,
  "hours_old": 72
}
```

### 4. Preview Jobs (Dry Run)

```json
{
  "site_names": ["indeed"],
  "location": "New York, NY", 
  "results_wanted": 10,
  "dry_run": true
}
```

## Notes

- **Rate Limiting**: Job boards have rate limits. LinkedIn is most restrictive (~10 pages per IP)
- **Proxies**: Recommended for large scraping operations to avoid IP blocks
- **Best Performance**: Indeed has no rate limiting and provides best results
- **Authentication**: Currently endpoints are public for development (will require authentication later)
- **Caching**: Recommendation cache is automatically cleared after successful imports
- **Batch Tracking**: Each scraping session gets a unique batch ID for tracking
