import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import AddBook from './pages/AddBook';
import Issue from './pages/Issue';
import ReturnBook from './pages/ReturnBook';
import Login from './pages/Login';
import Register from './pages/Register';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />

      {/* Protected routes — wrapped in Layout */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/books" element={
        <ProtectedRoute>
          <Layout><Books /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/add-book" element={
        <ProtectedRoute adminOnly>
          <Layout><AddBook /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/issue" element={
        <ProtectedRoute adminOnly>
          <Layout><Issue /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/return" element={
        <ProtectedRoute adminOnly>
          <Layout><ReturnBook /></Layout>
        </ProtectedRoute>
      } />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#1e293b',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: { primary: '#2563eb', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;