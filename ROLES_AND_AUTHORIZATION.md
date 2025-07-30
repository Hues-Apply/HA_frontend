# HuesApply Backend - Roles and Authorization Documentation

## Overview

This document outlines the role-based access control (RBAC) system implemented in the HuesApply backend. The system uses three primary user roles with specific permissions for different API endpoints and operations.

## User Roles

### 1. Applicant
- **Purpose**: Job seekers, students, and individuals looking for opportunities
- **Default Role**: New users are automatically assigned this role
- **Primary Functions**:
  - Browse and search opportunities
  - Apply to jobs, scholarships, and other opportunities
  - Manage personal profile and documents
  - Receive personalized recommendations

### 2. Employer
- **Purpose**: Companies, organizations, and individuals posting opportunities
- **Primary Functions**:
  - Create and manage job postings
  - Create and manage opportunities
  - View applications for their posted opportunities
  - Manage company profile

### 3. Administrator
- **Purpose**: System administrators with full access
- **Primary Functions**:
  - Full system access and management
  - Manage all opportunities and scholarships
  - User management and role assignment
  - System configuration and maintenance

## Authentication

### JWT Token Authentication
All API requests (except public endpoints) require authentication using JWT tokens:

```javascript
// Include in request headers
headers: {
  'Authorization': 'Bearer <your_jwt_token>',
  'Content-Type': 'application/json'
}
```

### Google OAuth Flow
Users can authenticate using Google OAuth:
1. Frontend obtains Google credential token
2. Send to `/api/auth/google/` endpoint
3. Backend verifies and returns JWT tokens
4. Use JWT tokens for subsequent API calls

## API Endpoint Permissions

### Public Endpoints (No Authentication Required)
These endpoints can be accessed without authentication:

- `GET /api/jobs/` - Browse all jobs
- `GET /api/scholarships/` - Browse all scholarships
- `GET /api/opportunities/` - Browse all opportunities
- `GET /api/auth/google-client-id/` - Get Google OAuth client ID
- `POST /api/auth/google/` - Google OAuth authentication
- `POST /api/register/` - User registration

### Applicant-Only Endpoints
These endpoints require the user to have the "Applicant" role:

- `POST /api/jobs/{id}/apply/` - Apply to a job
- `POST /api/scholarships/{id}/apply/` - Apply to a scholarship
- `POST /api/opportunities/{id}/apply/` - Apply to an opportunity

### Employer-Only Endpoints
These endpoints require the user to have the "Employer" role:

- `POST /api/jobs/` - Create new job posting
- `PUT /api/jobs/{id}/` - Update job posting (own jobs only)
- `DELETE /api/jobs/{id}/` - Delete job posting (own jobs only)
- `POST /api/opportunities/` - Create new opportunity
- `PUT /api/opportunities/{id}/` - Update opportunity (own opportunities only)
- `DELETE /api/opportunities/{id}/` - Delete opportunity (own opportunities only)

### Administrator-Only Endpoints
These endpoints require administrator privileges:

- `POST /api/scholarships/` - Create new scholarship
- `PUT /api/scholarships/{id}/` - Update scholarship
- `DELETE /api/scholarships/{id}/` - Delete scholarship
- `POST /api/opportunities/bulk_create/` - Bulk create opportunities
- `GET /api/opportunities/crawl_stats/` - View crawling statistics
- `POST /api/opportunities/scrape_jobs/` - Trigger job scraping

### Authenticated User Endpoints
These endpoints require any authenticated user:

- `GET /api/jobs/applications/` - View own job applications
- `GET /api/scholarships/applications/` - View own scholarship applications
- `GET /api/opportunities/applications/` - View own opportunity applications
- `GET /api/profile/*` - All profile management endpoints
- `POST /api/profile/upload-document-file/` - Upload documents
- `GET /api/role/` - Get current user role
- `POST /api/role/` - Update user role (Applicant ↔ Employer)

## Permission Matrix

| Resource | Action | Applicant | Employer | Admin | Public |
|----------|--------|-----------|----------|-------|--------|
| **Jobs** |
| | View/List | ✅ | ✅ | ✅ | ✅ |
| | Create | ❌ | ✅ | ✅ | ❌ |
| | Update (own) | ❌ | ✅ | ✅ | ❌ |
| | Update (others) | ❌ | ❌ | ✅ | ❌ |
| | Delete (own) | ❌ | ✅ | ✅ | ❌ |
| | Delete (others) | ❌ | ❌ | ✅ | ❌ |
| | Apply | ✅ | ❌ | ❌ | ❌ |
| | View Applications | ✅ (own) | ✅ (own jobs) | ✅ | ❌ |
| **Scholarships** |
| | View/List | ✅ | ✅ | ✅ | ✅ |
| | Create | ❌ | ❌ | ✅ | ❌ |
| | Update | ❌ | ❌ | ✅ | ❌ |
| | Delete | ❌ | ❌ | ✅ | ❌ |
| | Apply | ✅ | ❌ | ❌ | ❌ |
| | View Applications | ✅ (own) | ❌ | ✅ | ❌ |
| **Opportunities** |
| | View/List | ✅ | ✅ | ✅ | ✅ |
| | Create | ❌ | ✅ | ✅ | ❌ |
| | Update (own) | ❌ | ✅ | ✅ | ❌ |
| | Update (others) | ❌ | ❌ | ✅ | ❌ |
| | Delete (own) | ❌ | ✅ | ✅ | ❌ |
| | Delete (others) | ❌ | ❌ | ✅ | ❌ |
| | Apply | ✅ | ❌ | ❌ | ❌ |
| | View Applications | ✅ (own) | ✅ (own opportunities) | ✅ | ❌ |
| | Bulk Create | ❌ | ✅ | ✅ | ❌ |
| **User Profile** |
| | View Own | ✅ | ✅ | ✅ | ❌ |
| | Update Own | ✅ | ✅ | ✅ | ❌ |
| | View Others | ❌ | ❌ | ✅ | ❌ |
| | Update Others | ❌ | ❌ | ✅ | ❌ |
| **Documents** |
| | Upload Own | ✅ | ✅ | ✅ | ❌ |
| | View Own | ✅ | ✅ | ✅ | ❌ |
| | Delete Own | ✅ | ✅ | ✅ | ❌ |
| | View Others | ❌ | ❌ | ✅ | ❌ |

## Error Responses

### Authentication Errors
```json
{
  "detail": "Authentication credentials were not provided."
}
```
**HTTP Status**: 401 Unauthorized

### Permission Errors
```json
{
  "detail": "You do not have permission to perform this action."
}
```
**HTTP Status**: 403 Forbidden

### Role-Specific Errors
```json
{
  "error": "This action requires employer permissions."
}
```
**HTTP Status**: 403 Forbidden

## Frontend Implementation Guidelines

### 1. Role-Based UI Rendering
```javascript
// Check user role to show/hide features
const userRole = user.role; // 'Applicant', 'Employer', or 'Administrator'

if (userRole === 'Applicant') {
  // Show apply buttons, hide create job forms
} else if (userRole === 'Employer') {
  // Show create job forms, hide apply buttons
} else if (userRole === 'Administrator') {
  // Show all features
}
```

### 2. API Call Authorization
```javascript
// Always include JWT token in requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem('jwt_token');

  return fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
};
```

### 3. Error Handling
```javascript
const handleApiError = (response) => {
  if (response.status === 401) {
    // Redirect to login
    redirectToLogin();
  } else if (response.status === 403) {
    // Show permission error message
    showPermissionError();
  } else {
    // Handle other errors
    showGenericError();
  }
};
```

### 4. Role Switching
```javascript
// Allow users to switch between Applicant and Employer roles
const switchRole = async (newRole) => {
  try {
    const response = await makeAuthenticatedRequest('/api/role/', {
      method: 'POST',
      body: JSON.stringify({ role: newRole })
    });

    if (response.ok) {
      // Update UI and user state
      updateUserRole(newRole);
      refreshPage();
    }
  } catch (error) {
    console.error('Role switch failed:', error);
  }
};
```

## Testing Permissions

### Test User Accounts
For testing different roles, you can use these endpoints:

1. **Create test users**:
   ```bash
   POST /api/register/
   {
     "email": "applicant@test.com",
     "password": "testpass123",
     "first_name": "Test",
     "last_name": "Applicant",
     "role": "applicant"
   }
   ```

2. **Switch roles**:
   ```bash
   POST /api/role/
   {
     "role": "employer"
   }
   ```

### Permission Testing Checklist
- [ ] Test public endpoints without authentication
- [ ] Test authenticated endpoints with valid JWT token
- [ ] Test role-specific endpoints with correct role
- [ ] Test role-specific endpoints with incorrect role (should return 403)
- [ ] Test object-level permissions (users can only access their own data)
- [ ] Test admin endpoints with administrator account

## Security Notes

1. **JWT Token Security**: Store tokens securely and implement proper token refresh
2. **Role Validation**: Always validate user roles on both frontend and backend
3. **Object-Level Security**: Users can only access their own data (profiles, applications, documents)
4. **Input Validation**: Validate all user inputs before sending to API
5. **Error Handling**: Don't expose sensitive information in error messages

## Common Patterns

### Checking User Permissions
```javascript
const canCreateJob = user.role === 'Employer' || user.role === 'Administrator';
const canApplyToJobs = user.role === 'Applicant';
const canManageScholarships = user.role === 'Administrator';
```

### Conditional Rendering
```javascript
{user.role === 'Applicant' && (
  <ApplyButton onClick={() => applyToJob(jobId)} />
)}

{user.role === 'Employer' && (
  <CreateJobButton onClick={() => showCreateJobForm()} />
)}
```

### API Route Protection
```javascript
const protectedRoute = (Component, requiredRole) => {
  return (props) => {
    const user = useUser();

    if (!user) {
      return <Redirect to="/login" />;
    }

    if (requiredRole && user.role !== requiredRole) {
      return <AccessDenied />;
    }

    return <Component {...props} />;
  };
};
```

This documentation should help the frontend team implement proper role-based access control and authorization in the HuesApply application.
