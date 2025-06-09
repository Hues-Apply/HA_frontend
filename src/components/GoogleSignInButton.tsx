import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { getGoogleClientId } from '../services/auth';
import { BASE_URL } from '../services/api';

interface GoogleSignInButtonProps {
  className?: string;
  text?: string;
}

const GoogleSignInButton = ({ 
  className = '',
  text = 'Sign in with Google'
}: GoogleSignInButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle button click to redirect to Google OAuth
  const handleSignInClick = async () => {
    try {
      setIsLoading(true);
      
      // Get the Google client ID from your backend
      const { client_id } = await getGoogleClientId();
      
      // Create the redirect URL for after authentication
      const redirectUri = `${BASE_URL}/api/auth/google/callback`;
      
      // Generate a random state value for security
      const state = Math.random().toString(36).substring(2);
      localStorage.setItem('oauth_state', state);
      
      // Build the Google OAuth URL with the required parameters
      const oauthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      
      // Add required parameters
      oauthUrl.searchParams.append('client_id', client_id);
      oauthUrl.searchParams.append('redirect_uri', redirectUri);
      oauthUrl.searchParams.append('response_type', 'code');
      oauthUrl.searchParams.append('scope', 'email profile openid');
      oauthUrl.searchParams.append('state', state);
      oauthUrl.searchParams.append('access_type', 'offline');
      oauthUrl.searchParams.append('prompt', 'select_account');
      
      // Redirect to Google's OAuth page
      window.location.href = oauthUrl.toString();
    } catch (error) {
      console.error('Error initiating Google Sign-In:', error);
      alert("Could not start Google Sign-In. Please try again.");
      setIsLoading(false);
    }
  };
  return (
    <button
      onClick={handleSignInClick}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors ${className}`}
    >
      <FcGoogle className="text-xl" />
      <span>{isLoading ? "Redirecting to Google..." : text}</span>
    </button>
  );
};

export default GoogleSignInButton;
