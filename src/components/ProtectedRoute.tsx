import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Show a premium loading spinner while checking auth status
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {/* Animated Spinner with NeuroMood primary color */}
          <div className="w-16 h-16 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
          <div className="flex items-center gap-2 text-primary font-medium text-lg">
            <span className="material-symbols-outlined animate-pulse">psychology</span>
            <span>Securing your space...</span>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected page/layout if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
