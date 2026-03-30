import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiBook, FiArrowRight, FiShield, FiUsers } from 'react-icons/fi';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await registerUser({ name, email, password, role });
      login(data.user);
      toast.success('Account created! Welcome aboard!');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] bg-gradient-to-br from-indigo-600 via-blue-700 to-blue-600 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-20 -left-16 w-48 h-48 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/3 right-16 w-24 h-24 bg-white/5 rounded-full"></div>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <FiBook className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">LibraryMS</span>
          </div>
        </div>

        <div>
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Join the<br />library<br />
            <span className="text-blue-200">community.</span>
          </h2>
          <p className="text-blue-200/80 text-sm leading-relaxed max-w-sm">
            Create your account to browse books, track your reading history, and manage library resources.
          </p>
        </div>

        <p className="text-blue-300/60 text-xs">© 2026 Library Management System</p>
      </div>

      {/* Right — Register Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-600/20">
              <FiBook className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">LibraryMS</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-2">Create your account</h1>
          <p className="text-sm text-slate-400 mb-8">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-400"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-400"
                  placeholder="Min 6 characters"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                    role === 'student'
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    role === 'student' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <FiUsers className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${role === 'student' ? 'text-blue-700' : 'text-slate-600'}`}>Student</p>
                    <p className="text-[11px] text-slate-400">Browse & read</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                    role === 'admin'
                      ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    role === 'admin' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <FiShield className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${role === 'admin' ? 'text-indigo-700' : 'text-slate-600'}`}>Admin</p>
                    <p className="text-[11px] text-slate-400">Full access</p>
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Account
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
