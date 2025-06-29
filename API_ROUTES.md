# HuesApply Backend API Routes Documentation

This document outlines all the API endpoints required for the HuesApply platform backend implementation. The frontend React application expects these endpoints to be implemented in Django REST Framework.

## Base Configuration

- **Development URL**: `http://localhost:8000`
- **Production URL**: `https://ha-backend-pq2f.vercel.app`
- **Authentication**: JWT Bearer tokens
- **Content-Type**: `application/json` (except file uploads)

## Authentication Endpoints

### Google OAuth Integration

#### Exchange Google Authorization Code

```http
POST /api/auth/google/callback/
```

**Request Body:**

```json
{
  "code": "google_authorization_code"
}
```

**Response (200):**

```json
{
  "access_token": "jwt_access_token",
  "refresh_token": "jwt_refresh_token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "applicant",
    "is_new_user": true,
    "google_data": {
      "name": "John Doe",
      "picture": "https://example.com/profile.jpg"
    }
  }
}
```

### Traditional Authentication

#### Register New User

```http
POST /api/register/
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "first_name": "John",
  "last_name": "Doe",
  "role": "applicant"
}
```

**Response (201):**

```json
{
  "access_token": "jwt_access_token",
  "refresh_token": "jwt_refresh_token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "applicant",
    "is_new_user": true
  }
}
```

#### Sign Out

```http
POST /api/auth/sign-out/
Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
  "refresh_token": "jwt_refresh_token"
}
```

**Response (200):**

```json
{
  "success": "Successfully signed out"
}
```

## User Management Endpoints

### Get Google Sign-up Users List (Temporary)
```http
GET /api/users/google-signups/
```

**Description:** Returns a list of all users who signed up via Google OAuth. This is a temporary endpoint for viewing user registrations without authentication.

**Response (200):**
```json
{
  "count": 25,
  "results": [
    {
      "id": 1,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "applicant",
      "is_new_user": true,
      "created_at": "2025-06-15T10:30:00Z",
      "google_data": {
        "name": "John Doe",
        "picture": "https://lh3.googleusercontent.com/a/profile.jpg"
      }
    }
  ]
}
```

### Delete User (Temporary)
```http
DELETE /api/users/{id}/delete/
```

**Description:** Deletes a specific user by ID. This is a temporary endpoint for user management without authentication.

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

**Response (404):**
```json
{
  "detail": "User not found"
}
```

### User Role Management

#### Get User Role

```http
GET /api/role/
Authorization: Bearer {access_token}
```

**Response (200):**

```json
{
  "role": "applicant",
  "is_applicant": true,
  "is_employer": false,
  "is_admin": false
}
```

#### Update User Role

```http
POST /api/role/
Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
  "role": "employer"
}
```

**Response (200):**

```json
{
  "message": "Role updated successfully"
}
```

## Profile Management Endpoints

### Document Upload and Parsing

#### Upload CV/Resume Document File

```http
POST /api/profile/upload-document-file/
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Description:** Uploads the CV/Resume document file to the server for storage. The parsing is now handled on the frontend using resume-parser-ts.

**Request Body:**

```
document: File (PDF only)
```

**Response (200):**

```json
{
  "success": true,
  "document_id": "uuid-string",
  "file_url": "https://example.com/documents/uuid-string.pdf"
}
```
      }
    ]
  }
}
```

#### Update Parsed Profile Data

```http
POST /api/profile/update-parsed/
Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
  "personal_info": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, City, State",
    "linkedin": "https://linkedin.com/in/johndoe",
    "portfolio": "https://johndoe.com"
  },
  "summary": "Updated professional summary...",
  "education": [...],
  "experience": [...],
  "skills": [...],
  "certifications": [...],
  "languages": [...]
}
```

**Response (200):**

```json
{
  "success": true
}
```

### Profile Status and Goals

#### Get Profile Completion Status

```http
GET /api/profile/completion-status/
Authorization: Bearer {access_token}
```

**Response (200):**

```json
{
  "completion_percentage": 85,
  "missing_sections": ["certifications", "languages"],
  "completed_sections": ["personal_info", "summary", "education", "experience", "skills"]
}
```

#### Update User Goals

```http
POST /api/profile/update-goals/
Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
  "goals": [
    "Get Job Opportunities",
    "CV & Cover Letter Assistance",
    "Get Scholarship Opportunities"
  ]
}
```

**Response (200):**

```json
{
  "success": true
}
```

## Opportunities Endpoints

### Public Opportunities

#### Get List of Opportunities

```http
GET /api/opportunities/
```

**Query Parameters:**

- `page` (int): Page number for pagination
- `page_size` (int): Number of items per page
- `search` (string): Search term for title/description
- `type` (string): Filter by opportunity type
- `location` (string): Filter by location
- `is_remote` (boolean): Filter remote opportunities
- `category__slug` (string): Filter by category slug
- `tags__slug` (string): Filter by tag slug
- `deadline` (string): Filter by deadline (YYYY-MM-DD)
- `show_expired` (boolean): Include expired opportunities
- `ordering` (string): Sort order (e.g., '-created_at', 'deadline')

**Response (200):**

```json
{
  "count": 150,
  "next": "http://localhost:8000/api/opportunities/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Software Developer Position",
      "organization": "Tech Company Inc.",
      "description": "We are looking for a skilled software developer...",
      "type": "job",
      "location": "New York, NY",
      "is_remote": false,
      "deadline": "2024-02-15",
      "category": {
        "name": "Technology",
        "slug": "technology"
      },
      "tags": [
        {
          "name": "JavaScript",
          "slug": "javascript"
        },
        {
          "name": "React",
          "slug": "react"
        }
      ],
      "posted_by": "HR Manager",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Get Opportunity Details

```http
GET /api/opportunities/{id}/
```

**Response (200):**

```json
{
  "id": 1,
  "title": "Software Developer Position",
  "organization": "Tech Company Inc.",
  "description": "We are looking for a skilled software developer...",
  "type": "job",
  "location": "New York, NY",
  "is_remote": false,
  "deadline": "2024-02-15",
  "category": {
    "name": "Technology",
    "slug": "technology"
  },
  "tags": [
    {
      "name": "JavaScript",
      "slug": "javascript"
    }
  ],
  "posted_by": "HR Manager",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Authenticated Opportunities

#### Get Recommended Opportunities

```http
GET /api/opportunities/recommended/
Authorization: Bearer {access_token}
```

**Query Parameters:** Same as regular opportunities endpoint

**Response (200):**

```json
{
  "count": 25,
  "next": null,
  "previous": null,
  "results": [
    {
      "opportunity": {
        "id": 1,
        "title": "Frontend Developer",
        "organization": "StartupCo",
        "description": "Looking for React developer...",
        "type": "job",
        "location": "San Francisco, CA",
        "is_remote": true,
        "deadline": "2024-02-20",
        "category": {
          "name": "Technology",
          "slug": "technology"
        },
        "tags": [
          {
            "name": "React",
            "slug": "react"
          }
        ],
        "posted_by": "CTO",
        "created_at": "2024-01-10T15:20:00Z"
      },
      "score": 0.92,
      "match_reasons": [
        "Skills match: React, JavaScript",
        "Location preference: Remote",
        "Experience level match"
      ]
    }
  ]
}
```

### Opportunity Tracking

#### Track Opportunity View

```http
POST /api/opportunities/{id}/track_view/
```

**Response (200):**

```json
{
  "status": "success",
  "view_count": 156
}
```

#### Track Opportunity Application

```http
POST /api/opportunities/{id}/track_application/
Authorization: Bearer {access_token}
```

**Response (200):**

```json
{
  "status": "success",
  "application_count": 23
}
```

## Error Responses

### Common HTTP Status Codes

- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required or token expired
- **403 Forbidden**: Permission denied
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Error Response Format

```json
{
  "detail": "Error message describing what went wrong",
  "code": "error_code",
  "field_errors": {
    "email": ["This field is required"],
    "password": ["Password too weak"]
  }
}
```

## Authentication Flow

### New User Onboarding Flow

1. **Google OAuth Login** → `/api/auth/google/callback/`
2. **Goal Selection** → `/api/profile/update-goals/`
3. **Document Upload & Frontend Parsing** → `/api/profile/upload-document-file/` + `resume-parser-ts`
4. **Profile Review & Update** → `/api/profile/update-parsed/`
5. **Profile Completion Check** → `/api/profile/completion-status/`

**Note:** CV parsing is now handled on the frontend using the `resume-parser-ts` package. The backend only stores the document file.

### Returning User Flow

1. **Google OAuth Login** → `/api/auth/google/callback/`
2. **Dashboard Access** → `/api/opportunities/recommended/`
3. **Profile Status Check** → `/api/profile/completion-status/`

## Implementation Notes

### Required Django Packages

```python
# requirements.txt
django==4.2.7
djangorestframework==3.14.0
django-cors-headers==4.3.1
djangorestframework-simplejwt==5.3.0
google-auth==2.23.4
google-auth-oauthlib==1.1.0
python-decouple==3.8
celery==5.3.4  # For background CV parsing
redis==5.0.1   # For Celery broker
```

### Key Models to Implement

1. **User** (extend Django's AbstractUser)
2. **UserProfile** (profile completion tracking)
3. **Document** (uploaded CV/resume storage)
4. **ParsedProfile** (parsed CV data)
5. **Opportunity** (job/grant/scholarship listings)
6. **Category** (opportunity categories)
7. **Tag** (opportunity tags)
8. **UserGoal** (user's selected goals)
9. **OpportunityView** (tracking views)
10. **OpportunityApplication** (tracking applications)

### Security Considerations

- Implement rate limiting on all endpoints
- Validate file types and sizes for document uploads
- Sanitize all user inputs
- Use HTTPS in production
- Implement proper CORS settings
- Validate JWT tokens on all protected endpoints

### CV Parsing Integration

The CV parsing functionality should:

- Support PDF, DOC, DOCX formats
- Extract structured data using AI/ML services
- Handle multiple languages
- Preserve original document for reference
- Return confidence scores for extracted data

This API specification provides a complete foundation for implementing the HuesApply backend to support the existing frontend React application.
