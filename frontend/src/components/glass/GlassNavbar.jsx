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
      {/* Floating Translucent Liquid Glass Outer Shell */}
      <div className="bg-white/22 backdrop-blur-[30px] -webkit-backdrop-blur-[30px] border border-white/50 rounded-full px-4 sm:px-6 py-2.5 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_15px_40px_rgba(31,38,135,0.12)] flex items-center justify-between relative overflow-hidden">
        
        {/* Top Specular Light Reflection Layer */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-full z-0"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0) 100%)'
          }}
        />

        {/* Brand Logo Left */}
        <Link to="/" className="relative z-10 flex items-center space-x-3 group flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#4F8EF7] via-[#5EA2FF] to-[#6D5EF5] border border-white/60 p-0.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_6px_16px_rgba(79,142,247,0.35)] group-hover:scale-105 transition-transform flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="font-display font-extrabold text-base text-[#111827] tracking-tight uppercase flex items-center gap-1">
              Alzheimer's <span className="text-[#4F8EF7]">AI</span>
            </span>
            <span className="block text-[8px] font-extrabold text-[#6B7280] tracking-wider uppercase">Apple Liquid Diagnostics</span>
          </div>
        </Link>

        {/* Center Liquid Glass Motion Design Pill Segment Control */}
        <nav className="relative z-10 hidden xl:flex items-center bg-white/18 backdrop-blur-[25px] border border-white/40 rounded-full p-1.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05),0_4px_16px_rgba(31,38,135,0.08)]">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 select-none flex-shrink-0"
              >
                {active && (
                  <motion.div
                    layoutId="activeGlassPill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#4F8EF7] to-[#6D5EF5] border border-white/50 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.7),0_8px_24px_rgba(79,142,247,0.45)]"
                    transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                  >
                    {/* Liquid Glass Top Light Specular Sheen */}
                    <div 
                      className="absolute inset-0 pointer-events-none rounded-full"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 70%)'
                      }}
                    />
                  </motion.div>
                )}
                <span className={`relative z-10 ${active ? 'text-white font-extrabold drop-shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'}`}>
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
            className="w-9 h-9 rounded-full bg-white/28 backdrop-blur-[15px] border border-white/50 flex items-center justify-center text-[#111827] hover:bg-white/45 hover:text-[#4F8EF7] transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle Theme"
            className="w-9 h-9 rounded-full bg-white/28 backdrop-blur-[15px] border border-white/50 flex items-center justify-center text-[#111827] hover:bg-white/45 hover:text-[#6D5EF5] transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-[#F59E0B]" /> : <Moon className="w-4 h-4 text-[#6B7280]" />}
          </button>

          {/* User Status Pill */}
          <div className="bg-white/28 backdrop-blur-[15px] border border-white/50 rounded-full px-3.5 py-1.5 flex items-center space-x-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-xs font-extrabold text-[#111827] tracking-wide">
              {user ? user.full_name : 'System Active'}
            </span>
          </div>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="relative z-10 xl:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-white/30 backdrop-blur-[15px] border border-white/50 text-[#111827] shadow-sm cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Liquid Glass Dropdown Drawer */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          className="xl:hidden mt-3 bg-white/35 backdrop-blur-[35px] -webkit-backdrop-blur-[35px] rounded-[28px] p-4 space-y-1.5 border border-white/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_15px_45px_rgba(31,38,135,0.18)]"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-full text-sm font-bold transition-all ${
                isActive(link.path)
                  ? 'bg-gradient-to-r from-[#4F8EF7] to-[#6D5EF5] text-white shadow-md border border-white/40'
                  : 'text-[#6B7280] hover:bg-white/30 hover:text-[#111827]'
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
