import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Brain, Menu, X, Bell, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export const GlassNavbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
      {/* Inflated Claymorphism Capsule Outer Shell */}
      <div className="bg-white/90 backdrop-blur-[20px] -webkit-backdrop-blur-[20px] border border-white rounded-full px-4 sm:px-6 py-2.5 shadow-[0_16px_36px_rgba(59,130,246,0.12),0_4px_12px_rgba(0,0,0,0.03),inset_0_2.5px_3px_0_rgba(255,255,255,1),inset_0_-3px_6px_0_rgba(219,234,254,0.7)] flex items-center justify-between relative overflow-hidden">
        
        {/* Top Glare Reflection */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-full z-0 opacity-70"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.90) 0%, rgba(255, 255, 255, 0) 100%)'
          }}
        />

        {/* Brand Logo Left */}
        <Link to="/" className="relative z-10 flex items-center space-x-3 group flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#60A5FA] border border-white p-0.5 shadow-[0_6px_16px_rgba(59,130,246,0.30),inset_0_1.5px_2px_rgba(255,255,255,0.8)] group-hover:scale-105 transition-transform flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="font-display font-extrabold text-base text-[#0F172A] tracking-tight uppercase flex items-center gap-1">
              Alzheimer's <span className="text-[#3B82F6]">AI</span>
            </span>
            <span className="block text-[8px] font-extrabold text-[#64748B] tracking-wider uppercase">Neuro-Diagnostic Medical System</span>
          </div>
        </Link>

        {/* Claymorphism Navigation Segment Pill */}
        <nav className="relative z-10 hidden xl:flex items-center bg-[#F1F5F9]/80 border border-white/80 rounded-full p-1.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-4 py-2 rounded-full text-xs font-extrabold transition-all duration-200 select-none flex-shrink-0"
              >
                {active && (
                  <motion.div
                    layoutId="activeClayPill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] border border-white shadow-[inset_0_2px_3px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(191,219,254,0.8),0_4px_12px_rgba(59,130,246,0.15)]"
                    transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                  />
                )}
                <span className={`relative z-10 ${active ? 'text-[#2563EB] font-extrabold drop-shadow-xs' : 'text-[#475569] font-bold hover:text-[#2563EB]'}`}>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Notification, Dark Mode Toggle & Profile */}
        <div className="relative z-10 hidden lg:flex items-center space-x-2.5 flex-shrink-0">
          
          {/* Notification Icon */}
          <button
            type="button"
            title="Notifications"
            className="w-9 h-9 rounded-full bg-[#F1F5F9]/90 border border-white flex items-center justify-center text-[#475569] hover:bg-white hover:text-[#3B82F6] transition-all shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.04)] relative cursor-pointer"
          >
            <Bell className="w-4 h-4 text-[#475569]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle Theme"
            className="w-9 h-9 rounded-full bg-[#F1F5F9]/90 border border-white flex items-center justify-center text-[#475569] hover:bg-white hover:text-[#8B5CF6] transition-all shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.04)] cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-[#F59E0B]" /> : <Moon className="w-4 h-4 text-[#475569]" />}
          </button>

          {/* User Status Pill */}
          <div className="bg-[#F1F5F9]/90 border border-white rounded-full px-3.5 py-1.5 flex items-center space-x-2 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.04)]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            <span className="text-xs font-extrabold text-[#0F172A] tracking-wide">
              {user ? user.full_name : 'System Administrator'}
            </span>
          </div>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="relative z-10 xl:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-[#F1F5F9]/90 border border-white text-[#0F172A] shadow-sm cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#0F172A]" /> : <Menu className="w-5 h-5 text-[#0F172A]" />}
          </button>
        </div>

      </div>

      {/* Mobile Clay Dropdown Drawer */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          className="xl:hidden mt-3 bg-white/95 backdrop-blur-[20px] rounded-[28px] p-4 space-y-1.5 border border-white shadow-[0_16px_36px_rgba(59,130,246,0.14)]"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-full text-sm font-bold transition-all ${
                isActive(link.path)
                  ? 'bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] text-[#2563EB] shadow-sm border border-white font-extrabold'
                  : 'text-[#475569] font-bold hover:bg-[#F1F5F9] hover:text-[#2563EB]'
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
