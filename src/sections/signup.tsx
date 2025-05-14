import { useState } from 'react';

interface FormData {
  lastName: string;
  firstName: string;
  email: string;
  country: string;
  phone: string;
  password: string;
  confirmPassword: string;
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
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    // Restrict characters
    if (name === 'firstName' || name === 'lastName' || name === 'country') {
      newValue = newValue.replace(/[^a-zA-Z\s]/g, '');
    }
    if (name === 'phone') {
      newValue = newValue.replace(/[^\d]/g, '').slice(0, 10);
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
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Object.entries(formData).forEach(([name, value]) => validateField(name, value));
    if (Object.values(errors).every((err) => !err)) {
      alert('Form submitted successfully!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eaf3f9]">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
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
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
          </div>

          <p className="text-xs text-gray-600">
            By clicking continue, you agree to our Terms of Use and Privacy Policy
          </p>

          <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded">
            Sign Up
          </button>

          <div className="text-center text-gray-400">or</div>

          <button
            type="button"
            className="w-full border rounded py-2 hover:bg-gray-100"
          >
            Continue with Google
          </button>

          <p className="text-center text-sm">
            Already have an account? <a href="#" className="text-blue-500">Log In</a>
          </p>
        </form>
      </div>
    </div>
  );
}
