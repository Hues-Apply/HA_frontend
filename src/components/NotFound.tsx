import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {/* 404 Icon */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <Search className="h-6 w-6 text-red-600" />
            </div>

            {/* Error Code */}
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>

            {/* Error Message */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Page Not Found
            </h2>

            <p className="text-gray-600 mb-8">
              Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                to="/"
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </Link>

              <button
                onClick={() => window.history.back()}
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </button>
            </div>

            {/* Helpful Links */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">Looking for something specific?</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Link
                  to="/dashboard"
                  className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
                >
                  Browse Jobs
                </Link>
                <span className="text-gray-300 hidden sm:inline">•</span>
                <Link
                  to="/dashboard?tab=scholarships"
                  className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
                >
                  Find Scholarships
                </Link>
                <span className="text-gray-300 hidden sm:inline">•</span>
                <Link
                  to="/profile"
                  className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
                >
                  Your Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
