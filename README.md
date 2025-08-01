# Hues Apply Frontend

A modern, accessible, and performant job and scholarship application platform built with React, TypeScript, and Tailwind CSS.

## 🚀 Recent Improvements & Fixes

### Critical Issues Fixed

#### 1. Navigation & Layout Problems ✅
- **Fixed z-index conflicts** between NavBar and SidebarWrapper
- **Improved mobile overlay** with proper background color
- **Consolidated navigation logic** for better consistency
- **Enhanced mobile menu** with proper event handling

#### 2. Security Vulnerabilities ✅
- **Added input sanitization** to prevent XSS attacks
- **Improved token management** with secure storage utilities
- **Enhanced user data validation** before storage
- **Added CSRF protection** utilities

#### 3. Performance Issues ✅
- **Fixed memory leaks** in OpportunityList component
- **Added React.memo** for component optimization
- **Implemented proper cleanup** for event listeners
- **Created performance monitoring** utilities

#### 4. Error Handling ✅
- **Enhanced ErrorBoundary** with comprehensive error UI
- **Improved API error handling** with user-friendly messages
- **Added fallback states** for failed data loading
- **Implemented proper error logging**

#### 5. Accessibility Improvements ✅
- **Added ARIA labels** and roles
- **Improved keyboard navigation**
- **Enhanced screen reader support**
- **Better color contrast** and focus indicators

### New Features Added

#### 1. Toast Notification System
- **Multiple notification types** (success, error, warning, info)
- **Customizable duration** and actions
- **Accessible design** with proper ARIA attributes
- **Context-based usage** throughout the app

#### 2. Enhanced Loading States
- **Multiple spinner variants** (default, primary, secondary, etc.)
- **Skeleton loaders** for content areas
- **Page and button loaders**
- **Full-screen loading overlays**

#### 3. Comprehensive Validation System
- **Input sanitization** utilities
- **Form validation** with custom rules
- **Password strength** validation
- **File upload** validation
- **Rate limiting** utilities

#### 4. Performance Optimization Tools
- **Debouncing and throttling** utilities
- **Memoization** helpers
- **Lazy loading** utilities
- **Virtual scrolling** support
- **Memory management** tools

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context API
- **Build Tool**: Vite
- **Package Manager**: npm

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary.tsx
│   ├── LoadingSpinner.tsx
│   ├── NotificationToast.tsx
│   ├── NavBar.tsx
│   ├── SidebarWrapper.tsx
│   └── ...
├── context/            # React Context providers
│   ├── AuthContext.tsx
│   └── AppContext.tsx
├── hooks/              # Custom React hooks
├── services/           # API and external services
├── sections/           # Page sections and layouts
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── validation.ts
│   ├── performance.ts
│   └── ...
└── assets/             # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HA_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Hues Apply
VITE_APP_VERSION=1.0.0
```

### Tailwind Configuration

The project uses Tailwind CSS with custom configuration in `tailwind.config.js`.

## 📱 Features

### User Features
- **Job Search & Applications**: Browse and apply to job opportunities
- **Scholarship Matching**: Find relevant scholarships based on profile
- **Profile Management**: Complete and manage user profiles
- **AI-Powered Recommendations**: Get personalized job and scholarship matches
- **Progress Tracking**: Monitor application progress

### Admin Features
- **User Management**: View and manage user accounts
- **Job Management**: Add, edit, and manage job postings
- **Scholarship Management**: Manage scholarship opportunities
- **Analytics Dashboard**: View platform usage statistics

## 🔒 Security Features

- **Input Sanitization**: All user inputs are sanitized
- **Secure Token Storage**: Tokens stored in sessionStorage
- **CSRF Protection**: Built-in CSRF token validation
- **Rate Limiting**: API request rate limiting
- **XSS Prevention**: HTML escaping and validation

## ♿ Accessibility

- **WCAG 2.1 AA Compliance**: Following accessibility guidelines
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and roles
- **Color Contrast**: High contrast ratios
- **Focus Management**: Clear focus indicators

## 🚀 Performance

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Images and components loaded on demand
- **Memoization**: Optimized re-renders with React.memo
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: Efficient caching strategies

## 🧪 Testing

### Running Tests
```bash
npm run test
```

### Test Coverage
```bash
npm run test:coverage
```

## 📦 Deployment

### Production Build
```bash
npm run build
```

### Vercel Deployment
The project is configured for Vercel deployment with `vercel.json`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

### Version 1.0.0 (Latest)
- ✅ Fixed critical navigation and z-index issues
- ✅ Enhanced security with input sanitization
- ✅ Improved performance with memory leak fixes
- ✅ Added comprehensive error handling
- ✅ Implemented accessibility improvements
- ✅ Created new notification system
- ✅ Added validation utilities
- ✅ Enhanced loading states

---

**Built with ❤️ by the Hues Apply Team**
