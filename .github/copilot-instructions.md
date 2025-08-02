# HuesApply Frontend - AI Coding Agent Instructions

## Project Overview
React TypeScript frontend for HuesApply - an opportunity matching platform. Built with Vite, React 19, TailwindCSS, and React Router v7. Features Google OAuth authentication, AI-powered recommendations, and admin management capabilities.

## Essential Architecture

### Core Technology Stack
- **Build Tool**: Vite with TypeScript project references (`tsconfig.app.json` + `tsconfig.node.json`)
- **Styling**: TailwindCSS v4 with Inter font system and responsive utilities
- **Routing**: React Router v7 with nested routes and role-based protection
- **State**: React Context API (`AuthContext` + `AppContext`) - no external state library
- **Auth**: Google OAuth via `@react-oauth/google` with JWT token management

### Key Application Structure
```
src/
├── context/           # Global state (Auth + App state)
├── components/        # Reusable UI (Toast, Sidebar, Forms)
├── sections/          # Page-level components (Login, Profile, JobPortal)
├── services/          # API layer (auth.ts, api.ts)
├── utils/             # Security & performance utilities
└── types/             # TypeScript definitions
```

### Authentication Flow & Security
- **Google OAuth**: ID token verification via `exchangeGoogleAuthCode()` in `services/auth.ts`
- **Token Storage**: Session storage for sensitive tokens, localStorage for user data
- **Route Protection**: `ProtectedRoute` + `AdminRoute` components with role-based access
- **Input Sanitization**: All user inputs sanitized via `utils/validation.ts` utilities
- **CSRF Protection**: Built-in token validation and XSS prevention

## Critical Developer Workflows

### Development Setup
```bash
npm install                    # Install dependencies
npm run dev                   # Start dev server (localhost:5173)
npm run build                 # TypeScript check + Vite build
npm run lint                  # ESLint with React hooks rules
```

### Environment Configuration
```env
VITE_API_BASE_URL=http://localhost:8000/api  # Backend API endpoint
VITE_GOOGLE_CLIENT_ID=<google-oauth-client>  # Required for auth
```

### Component Patterns
```tsx
// Standard component with auth
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated } = useAuth();
  return <div>Content for {user?.first_name}</div>;
};

// Performance optimization pattern
import React from 'react';
const OptimizedComponent = React.memo(() => {
  // Component logic
});
```

## Project-Specific Patterns

### Context Usage & State Management
- **AuthContext**: User authentication, role management (`is_staff`, `is_superuser`)
- **AppContext**: UI state (sidebar, notifications, filters, saved opportunities)
- **Toast System**: Global notifications via `NotificationToast` component with context provider

### API Communication (`services/api.ts`)
```typescript
// Standard authenticated request pattern
import { fetchWithAuth } from '../services/api';

const response = await fetchWithAuth('/endpoint', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

### Route Protection Architecture
- **Public Routes**: `/`, `/login`, `/signup` (no auth required)
- **Protected Routes**: `/dashboard/*`, `/profile`, `/onboarding/*` (require auth)
- **Admin Routes**: `/admin/*`, `/users-list` (require `is_staff` role)
- **Nested Layouts**: `MainLayout` (with navbar/footer) vs `SidebarWrapper` (dashboard)

### Form Validation & Security
```typescript
// Input sanitization pattern
import { sanitizeInput, validatePassword } from '../utils/validation';

const cleanInput = sanitizeInput(userInput);
const { isValid, errors } = validatePassword(password);
```

### Performance Optimization Utilities
- **Debouncing/Throttling**: `utils/performance.ts` for search inputs and API calls
- **Memoization**: React.memo for expensive components
- **Lazy Loading**: Route-based code splitting via React Router

## Integration Points

### Backend Communication
- **Base URL**: Configurable via `VITE_API_BASE_URL` (defaults to Vercel production)
- **Error Handling**: 401 redirects to login, standardized error responses
- **Auth Headers**: Automatic Bearer token injection via `fetchWithAuth()`

### Deployment (Vercel)
- **SPA Routing**: `vercel.json` rewrites all routes to `/` for client-side routing
- **Build Process**: TypeScript compilation + Vite optimization
- **Environment**: Production API at `backend.huesapply.com`

## Key Files to Understand
- `src/App.tsx` - Route configuration and nested layout patterns
- `src/context/AuthContext.tsx` - Authentication flow and secure storage
- `src/services/api.ts` - API communication patterns and error handling
- `src/utils/validation.ts` - Security utilities and input sanitization
- `src/components/ProtectedRoute.tsx` - Role-based access control
- `src/components/SidebarWrapper.tsx` - Dashboard layout and navigation

## Common Gotchas

### TypeScript Configuration
- Uses project references - compile with `tsc -b` before `vite build`
- Strict mode enabled with unused parameter/variable checks
- Path alias `@/` configured for `src/` directory

### Styling & Responsive Design
- TailwindCSS v4 with responsive-first approach
- Mobile sidebar overlay patterns in `SidebarWrapper`
- Z-index management for modals and navigation

### State Management
- No Redux/Zustand - use React Context for global state
- Local component state for UI interactions
- Session storage for sensitive auth data, localStorage for preferences

### Google OAuth Integration
- Requires `VITE_GOOGLE_CLIENT_ID` environment variable
- Uses credential response flow (not authorization code)
- Token exchange handled in `services/auth.ts`
