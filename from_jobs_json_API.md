# API Endpoint: /api/opportunities/from_jobs_json/

**Method:** GET

**Description:**
Returns a combined list of job opportunities loaded from both `jobs.json` and `jobs_glassdoor.json` files located in the `opportunities/api/` directory. This endpoint is intended for development, testing, or demo purposes and does not require authentication.


**How it works:**
- Loads jobs from `jobs.json`. If the file contains a dictionary with a `data` key, it uses the value of `data` as the job list. Otherwise, it uses the file content directly as a list.
- Loads jobs from `jobs_glassdoor.json` if present. This file is expected to be a list of job objects.
- Merges the jobs from both files into a single list and returns them in the response.
- If neither file is found or both are empty, returns a 404 error.

**Structure of jobs.json:**
The `jobs.json` file is expected to have the following structure:

```
{
  "data": [
    {
      "company": "binance",
      "title": "Binance Accelerator Program - Futures Business Development",
      "location": "Asia Remote",
      "link": "<a href='https://jobs.lever.co/binance/842e8ae4-d536-439c-82a2-ec4732ef6f36' target='_blank' >Apply</a>"
    },
    ...
  ]
}
```

**Field Descriptions:**
- `company`: Name of the company posting the job (string, may be missing in some entries)
- `title`: Title of the job opportunity (string)
- `location`: Location of the job (string)
- `link`: HTML anchor tag with the application URL (string)

**Response Format:**
- Returns a list of job objects, each formatted according to the `OpportunitySerializer`.
- Example response:

```
[
  {
    "title": "Software Engineer",
    "location": "Bellevue, WA",
    ...
  },
  ...
]
```

**Error Responses:**
- `404 Not Found`: If neither file contains jobs.
- `400 Bad Request`: If either file cannot be parsed as valid JSON.

**Authentication:**
- Not required (public endpoint).

**Example Request:**
```
GET /api/opportunities/from_jobs_json/
```

**Notes:**
- This endpoint is for non-production use. For production data, use the main opportunities endpoints.
- The structure of jobs in each file may differ; the endpoint merges them as-is.
