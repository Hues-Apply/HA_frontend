import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { exchangeGoogleAuthCode } from '../services/auth';
import { useAuth } from '../context/AuthContext';

interface GoogleSignInButtonProps {
  className?: string;
  text?: string;
}

const GoogleSignInButton = ({
  className = '',
  text = 'Sign in with Google'
}: GoogleSignInButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const login = useGoogleLogin({
    // Using authorization code flow instead of implicit flow
    flow: 'auth-code',
    // Specify the redirect URI to match backend configuration
    redirect_uri: 'https://ha-backend-pq2f.vercel.app/api/auth/google/callback/',
    // Callback when Google auth is successful
    onSuccess: async (codeResponse) => {
      try {
        setIsLoading(true);
        console.log('Google Auth Success:', codeResponse);

        // The codeResponse contains the authorization code we need to send to our backend
        const { code } = codeResponse;

        // Send the code to our backend to exchange for tokens
        const authResponse = await exchangeGoogleAuthCode(code);

        // Store tokens
        localStorage.setItem('accessToken', authResponse.access_token);
        localStorage.setItem('refreshToken', authResponse.refresh_token);

        // Update user context
        setUser(authResponse.user);        // Redirect user based on whether they're new or returning
        if (authResponse.user.is_new_user === true) {
          navigate('/onboarding/step-1');
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error during Google auth code exchange:', error);
        alert('Failed to complete Google authentication. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: errorResponse => {
      console.error('Google Login Error:', errorResponse);
      alert('Google Sign-In failed. Please try again later.');
      setIsLoading(false);
    },
    // Adding scopes for user profile information
    scope: 'email profile',
  }); return (
    <button
      onClick={() => login()}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors ${className}`}
    >
      <FcGoogle className="text-xl" />
      <span>{isLoading ? "Signing in..." : text}</span>
    </button>
  );
};

export default GoogleSignInButton;
