import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';

export default function SignupForm() {
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

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

        <p className="text-xs text-gray-600 text-center mb-4">
          By clicking continue, you agree to our Terms of Use and Privacy Policy
        </p>

        <p className="text-center text-sm">
          Already have an account? <Link to="/login" className="text-blue-500">Log In</Link>
        </p>
      </div>
    </div>
  );
}
