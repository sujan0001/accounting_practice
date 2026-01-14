import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider, useProject } from './context/ProjectContext';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/projects/Projects';
import ProjectSwitch from './pages/projects/ProjectSwitch';
import MasterSetup from './pages/master/MasterSetup';
import BudgetEntry from './pages/entries/BudgetEntry';
import JournalVoucherEntry from './pages/entries/JournalVoucherEntry';
import Reports from './pages/reports/Reports';
import Books from './pages/books/Books';
import Layout from './components/layout/Layout';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const { activeProject, loading } = useProject();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />
      
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route
                  path="/projects/switch"
                  element={!activeProject ? <ProjectSwitch /> : <Navigate to="/dashboard" />}
                />
                <Route
                  path="/master-setup"
                  element={activeProject ? <MasterSetup /> : <Navigate to="/projects/switch" />}
                />
                <Route
                  path="/budget"
                  element={activeProject ? <BudgetEntry /> : <Navigate to="/projects/switch" />}
                />
                <Route
                  path="/journal-voucher"
                  element={activeProject ? <JournalVoucherEntry /> : <Navigate to="/projects/switch" />}
                />
                <Route
                  path="/reports"
                  element={activeProject ? <Reports /> : <Navigate to="/projects/switch" />}
                />
                <Route
                  path="/reports/:type"
                  element={activeProject ? <Reports /> : <Navigate to="/projects/switch" />}
                />
                <Route
                  path="/books"
                  element={activeProject ? <Books /> : <Navigate to="/projects/switch" />}
                />
                <Route
                  path="/books/:type"
                  element={activeProject ? <Books /> : <Navigate to="/projects/switch" />}
                />
                <Route
                  path="/master-setup"
                  element={activeProject ? <MasterSetup /> : <Navigate to="/projects/switch" />}
                />
                <Route
                  path="/master-setup/:type"
                  element={activeProject ? <MasterSetup /> : <Navigate to="/projects/switch" />}
                />
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;

