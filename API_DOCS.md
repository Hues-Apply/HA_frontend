# HuesApply API Documentation

This document provides comprehensive documentation for all API endpoints in the HuesApply platform, including authentication, user management, and opportunities.

## Table of Contents

1. [Authentication APIs](#authentication-apis)
   - [Google Sign-In](#google-sign-in)
   - [User Registration](#user-registration)
   - [Sign Out](#sign-out)
2. [User Management APIs](#user-management-apis)
   - [User Roles](#user-roles)
3. [Opportunities APIs](#opportunities-apis)
   - [Listing Opportunities](#listing-opportunities)
   - [Opportunity Details](#opportunity-details)
   - [Recommended Opportunities](#recommended-opportunities)
   - [Tracking](#tracking)

## Authentication APIs

### Google Sign-In

#### Get Google Client ID

Used by frontend to retrieve the Google OAuth Client ID.

**Endpoint**: `GET /api/auth/google-client-id/`  
**Authorization**: None required  
**Response**:
```json
{
  "client_id": "YOUR_GOOGLE_CLIENT_ID"
}
```

#### Google Sign-In Authentication

Used to authenticate a user with a Google credential token.

**Endpoint**: `POST /api/auth/google/`  
**Authorization**: None required  
**Request Body**:
```json
{
  "credential": "GOOGLE_ID_TOKEN"
}
```

**Response (Success - 200 OK)**:
```json
{
  "access_token": "JWT_ACCESS_TOKEN",
  "refresh_token": "JWT_REFRESH_TOKEN",
  "user": {
    "id": 123,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "Applicant",
    "is_new_user": false,
    "google_data": {
      "name": "John Doe",
      "picture": "https://..."
    }
  }
}
```

**Response (Error - 400/403)**:
```json
{
  "error": "Error message"
}
```

### User Registration

Register a new user with email and password.

**Endpoint**: `POST /api/register/`  
**Authorization**: None required  
**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "first_name": "John",
  "last_name": "Doe",
  "role": "applicant" // or "employer"
}
```

**Response (Success - 201 Created)**:
```json
{
  "access_token": "JWT_ACCESS_TOKEN",
  "refresh_token": "JWT_REFRESH_TOKEN",
  "user": {
    "id": 123,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "Applicant",
    "is_new_user": true
  }
}
```

**Response (Error - 400)**:
```json
{
  "email": ["This email is already in use."],
  "password": ["This password is too short."]
}
```

### Sign Out

Blacklist a JWT refresh token when the user signs out.

**Endpoint**: `POST /api/auth/sign-out/`  
**Authorization**: JWT Bearer token required  
**Request Body**:
```json
{
  "refresh_token": "JWT_REFRESH_TOKEN"
}
```

**Response (Success - 200 OK)**:
```json
{
  "success": "User logged out successfully"
}
```

**Response (Error - 400)**:
```json
{
  "error": "Refresh token is required"
}
```

## User Management APIs

### User Roles

#### Get User Role

Get the current user's role information.

**Endpoint**: `GET /api/role/`  
**Authorization**: JWT Bearer token required  
**Response (Success - 200 OK)**:
```json
{
  "role": "Applicant",
  "is_applicant": true,
  "is_employer": false,
  "is_admin": false
}
```

#### Update User Role

Change the user's role.

**Endpoint**: `POST /api/role/`  
**Authorization**: JWT Bearer token required  
**Request Body**:
```json
{
  "role": "employer" // or "applicant"
}
```

**Response (Success - 200 OK)**:
```json
{
  "message": "Role updated to Employer"
}
```

**Response (Error - 400)**:
```json
{
  "error": "Invalid role specified"
}
```

## Opportunities APIs

### Listing Opportunities

Get a list of opportunities with filtering, search, and pagination.

**Endpoint**: `GET /api/opportunities/`  
**Authorization**: None required (public endpoint)  
**Query Parameters**:
- `page`: Page number (default 1)
- `page_size`: Number of items per page (default 10, max 100)
- `search`: Full-text search query
- `type`: Filter by opportunity type
- `location`: Filter by location
- `is_remote`: Filter by remote status (true/false)
- `category__slug`: Filter by category slug
- `tags__slug`: Filter by tag slug
- `deadline`: Filter by deadline date
- `show_expired`: Include expired opportunities (default false)
- `ordering`: Sort field, prefix with '-' for descending (e.g. '-deadline', 'title')

**Response**:
```json
{
  "count": 100,
  "next": "http://example.com/api/opportunities/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Software Engineer",
      "organization": "Tech Company",
      "description": "Job description...",
      "type": "job",
      "location": "New York",
      "is_remote": true,
      "deadline": "2025-07-01",
      "category": {
        "name": "Engineering",
        "slug": "engineering"
      },
      "tags": [
        {
          "name": "Python",
          "slug": "python"
        }
      ],
      "posted_by": "employer@example.com",
      "created_at": "2025-06-01T12:00:00Z"
    }
  ]
}
```

### Opportunity Details

Get details of a specific opportunity.

**Endpoint**: `GET /api/opportunities/{id}/`  
**Authorization**: None required (public endpoint)  
**Response**: Same as individual opportunity object above

### Recommended Opportunities

Get personalized opportunity recommendations based on user profile.

**Endpoint**: `GET /api/opportunities/recommended/`  
**Authorization**: JWT Bearer token required  
**Query Parameters**:
- `page`: Page number (default 1)
- `page_size`: Number of items per page (default 10, max 100)
- `type`: Filter by opportunity type
- `location`: Filter by location
- `category`: Filter by category
- `tags`: Filter by tags (can be multiple)
- `skills`: Filter by skills (can be multiple)
- `deadline_after`: Filter by deadline after date
- `deadline_before`: Filter by deadline before date
- `ordering`: Sort field, prefix with '-' for descending (e.g. '-score', 'deadline')

**Response**:
```json
{
  "count": 20,
  "next": null,
  "previous": null,
  "results": [
    {
      "opportunity": {
        "id": 1,
        "title": "Software Engineer",
        // ... same as regular opportunity
      },
      "score": 0.85,
      "match_reasons": ["Skills match", "Location match"]
    }
  ]
}
```

### Tracking

#### Track View

Track that a user viewed an opportunity.

**Endpoint**: `POST /api/opportunities/{id}/track_view/`  
**Authorization**: None required  
**Response**:
```json
{
  "status": "view tracked",
  "view_count": 42
}
```

#### Track Application

Track that a user applied to an opportunity.

**Endpoint**: `POST /api/opportunities/{id}/track_application/`  
**Authorization**: JWT Bearer token required  
**Response**:
```json
{
  "status": "application tracked",
  "application_count": 15
}
```

## Frontend Integration Guide

### Authentication Flow

#### 1. Load Google API

Add this script to your HTML:
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

#### 2. Initialize Google Sign-In

```javascript
// First get the client ID from your backend
fetch('/api/auth/google-client-id/')
  .then(res => res.json())
  .then(data => {
    const clientId = data.client_id;
    
    // Initialize Google Sign-in
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true
    });

    // Display the button
    google.accounts.id.renderButton(
      document.getElementById("googleSignInButton"),
      { theme: "outline", size: "large", shape: "rectangular" }
    );
  });
```

#### 3. Handle Google Response

```javascript
function handleCredentialResponse(response) {
  // Send the credential token to your backend
  fetch('/api/auth/google/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      credential: response.credential
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      console.error('Authentication error:', data.error);
      return;
    }
    
    // Store tokens securely
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);
    
    // Store user info (optional)
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Redirect to dashboard or update UI
    window.location.href = '/dashboard';
  })
  .catch(error => {
    console.error('Authentication error:', error);
  });
}
```

#### 4. Making Authenticated Requests

```javascript
function fetchUserData() {
  fetch('/api/role/', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  })
  .then(res => res.json())
  .then(data => {
    // Update UI with user role information
    console.log('User role:', data.role);
  });
}
```

#### 5. Sign Out

```javascript
function signOut() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  fetch('/api/auth/sign-out/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: JSON.stringify({
      refresh_token: refreshToken
    })
  })
  .then(() => {
    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Redirect to home or login
    window.location.href = '/';
  });
}
```

### Working with Opportunities

#### 1. Fetching Opportunities List

```javascript
function fetchOpportunities(page = 1) {
  // Build query string with filters
  const filters = {
    page,
    page_size: 10,
    search: document.getElementById('search').value,
    type: document.getElementById('typeFilter').value,
    location: document.getElementById('locationFilter').value,
    ordering: document.getElementById('sorting').value
  };
  
  const queryString = Object.entries(filters)
    .filter(([_, value]) => value) // Remove empty values
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  
  fetch(`/api/opportunities/?${queryString}`)
    .then(res => res.json())
    .then(data => {
      // Render opportunities list
      renderOpportunities(data.results);
      
      // Update pagination
      updatePagination(data.count, data.next, data.previous);
    });
}
```

#### 2. Getting Recommended Opportunities

```javascript
function fetchRecommendations() {
  fetch('/api/opportunities/recommended/', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  })
  .then(res => res.json())
  .then(data => {
    // Render recommended opportunities
    renderRecommendations(data.results);
  });
}
```

#### 3. Tracking User Interactions

```javascript
function trackOpportunityView(opportunityId) {
  fetch(`/api/opportunities/${opportunityId}/track_view/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

function trackOpportunityApplication(opportunityId) {
  fetch(`/api/opportunities/${opportunityId}/track_application/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
}
```

## Security Considerations

1. Always verify the Google token with Google's servers (done on backend)
2. Check that the email is verified by Google (done on backend)
3. Store JWT tokens securely (preferably in HttpOnly cookies for production)
4. Use HTTPS in production
5. Implement token refresh mechanism for long user sessions
6. Set appropriate CORS headers for your frontend domain
7. Validate all user input on both frontend and backend
  "refresh_token": "JWT_REFRESH_TOKEN",
  "user": {
    "id": 123,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "Applicant",
    "is_new_user": false,
    "google_data": {
      "name": "John Doe",
      "picture": "https://..."
    }
  }
}
```

**Response (Error - 400/403)**:
```json
{
  "error": "Error message"
}
```

### 3. Sign Out

Used to blacklist a JWT refresh token when the user signs out.

**Endpoint**: `POST /api/auth/sign-out/`  
**Authorization**: JWT Bearer token required  
**Request Body**:
```json
{
  "refresh_token": "JWT_REFRESH_TOKEN"
}
```

**Response (Success - 200 OK)**:
```json
{
  "success": "User logged out successfully"
}
```

## Frontend Integration Guide

### 1. Load Google API

Add this script to your HTML:
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### 2. Initialize Google Sign-In

```javascript
// First get the client ID from your backend
fetch('/api/auth/google-client-id/')
  .then(res => res.json())
  .then(data => {
    const clientId = data.client_id;
    
    // Initialize Google Sign-in
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true
    });

    // Display the button
    google.accounts.id.renderButton(
      document.getElementById("googleSignInButton"),
      { theme: "outline", size: "large", shape: "rectangular" }
    );
  });
```

### 3. Handle Google Response

```javascript
function handleCredentialResponse(response) {
  // Send the credential token to your backend
  fetch('/api/auth/google/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      credential: response.credential
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      console.error('Authentication error:', data.error);
      return;
    }
    
    // Store tokens securely
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);
    
    // Store user info (optional)
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Redirect to dashboard or update UI
    window.location.href = '/dashboard';
  })
  .catch(error => {
    console.error('Authentication error:', error);
  });
}
```

### 4. Sign Out

```javascript
function signOut() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  fetch('/api/auth/sign-out/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: JSON.stringify({
      refresh_token: refreshToken
    })
  })
  .then(() => {
    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Redirect to home or login
    window.location.href = '/';
  });
}
```

## Security Considerations

1. Always verify the Google token with Google's servers (done on backend)
2. Check that the email is verified by Google (done on backend)
3. Store JWT tokens securely (preferably in HttpOnly cookies for production)
4. Use HTTPS in production
