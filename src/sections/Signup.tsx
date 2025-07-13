import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';

interface FormData {
  lastName: string;
  firstName: string;
  email: string;
  country: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: 'applicant' | 'employer';
}

export default function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    lastName: '',
    firstName: '',
    email: '',
    country: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'applicant',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(true);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    // Restrict characters
    if ((name === 'firstName' || name === 'lastName' || name === 'country') && typeof value === 'string') {
      newValue = value.replace(/[^a-zA-Z\s]/g, '');
    }
    if (name === 'phone' && typeof value === 'string') {
      newValue = value.replace(/[^\d]/g, '').slice(0, 10);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    validateField(name, newValue);
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'firstName':
        if (!value.trim()) error = 'First name is required';
        break;
      case 'lastName':
        if (!value.trim()) error = 'Last name is required';
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Valid email is required';
        break;
      case 'country':
        if (!value.trim()) error = 'Country is required';
        break;
      case 'phone':
        if (!/^\d{10}$/.test(value)) error = 'Phone number must be exactly 10 digits';
        break;
      case 'password':
        if (!value || value.length < 6) error = 'Password must be at least 6 characters';
        break;
      case 'confirmPassword':
        if (value !== formData.password) error = 'Passwords do not match';
        break;
      case 'role':
        if (!['applicant', 'employer'].includes(value)) error = 'Role selection is required';
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    
    // Validate all fields
    Object.entries(formData).forEach(([name, value]) => validateField(name, String(value)));
    
    // Check if there are any validation errors
    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await registerUser({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: formData.role
      });
      
      // Store tokens
      localStorage.setItem('accessToken', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);
      
      // Set user in auth context
      setUser(response.user);
      
      // Redirect to dashboard or onboarding depending on needs
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (typeof error === 'object' && error !== null) {
        // Format API validation errors
        if (error.email) {
          setErrors(prev => ({ ...prev, email: error.email[0] }));
        }
        if (error.password) {
          setErrors(prev => ({ ...prev, password: error.password[0] }));
        }
        setApiError('Please correct the errors above.');
      } else {
        setApiError('Registration failed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eaf3f9]">
      <img
        src={"/hero/hues_apply_logo.svg"}
        alt="Hues Apply"
        className="absolute top-4 left-4 h-20 w-28 text-[#4DA5E2] hidden md:block"
      >
      </img>
      <div className="bg-white p-6 rounded shadow-md max-w-md py-8 w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        <div className="flex mb-3">
          
          <button
            className="flex-1 py-2 border border-l-0 bg-blue-400 text-white"
            disabled
          >
            Sign Up
          </button>
          <Link
            to="/login"
            className="flex-1 py-2 border bg-blue-100 text-center text-gray-700 hover:bg-blue-200"
          >
            Log In
          </Link>
        </div>

        <div className="my-3 text-center text-sm text-gray-500">or</div>

        <div className="mb-8">
          <GoogleSignInButton
          text="Continue with Google"
          className="w-full hover:bg-gray-50" 
          />
        </div>

        {apiError && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {apiError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border rounded p-2"
                disabled={isLoading}
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>
            <div className="flex-1">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border rounded p-2"
                disabled={isLoading}
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded p-2"
                disabled={isLoading}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="flex-1">
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border rounded p-2"
                disabled={isLoading}
              />
              {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
            </div>
          </div>

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded p-2"
            disabled={isLoading}
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded p-2"
                disabled={isLoading}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <div className="flex-1">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded p-2"
                disabled={isLoading}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">I am a:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded p-2"
              disabled={isLoading}
            >
              <option value="applicant">Applicant looking for opportunities</option>
              <option value="employer">Employer looking to post opportunities</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
          </div>

          <p className="text-xs text-gray-600">
            By clicking continue, you agree to our Terms of Use and Privacy Policy
          </p>

          <button 
            type="submit" 
            className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div className="text-center text-gray-400">or</div>

          

          <p className="text-center text-sm">
            Already have an account? <Link to="/login" className="text-blue-500">Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
