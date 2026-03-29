import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LandingHero from './components/LandingHero';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './layout/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import ProtectedRoute from './components/ProtectedRoute';
import ProjectForm from './pages/ProjectForm';
import ProjectDetail from './pages/ProjectDetail';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<LandingHero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🔒 All Protected Routes Wrapped Together */}
        <Route 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Outlet /> {/* 👈 Ye magic hai, saare niche wale components yahan render honge */}
              </DashboardLayout>
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardHome />} />

          <Route path="/profile" element={<Profile />} />
          
          <Route path="/projects" element={
            <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
               <h2 className="text-2xl font-black italic tracking-tighter text-indigo-400">Project Management Under Construction 🛠️</h2>
            </div>
          } />

          <Route path="/projects/add" element={<ProjectForm />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/projects/edit/:id" element={<ProjectForm />} />
        </Route>

        {/* 🚫 404 Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;