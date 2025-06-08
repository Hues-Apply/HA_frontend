import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGoogleClientId, authenticateWithGoogle } from '../services/auth';
import { useAuth } from '../context/AuthContext';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  redirect?: string;
  className?: string;
  text?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const GoogleSignInButton = ({ 
  onSuccess, 
  redirect = '/dashboard',
  className = '',
  text = 'Sign in with Google'
}: GoogleSignInButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  
  useEffect(() => {
    // Load the Google Identity Services script
    const loadGoogleScript = () => {
      if (window.google) {
        initializeGoogleSignIn();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    };

    // Initialize Google Sign-In once the script is loaded
    const initializeGoogleSignIn = async () => {
      try {
        const { client_id } = await getGoogleClientId();
        
        window.google?.accounts.id.initialize({
          client_id,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });
        
        if (buttonRef.current) {
          window.google?.accounts.id.renderButton(buttonRef.current, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            text,
            shape: 'rectangular',
          });
        }
      } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
      }
    };

    loadGoogleScript();
  }, [text]);

  const handleCredentialResponse = async (response: any) => {
    try {
      const authResponse = await authenticateWithGoogle(response.credential);
      
      // Store tokens
      localStorage.setItem('accessToken', authResponse.access_token);
      localStorage.setItem('refreshToken', authResponse.refresh_token);
      
      // Update user context
      setUser(authResponse.user);
      
      // Execute success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Redirect user
      navigate(redirect);
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return <div ref={buttonRef} className={className}></div>;
};

export default GoogleSignInButton;
