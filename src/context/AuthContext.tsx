import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, getUserRole, UserRole } from '../services/auth';

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
  setUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing user session on initial load
  useEffect(() => {
    const loadUser = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        
        if (accessToken) {
          // Load user from localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            
            // Fetch current role
            try {
              const roleInfo = await getUserRole();
              setUserRole(roleInfo);
            } catch (error) {
              console.error("Failed to load user role:", error);
            }
          }
        }
      } catch (error) {
        console.error("Authentication error:", error);
        // Clear potentially corrupted data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setUserRole(null);
    window.location.href = '/';
  };

  // Update user data
  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
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
export const useAuth = () => useContext(AuthContext);
