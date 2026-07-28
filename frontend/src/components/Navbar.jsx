import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Menu, X, Shield, Activity } from 'lucide-react';

export const Navbar = () => {
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
      <div className="flex items-center justify-between h-16">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <span className="font-display font-black text-lg text-white tracking-widest uppercase">
              Alzheimer's<span className="text-blue-400">AI</span>
            </span>
            <span className="block text-[9px] font-bold text-slate-400 tracking-wider uppercase">Detection System</span>
          </div>
        </Link>

        {/* Center Floating Glass Pill Container */}
        <div className="hidden md:flex items-center glass-pill-nav rounded-full px-2 py-1.5 shadow-2xl">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-white text-slate-950 shadow-md shadow-white/10 scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right Menu Action Pill */}
        <div className="hidden md:flex items-center">
          <div className="glass-pill-nav rounded-full px-4 py-1.5 flex items-center space-x-2 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-200 tracking-wide">
              {user ? user.full_name : 'System Active'}
            </span>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-full glass-pill-nav text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 glass-card-sunrock rounded-3xl p-4 space-y-2 border border-white/10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-white text-slate-950 font-bold'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
