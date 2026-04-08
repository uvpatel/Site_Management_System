/**
 * ProtectedRoute Component
 * Enforces role-based access control
 * Redirects unauthorized users to login
 */

import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-slate-900/80 p-6 text-center">
          <h2 className="text-xl font-semibold text-slate-50">Access Restricted</h2>
          <p className="mt-2 text-sm text-slate-400">
            Your current role does not have access to this section.
          </p>
          <a
            href={user.role === 'Worker' ? '/worker' : '/'}
            className="mt-5 inline-flex rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950"
          >
            Go to your dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
