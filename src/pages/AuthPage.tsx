import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { 
  Mail, Lock, Eye, EyeOff, Sparkles, ArrowLeft, CheckCircle,
  AlertCircle, Loader2, Zap
} from 'lucide-react';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, loginWithGoogle, register, resetPassword, darkMode, toggleTheme, addNotification } = useStore();
  
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
  email: '',
  password: '',
  displayName: '',
  role: 'solver' // default
});

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'register') setMode('register');
    else if (modeParam === 'reset') setMode('reset');
    else setMode('login');
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(formData.email, formData.password);
      if (result) {
        addNotification('Welcome back!', 'success');
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Use demo@collabmind.com / demo123');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await loginWithGoogle();
      if (result) {
        addNotification('Welcome!', 'success');
        navigate('/dashboard');
      } else {
        setError('Google sign-in failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred with Google sign-in.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    try {
      const result = await register(
  formData.email,
  formData.password,
  formData.displayName,
  formData.role
);
      if (result) {
        addNotification('Account created successfully!', 'success');
        navigate('/dashboard');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await resetPassword(formData.email);
      if (result) {
        setSuccess('Password reset link sent to your email!');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: 'login' | 'register' | 'reset') => {
    setMode(newMode);
    setError('');
    setSuccess('');
  };

  return (
    <div className="h-screen flex relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 ${
          darkMode 
            ? 'bg-gradient-to-br from-titanium-950 via-titanium-900 to-titanium-950' 
            : 'bg-gradient-to-br from-silver-50 via-silver-100 to-silver-200'
        }`} />
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -right-1/2 w-[800px] h-[800px] rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(240, 128, 18, 0.3) 0%, transparent 70%)',
            }}
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/2 -left-1/2 w-[600px] h-[600px] rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(247, 188, 115, 0.3) 0%, transparent 70%)',
            }}
          />
        </div>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 p-3 rounded-xl glass cursor-hover hover:bg-copper-500/20 transition-all"
      >
        <Zap className={`w-5 h-5 ${darkMode ? 'text-copper-400' : 'text-copper-600'}`} />
      </button>

      {/* Form Side */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-8 cursor-hover">
            <motion.div
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.3 }}
  className="h-12 flex items-center"
>
  <img
    src="collabmindbg.jpeg"
    className="h-full object-contain"
  />
</motion.div>
            <span className="text-3xl font-bold gradient-text">Collab Mind</span>
          </Link>

          {/* Title */}
          <div className="mb-6">
            <h1 className={`text-3xl font-bold mb-2 text-gray-900`}>
              {mode === 'login' && 'Welcome Back'}
              {mode === 'register' && 'Create Account'}
              {mode === 'reset' && 'Reset Password'}
            </h1>
            <p className="text-gray-500 ">
              {mode === 'login' && 'Sign in to continue your journey'}
              {mode === 'register' && 'Join the community of problem solvers'}
              {mode === 'reset' && 'Recover your account'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={mode === 'login' ? handleLogin : mode === 'register' ? handleRegister : handleReset}>
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass bg-transparent border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mb-4">
  <label className="block text-sm font-medium text-gray-600 mb-2">
    I want to join as
  </label>

  <select
    value={formData.role}
    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
    className="w-full px-4 py-3 rounded-xl glass bg-transparent border border-gray-300 focus:border-orange-500 outline-none"
  >
    <option value="solver">Problem Solver (Builder)</option>
    <option value="owner">Problem Owner</option>
  </select>
</div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl glass bg-transparent border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-12 py-3 rounded-xl glass bg-transparent border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-copper-500 transition-colors cursor-hover"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Error/Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-sm text-red-400">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-400">{success}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-copper-500 to-copper-600 text-white font-bold text-lg rounded-2xl border border-orange-300 hover:border-orange-400 transition-all btn-shine cursor-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  {mode === 'login' && 'Sign In'}
                  {mode === 'register' && 'Create Account'}
                  {mode === 'reset' && 'Send Reset Link'}
                </>
              )}
            </motion.button>

            {/* Forgot Password */}
            {mode === 'login' && (
              <button
                type="button"
                onClick={() => switchMode('reset')}
                className="w-full mt-4 text-sm text-blue-500 hover:text-blue-400 transition-colors"
              >
                Forgot your password?
              </button>
            )}
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google Sign In */}
          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 glass rounded-2xl font-medium flex items-center justify-center gap-3 cursor-hover disabled:opacity-50"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </motion.button>

          {/* Mode Switch */}
          <div className="mt-6 text-center">
            {mode === 'login' && (
              <p className="text-gray-500 ">
                Don't have an account?{' '}
                <button
  onClick={() => switchMode('register')}
  className="text-orange-500 hover:text-orange-600 font-medium cursor-hover transition-colors"
>
  Sign up
</button>
              </p>
            )}
            {mode === 'register' && (
              <p className="text-gray-500 ">
                Already have an account?{' '}
                <button
  onClick={() => switchMode('login')}
  className="text-orange-500 hover:text-orange-600 font-medium cursor-hover transition-colors"
>
  Sign in
</button>
              </p>
            )}
            {mode === 'reset' && (
              <button onClick={() => switchMode('login')} className="text-copper-500 hover:text-copper-400 font-medium flex items-center justify-center gap-2 cursor-hover">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </button>
            )}
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
  to="/"
  className="text-sm text-gray-500 hover:text-orange-500 transition-all duration-300 cursor-hover"
>
  ← Back to home
</Link>
          </div>
        </motion.div>
      </div>

      {/* Visual Side - Hidden on mobile */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(240, 128, 18, 0.1) 0%, rgba(247, 188, 115, 0.05) 100%)',
          }}
        />
        
        {/* Floating Elements */}
        <div className="relative z-10 text-center p-12">
          <motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ delay: 0.3, type: "spring" }}
  className="h-32 mx-auto mb-8 flex items-center justify-center"
>
  <img
    src="collabmindex.png"
    className="h-full object-contain drop-shadow-2xl"
  />
</motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Connect. Collaborate. Create.
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-gray-600 max-w-md"
          >
            Join thousands of problem owners and talented builders creating impact together.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
