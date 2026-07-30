import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, LogIn, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassInput } from '../components/glass/GlassInput';
import { GlassButton } from '../components/glass/GlassButton';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[80vh] flex items-center justify-center px-4 py-8"
    >
      <GlassCard padding="p-8 sm:p-10" className="w-full max-w-md space-y-7" hoverEffect={false}>
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-white/60 backdrop-blur-[15px] border border-white/60 p-1 shadow-md flex items-center justify-center mx-auto">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#6D5EF5] to-[#8B5CF6] flex items-center justify-center text-white shadow-inner">
              <Brain className="w-6 h-6" />
            </div>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Sign In to Alzheimer's AI
          </h2>
          <p className="text-xs font-semibold text-[#6B7280]">
            Access decision support platform, MRI history, and reports
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-[18px] bg-[#FEE2E2]/80 backdrop-blur-[15px] border border-[#FCA5A5] text-[#991B1B] text-xs font-bold flex items-center space-x-2 shadow-sm">
            <AlertCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <GlassInput
            label="Email Address"
            icon={Mail}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="doctor@hospital.org"
          />

          <GlassInput
            label="Password"
            icon={Lock}
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <GlassButton
            type="submit"
            variant="primary"
            disabled={loading}
            icon={loading ? null : LogIn}
            className="w-full py-3.5 text-sm font-bold"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </GlassButton>
        </form>

        <div className="text-center text-xs font-semibold text-[#6B7280]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#6D5EF5] font-bold hover:underline">
            Register here
          </Link>
        </div>
      </GlassCard>
    </motion.div>
  );
};
