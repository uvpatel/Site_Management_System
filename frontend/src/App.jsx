import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/ToastSystem';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import { AppLayout } from './components/layout';

const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Projects = lazy(() => import('./pages/projects/Projects'));
const ProjectDetails = lazy(() => import('./pages/projects/ProjectDetails'));
const Tasks = lazy(() => import('./pages/tasks/Tasks'));
const Workforce = lazy(() => import('./pages/workforce/Workforce'));
const Inventory = lazy(() => import('./pages/inventory/Inventory'));
const Finance = lazy(() => import('./pages/finance/Finance'));
const VendorManagement = lazy(() => import('./pages/vendors/VendorManagement'));
const Procurement = lazy(() => import('./pages/procurement/Procurement'));
const MaterialIssue = lazy(() => import('./pages/inventory/MaterialIssue'));
const Assignments = lazy(() => import('./pages/tasks/Assignments'));
const Attendance = lazy(() => import('./pages/workforce/Attendance'));
const ProjectTeam = lazy(() => import('./pages/vendors/ProjectTeam'));
const WorkerPortal = lazy(() => import('./pages/worker/WorkerPortal'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Reports = lazy(() => import('./pages/finance/Reports'));
const LeaveApplication = lazy(() => import('./pages/worker/LeaveApplication'));
const WorkerDashboard = lazy(() => import('./pages/worker/WorkerDashboard'));
const WorkerAttendance = lazy(() => import('./pages/worker/WorkerAttendance'));
const WorkerSalary = lazy(() => import('./pages/worker/WorkerSalary'));
const SignUp = lazy(() => import('./pages/auth/SignUp'));
const AuthLogin = lazy(() => import('./pages/auth/AuthLogin'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

const AppFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950">
    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-amber-500" />
  </div>
);

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  // Redirect authenticated users to correct dashboard based on role
  const defaultHome = () => {
    if (!user) return '/login';
    if (user.role === 'Worker') return '/worker';
    return '/';
  };

  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to={defaultHome()} replace /> : <SignUp />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={defaultHome()} replace /> : <AuthLogin />}
      />
      <Route
        path="/verify-email"
        element={isAuthenticated ? <Navigate to={defaultHome()} replace /> : <VerifyEmail />}
      />
      <Route
        path="/forgot-password"
        element={isAuthenticated ? <Navigate to={defaultHome()} replace /> : <ForgotPassword />}
      />
      <Route
        path="/reset-password"
        element={isAuthenticated ? <Navigate to={defaultHome()} replace /> : <ResetPassword />}
      />

      {/* Worker Routes */}
      <Route
        path="/worker"
        element={
          <ProtectedRoute allowedRoles={['Worker']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<WorkerDashboard />} />
        <Route path="attendance" element={<WorkerAttendance />} />
        <Route path="salary" element={<WorkerSalary />} />
        <Route path="leave" element={<LeaveApplication />} />
      </Route>

      {/* Protected Routes — Admin, Project_Manager, Site_Engineer */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Project_Manager', 'Site_Engineer', 'Storekeeper']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:projectId" element={<ProjectDetails />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="workforce" element={<Workforce />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="inventory" element={<Inventory />} />
        <Route
          path="vendors"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Project_Manager']}>
              <VendorManagement />
            </ProtectedRoute>
          }
        />
        <Route path="procurement" element={<Procurement />} />
        <Route path="material-issue" element={<MaterialIssue />} />
        <Route
          path="project-team"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Project_Manager']}>
              <ProjectTeam />
            </ProtectedRoute>
          }
        />
        <Route
          path="finance"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Project_Manager']}>
              <Finance />
            </ProtectedRoute>
          }
        />
        <Route path="leaves" element={<LeaveApplication />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="reports" element={<Reports />} />
        {/* Legacy worker-portal path for admin overview */}
        <Route
          path="worker-portal"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Project_Manager', 'Site_Engineer']}>
              <WorkerPortal />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? defaultHome() : '/login'} replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <ToastProvider>
            <Router>
              <Suspense fallback={<AppFallback />}>
                <AppRoutes />
              </Suspense>
            </Router>
          </ToastProvider>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
