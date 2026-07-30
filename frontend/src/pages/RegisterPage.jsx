import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Lock, Mail, User, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassInput } from '../components/glass/GlassInput';
import { GlassButton } from '../components/glass/GlassButton';

export const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(fullName, email, password, role);
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.detail || 'Failed to register account');
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
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#6D5EF5] flex items-center justify-center text-white shadow-inner">
              <UserPlus className="w-6 h-6" />
            </div>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Create Account
          </h2>
          <p className="text-xs font-semibold text-[#6B7280]">
            Register as a Researcher, Clinician, or Admin
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-[18px] bg-[#FEE2E2]/80 backdrop-blur-[15px] border border-[#FCA5A5] text-[#991B1B] text-xs font-bold flex items-center space-x-2 shadow-sm">
            <AlertCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <GlassInput
            label="Full Name"
            icon={User}
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Dr. Eleanor Vance"
          />

          <GlassInput
            label="Email Address"
            icon={Mail}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="eleanor@research.org"
          />

          <GlassInput
            label="Password"
            icon={Lock}
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <div className="space-y-1.5 w-full">
            <label className="block text-xs font-bold text-[#111827] ml-1 tracking-wide">
              Account Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-5 py-3.5 rounded-[20px] bg-white/60 backdrop-blur-[15px] text-sm text-[#111827] font-semibold shadow-[inset_0_2px_4px_rgba(17,24,39,0.03)] border border-white/60 focus:outline-none focus:border-[#6D5EF5] focus:bg-white/90 focus:ring-4 focus:ring-[#6D5EF5]/20 appearance-none cursor-pointer"
            >
              <option value="user">User / Clinician</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          <GlassButton
            type="submit"
            variant="primary"
            disabled={loading}
            icon={loading ? null : UserPlus}
            className="w-full py-3.5 text-sm font-bold mt-2"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </div>
            ) : (
              'Register Account'
            )}
          </GlassButton>
        </form>

        <div className="text-center text-xs font-semibold text-[#6B7280]">
          Already registered?{' '}
          <Link to="/login" className="text-[#6D5EF5] font-bold hover:underline">
            Sign in here
          </Link>
        </div>
      </GlassCard>
    </motion.div>
  );
};
