import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isAdmin, canAccessEmployer } from "../utils/roleUtils";

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

const ProtectedRoute = ({
  redirectPath = '/login',
  children
}: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Show loading state while checking authentication
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Render children or outlet (for nested routes)
  return children ? <>{children}</> : <Outlet />;
};

// Admin route component for admin-only access
interface AdminRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

const AdminRoute = ({
  redirectPath = '/dashboard',
  children
}: AdminRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    // Show loading state while checking authentication
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to dashboard if not admin
  if (!user || !isAdmin(user.role)) {
    return <Navigate to={redirectPath} replace />;
  }

  // Render children or outlet (for nested routes)
  return children ? <>{children}</> : <Outlet />;
};

// Employer route component for employer-only access
interface EmployerRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

const EmployerRoute = ({
  redirectPath = '/dashboard',
  children
}: EmployerRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    // Show loading state while checking authentication
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to dashboard if not employer or admin
  if (!user || !canAccessEmployer(user.role)) {
    return <Navigate to={redirectPath} replace />;
  }

  // Render children or outlet (for nested routes)
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
export { AdminRoute, EmployerRoute };
