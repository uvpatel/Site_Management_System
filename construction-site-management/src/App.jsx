/**
 * App Component
 * Main application with routing setup
 * Integrates AuthProvider, AppProvider and Router configuration
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, AppContext } from './context/AppContext';
import { useContext } from 'react';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import { AppLayout } from './components/layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Workforce from './pages/Workforce';
import Inventory from './pages/Inventory';
import Finance from './pages/Finance';
import VendorManagement from './pages/VendorManagement';
import Procurement from './pages/Procurement';
import MaterialIssue from './pages/MaterialIssue';
import Assignments from './pages/Assignments';
import Attendance from './pages/Attendance';
import ProjectTeam from './pages/ProjectTeam';
import WorkerPortal from './pages/WorkerPortal';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import SignUp from './pages/SignUp';
import AuthLogin from './pages/AuthLogin';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" replace /> : <SignUp />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <AuthLogin />}
      />
      <Route
        path="/verify-email"
        element={isAuthenticated ? <Navigate to="/" replace /> : <VerifyEmail />}
      />
      <Route
        path="/forgot-password"
        element={isAuthenticated ? <Navigate to="/" replace /> : <ForgotPassword />}
      />
      <Route
        path="/reset-password"
        element={isAuthenticated ? <Navigate to="/" replace /> : <ResetPassword />}
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="workforce" element={<Workforce />} />
        <Route path="worker-portal" element={<WorkerPortal />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="vendors" element={<VendorManagement />} />
        <Route path="procurement" element={<Procurement />} />
        <Route path="material-issue" element={<MaterialIssue />} />
        <Route path="project-team" element={<ProjectTeam />} />
        <Route path="finance" element={<Finance />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
