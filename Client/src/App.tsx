import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthContext';
import Landing from './pages/home/Landing';
import Demo from './pages/home/Demo';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import DashboardForms from './pages/dashboard/DashboardForms';
import FormSubmissions from './pages/dashboard/FormSubmissions';
import CreateForm from './pages/forms/CreateForm';
import FormBuilder from './pages/forms/FormBuilder';
import FormPreview from './pages/forms/FormPreview';
import SubmissionDetail from './pages/dashboard/SubmissionDetail';

// Loading Component
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
}

// Auth Route Component (redirects if already logged in)
function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/demo" element={<Demo />} />
        
        {/* Auth routes */}
        <Route 
          path="/login" 
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <AuthRoute>
              <Signup />
            </AuthRoute>
          } 
        />
        
        {/* Protected dashboard routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardForms />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/forms/:formId/submissions" 
          element={
            <ProtectedRoute>
              <FormSubmissions />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/forms/:formId/submissions/:submissionId" 
          element={
            <ProtectedRoute>
              <SubmissionDetail />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected forms routes */}
        <Route 
          path="/forms" 
          element={
            <ProtectedRoute>
              <DashboardForms />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/forms/new" 
          element={
            <ProtectedRoute>
              <CreateForm />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Form builder route */}
        <Route 
          path="/builder/:formId" 
          element={
            <ProtectedRoute>
              <FormBuilder />
            </ProtectedRoute>
          } 
        />
        
        {/* Public form preview/submission route */}
        <Route path="/form/:formId" element={<FormPreview />} />
        
        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
