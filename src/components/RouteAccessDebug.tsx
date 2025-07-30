import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { isAdmin } from '../utils/roleUtils';

const RouteAccessDebug = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Route Access Debug</h3>
      <div className="space-y-1">
        <div><strong>Current Route:</strong> {location.pathname}</div>
        <div><strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</div>
        <div><strong>User Role:</strong> {user?.role || 'None'}</div>
        <div><strong>User ID:</strong> {user?.id || 'None'}</div>
        <div><strong>Email:</strong> {user?.email || 'None'}</div>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-600">
        <div className="font-bold mb-1">Access Check:</div>
        <div className="space-y-1">
          <div>
            <strong>Public Routes:</strong>
            {['/', '/login', '/signup', '/verify-email'].includes(location.pathname) ? ' ✅' : ' ❌'}
          </div>
          <div>
            <strong>Protected Routes:</strong>
            {['/dashboard', '/profile', '/onboarding'].some(route => location.pathname.startsWith(route)) ? ' ✅' : ' ❌'}
          </div>
          <div>
            <strong>Admin Routes:</strong>
            {location.pathname.startsWith('/admin') || location.pathname === '/users-list' ? ' ✅' : ' ❌'}
          </div>
          <div>
            <strong>Can Access Admin:</strong>
            {isAdmin(user?.role) ? ' ✅ Yes' : ' ❌ No'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteAccessDebug;
