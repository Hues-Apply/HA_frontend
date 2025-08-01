import { useState } from "react";
import { Link } from "react-router-dom";
import GoogleSignInButton from "../components/GoogleSignInButton";
import SEO from '../components/SEO';


export default function LoginForm() {


  return (
    <>
      <SEO
        title="Sign In | Hues Apply"
        description="Sign in to your Hues Apply account to access jobs, scholarships, and grants. Secure login with Google OAuth or email password."
        keywords="login, sign in, authentication, account access, secure login, job search login, scholarship platform login"
        url="https://huesapply.com/login"
        tags={['login', 'authentication', 'sign in', 'account']}
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
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
          {/* Large Circle */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full opacity-20 blur-xl animate-pulse"></div>

          {/* Medium Circle */}
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full opacity-20 blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* Small Circle */}
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-indigo-200 to-blue-300 rounded-full opacity-20 blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>

          {/* Floating Dots */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-bounce"></div>
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-indigo-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Logo */}
        <img
          src={"/hero/hues_apply_logo.svg"}
          alt="Hues Apply"
          className="absolute top-6 left-6 h-24 w-32 text-[#4DA5E2] hidden md:block z-10"
        />

        {/* Main Form Container */}
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 relative z-10 border border-white/20">
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
    </>
  );
}
