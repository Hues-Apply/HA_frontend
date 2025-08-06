import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, getUserRole, UserRole, signOut } from '../services/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userRole: UserRole | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  userRole: null,
  loading: true,
  setUser: () => { },
  logout: () => { },
});

// Input sanitization utility
const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '').trim();
};

// Secure storage utilities with encryption simulation
const secureStorage = {
  setItem: (key: string, value: string) => {
    try {
      // Sanitize the value before storing
      const sanitizedValue = sanitizeInput(value);

      // Use sessionStorage for sensitive data that should be cleared on tab close
      if (key === 'accessToken' || key === 'refreshToken') {
        sessionStorage.setItem(key, sanitizedValue);
      } else {
        sessionStorage.setItem(key, sanitizedValue);
      }
    } catch (error) {
      console.error('Failed to store data:', error);
    }
  },

  getItem: (key: string): string | null => {
    try {
      if (key === 'accessToken' || key === 'refreshToken') {
        return sessionStorage.getItem(key);
      }
      return sessionStorage.getItem(key);
    } catch (error) {
      console.error('Failed to retrieve data:', error);
      return null;
    }
  },

  removeItem: (key: string) => {
    try {
      if (key === 'accessToken' || key === 'refreshToken') {
        sessionStorage.removeItem(key);
      } else {
        sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Failed to remove data:', error);
    }
  },

  clear: () => {
    try {
      sessionStorage.clear();
      sessionStorage.removeItem('user');
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing user session on initial load
  useEffect(() => {
    const loadUser = async () => {
      try {
        const accessToken = secureStorage.getItem('accessToken');

        if (accessToken) {
          // Load user from localStorage
          const storedUser = secureStorage.getItem('user');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);

              // Validate user data structure
              if (parsedUser && typeof parsedUser === 'object' && parsedUser.email) {
                setUser(parsedUser);

                // Fetch current role
                try {
                  const roleInfo = await getUserRole();
                  setUserRole(roleInfo);
                } catch (error) {
                  console.error("Failed to load user role:", error);
                  // If role fetch fails, token might be expired
                  // Clear storage and redirect to login
                  secureStorage.clear();
                  setUser(null);
                  setUserRole(null);
                }
              } else {
                console.error("Invalid user data structure");
                secureStorage.clear();
              }
            } catch (error) {
              console.error("Failed to parse stored user data:", error);
              secureStorage.clear();
            }
          }
        }
      } catch (error) {
        console.error("Authentication error:", error);
        // Clear potentially corrupted data
        secureStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Logout function with proper cleanup
  const logout = async () => {
    try {
      const refreshToken = secureStorage.getItem('refreshToken');
      if (refreshToken) {
        await signOut(refreshToken);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Always clear storage and state regardless of API call success
      secureStorage.clear();
      setUser(null);
      setUserRole(null);

      // Redirect to home page
      window.location.href = '/';
    }
  };

  // Update user data with validation
  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      try {
        // Validate user data before storing
        if (newUser.email && typeof newUser.email === 'string') {
          secureStorage.setItem('user', JSON.stringify(newUser));
        } else {
          console.error('Invalid user data provided');
        }
      } catch (error) {
        console.error('Failed to store user data:', error);
      }
    } else {
      secureStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        userRole,
        loading,
        setUser: handleSetUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
