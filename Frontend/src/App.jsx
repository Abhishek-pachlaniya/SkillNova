import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // 👈 Step 1: AuthContext import kiya
import LandingHero from './components/LandingHero';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './layout/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import ProtectedRoute from './components/ProtectedRoute';
import ProjectForm from './pages/ProjectForm';
import ProjectDetail from './pages/ProjectDetail';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import MyProjects from './pages/MyProjects';
import ApplicantsList from './pages/ApplicantsList';
import EngineerProfileView from './pages/EngineerProfileView';
import Engineers from './pages/Engineers'
import Chat from './pages/chat';
function App() {
  return (
    /* 🌐 Step 2: Poore App ko AuthProvider mein lapet diya */
    <AuthProvider> 
      <Router>
        <Routes>
          {/* 🔓 Public Routes */}
          <Route path="/" element={<LandingHero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        
          {/* 🔒 Protected Routes (Shared Layout) */}
          <Route 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Outlet /> {/* Layout ke andar dynamic content yahan dikhega */}
                </DashboardLayout>
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/engineers" element={<Engineers />} />
            <Route path="/engineer-profile/:id" element={<EngineerProfileView />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/my-projects" element={<MyProjects />} /> 
            <Route path="/projects/:id/applicants" element={<ApplicantsList />} />
            <Route path="/projects/add" element={<ProjectForm />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/projects/edit/:id" element={<ProjectForm />} />
            <Route path="/chat" element={<Chat />} />
          </Route>

          {/* 🚫 404 - Redirect to Landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;