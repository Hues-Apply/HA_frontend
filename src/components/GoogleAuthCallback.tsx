import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exchangeGoogleAuthCode } from '../services/auth';
import { useAuth } from '../context/AuthContext';

const GoogleAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code and state from the URL
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const storedState = localStorage.getItem('oauth_state');
        
        if (!code) {
          throw new Error('No authorization code received from Google');
        }
        
        if (!state || state !== storedState) {
          throw new Error('Invalid state parameter. The request may have been tampered with.');
        }
        
        // Exchange the code for tokens
        const authResponse = await exchangeGoogleAuthCode(code, state);
        
        // Clean up the state
        localStorage.removeItem('oauth_state');
        
        // Store tokens
        localStorage.setItem('accessToken', authResponse.access_token);
        localStorage.setItem('refreshToken', authResponse.refresh_token);
        
        // Update user context
        setUser(authResponse.user);
        
        // Redirect to dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Error during Google authentication callback:', error);
        setError(error instanceof Error ? error.message : 'Authentication failed');
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };
    
    handleCallback();
  }, [searchParams, navigate, setUser]);
  
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        {error ? (
          <>
            <div className="text-red-600 font-medium text-xl mb-4">Authentication Failed</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-gray-500">Redirecting you back to the login page...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-medium mb-2">Signing you in...</h2>
            <p className="text-gray-500">Please wait while we complete the authentication process.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleAuthCallback;
