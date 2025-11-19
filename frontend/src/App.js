import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import store from './redux/store';
import { CustomThemeProvider } from './contexts/ThemeContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import MainLayout from './components/Layout/MainLayout';

// Pages
import SuperadminDashboard from './pages/Superadmin/SuperadminDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import Materials from './pages/Materials/Materials';
import Videos from './pages/Videos/Videos';
import Consultations from './pages/Consultations/Consultations';
import Library from './pages/Library/Library';
import Ratings from './pages/Ratings/Ratings';
import Settings from './pages/Settings/Settings';
import Profile from './pages/Profile/Profile';
import Schools from './pages/Schools/Schools';
import Users from './pages/Users/Users';
import Statistics from './pages/Statistics/Statistics';
import AIAssistant from './pages/AIAssistant/AIAssistant';
import LessonAnalysis from './pages/LessonAnalysis/LessonAnalysis'; // YANGI

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Public Route Component
function PublicRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Dashboard Router
function DashboardRouter() {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}>
        <h3>Yuklanmoqda...</h3>
      </div>
    );
  }

  if (user.role === 'superadmin' || user.is_superuser) {
    return <SuperadminDashboard />;
  } else if (user.role === 'admin') {
    return <AdminDashboard />;
  } else {
    return <TeacherDashboard />;
  }
}

// Main App Component
function App() {
  return (
    <Provider store={store}>
      <CustomThemeProvider>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardRouter />} />
              <Route path="materials" element={<Materials />} />
              <Route path="videos" element={<Videos />} />
              <Route path="consultations" element={<Consultations />} />
              <Route path="library" element={<Library />} />
              <Route path="ratings" element={<Ratings />} />
              <Route path="lesson-analysis" element={<LessonAnalysis />} /> {/* YANGI */}
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="ai-assistant" element={<AIAssistant />} />
              <Route path="schools" element={<Schools />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="users" element={<Users />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </CustomThemeProvider>
    </Provider>
  );
}

export default App;