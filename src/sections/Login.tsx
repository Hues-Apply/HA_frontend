import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const [apiError, setApiError] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <img
        src={"/hero/hues_apply_logo.svg"}
        alt="Hues Apply"
        className="absolute top-6 left-6 h-24 w-32 text-[#4DA5E2] hidden md:block"
      />
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to continue your journey</p>
        </div>

        <div className="flex mb-6 rounded-lg overflow-hidden shadow-sm">
          <Link
            to="/signup"
            className="flex-1 py-3 border bg-gray-50 text-center text-gray-700 hover:bg-gray-100 transition-colors font-medium"
          >
            Sign Up
          </Link>
          <button
            className="flex-1 py-3 border border-l-0 bg-blue-500 text-white font-medium transition-colors"
            disabled
          >
            Log In
          </button>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or continue with</span>
          </div>
        </div>

        <div className="mb-8">
          <GoogleSignInButton
            text="Continue with Google"
            className="w-full hover:bg-gray-50 transition-colors shadow-sm"
          />
        </div>

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            {apiError}
          </div>
        )}

        <div className="text-center space-y-4">
          <p className="text-xs text-gray-500 leading-relaxed">
            By clicking continue, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">Terms of Use</a> and{' '}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </p>

          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
