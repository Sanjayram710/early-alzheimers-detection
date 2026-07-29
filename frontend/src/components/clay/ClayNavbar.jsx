import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Brain, Menu, X, Shield, Activity, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const ClayNavbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Upload MRI', path: '/upload' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'History', path: '/history' },
    { name: 'Reports', path: '/reports' },
    { name: 'Admin', path: '/admin' },
    { name: 'About us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-4 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Unified Solid Floating Clay Navbar Container to prevent text shuffling/overlapping on scroll */}
      <div className="bg-gradient-to-r from-white via-[#F4F6FB] to-white border border-white/90 rounded-full px-5 py-2.5 shadow-[12px_12px_28px_rgba(163,177,198,0.35),-10px_-10px_24px_rgba(255,255,255,0.95)] flex items-center justify-between backdrop-blur-md">
        
        {/* Brand Logo inside circular clay badge */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-[#EEF2FF] border border-white/80 p-0.5 shadow-[4px_4px_10px_rgba(163,177,198,0.3)] group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6D5EF5] to-[#8E82FF] flex items-center justify-center text-white shadow-inner">
              <Brain className="w-4.5 h-4.5 text-white" />
            </div>
          </div>
          <div>
            <span className="font-display font-extrabold text-base text-[#1F2937] tracking-tight uppercase flex items-center gap-1">
              Alzheimer's <span className="text-[#6D5EF5]">AI</span>
            </span>
            <span className="block text-[8px] font-bold text-[#6B7280] tracking-wider uppercase">Neuro-Diagnostic System</span>
          </div>
        </Link>

        {/* Center Floating Clay Pill Navigation */}
        <nav className="hidden md:flex items-center bg-[#F4F6FB] border border-white/70 rounded-full px-1.5 py-1 shadow-[inset_3px_3px_6px_rgba(163,177,198,0.25),inset_-3px_-3px_6px_rgba(255,255,255,0.9)]">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200"
              >
                {active && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-gradient-to-r from-[#6D5EF5] to-[#8E82FF] rounded-full shadow-[4px_4px_12px_rgba(109,94,245,0.4)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${active ? 'text-white font-bold' : 'text-[#6B7280] hover:text-[#1F2937]'}`}>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right User / System Status Pill */}
        <div className="hidden md:flex items-center">
          <div className="bg-[#F4F6FB] border border-white/70 rounded-full px-3.5 py-1.5 flex items-center space-x-2 shadow-[inset_3px_3px_6px_rgba(163,177,198,0.2),inset_-3px_-3px_6px_rgba(255,255,255,0.9)]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-xs font-bold text-[#1F2937] tracking-wide">
              {user ? user.full_name : 'System Active'}
            </span>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-[#F4F6FB] border border-white/70 shadow-[inset_2px_2px_4px_rgba(163,177,198,0.2)] text-[#1F2937]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-3 bg-gradient-to-br from-white to-[#EEF2FF] rounded-[24px] p-4 space-y-2 border border-white/80 shadow-[12px_12px_28px_rgba(163,177,198,0.35),-10px_-10px_24px_rgba(255,255,255,0.95)]"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                isActive(link.path)
                  ? 'bg-[#6D5EF5] text-white shadow-md'
                  : 'text-[#6B7280] hover:bg-[#EEF2FF] hover:text-[#1F2937]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </motion.div>
      )}
    </header>
  );
};
