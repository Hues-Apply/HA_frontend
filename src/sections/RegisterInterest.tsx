import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

interface InterestFormData {
  name: string;
  email: string;
  interests: string[];
  message: string;
  newsletter: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  interests?: string;
  message?: string;
  general?: string;
}

const INTEREST_OPTIONS = [
  'Job Opportunities',
  'Scholarships',
  'Grants',
  'Internships',
  'Career Development',
  'Networking Events',
  'Mentorship Programs',
  'Industry Insights'
];

export default function RegisterInterest() {
  const [formData, setFormData] = useState<InterestFormData>({
    name: '',
    email: '',
    interests: [],
    message: '',
    newsletter: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.interests.length === 0) {
      newErrors.interests = 'Please select at least one area of interest';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof InterestFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field-specific error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleInterestToggle = (interest: string) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];

    setFormData(prev => ({ ...prev, interests: newInterests }));

    if (errors.interests) {
      setErrors(prev => ({ ...prev, interests: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real implementation, you would send this data to your backend
      console.log('Interest registration data:', formData);

      setSubmitted(true);
    } catch (error) {
      setErrors({ general: 'Failed to submit interest registration. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <SEO
          title="Interest Registered | Hues Apply"
          description="Thank you for registering your interest with Hues Apply. We'll keep you updated on opportunities that match your interests."
          keywords="interest registration, career opportunities, job alerts, scholarship notifications"
          url="https://huesapply.com/register-interest"
        />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
              <p className="text-gray-600">
                Your interest has been registered successfully. We'll keep you updated on opportunities that match your interests.
              </p>
            </div>

            <div className="space-y-4">
              <Link
                to="/"
                className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Return to Home
              </Link>
              <button
                onClick={() => setSubmitted(false)}
                className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Register Another Interest
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Register Interest | Hues Apply"
        description="Register your interest in jobs, scholarships, grants, and career opportunities. Stay updated with personalized recommendations."
        keywords="register interest, career opportunities, job alerts, scholarship notifications, career development"
        url="https://huesapply.com/register-interest"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url('/hero/path-to-star-texture.png')`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat'
          }}
        />

        {/* Floating Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full opacity-20 blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full opacity-20 blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-indigo-200 to-blue-300 rounded-full opacity-20 blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Logo */}
        <img
          src="/hero/hues_apply_logo.svg"
          alt="Hues Apply"
          className="absolute top-6 left-6 h-24 w-32 text-[#4DA5E2] hidden md:block z-10"
        />

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl max-w-2xl w-full p-8 border border-white/20">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Register Your Interest</h1>
              <p className="text-gray-600 max-w-md mx-auto">
                Let us know what opportunities you're interested in, and we'll keep you updated with personalized recommendations.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {errors.general}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What are you interested in? *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {INTEREST_OPTIONS.map((interest) => (
                    <label key={interest} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(interest)}
                        onChange={() => handleInterestToggle(interest)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">{interest}</span>
                    </label>
                  ))}
                </div>
                {errors.interests && (
                  <p className="mt-1 text-sm text-red-600">{errors.interests}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us more about your interests, goals, or any specific requirements..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={formData.newsletter}
                  onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="newsletter" className="ml-3 text-sm text-gray-700">
                  Subscribe to our newsletter for updates and career tips
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </div>
                  ) : (
                    'Register Interest'
                  )}
                </button>

                <Link
                  to="/"
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
                >
                  Back to Home
                </Link>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

