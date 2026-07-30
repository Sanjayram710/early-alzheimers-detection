import React from 'react';
import { Brain, ShieldAlert } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white/55 backdrop-blur-[28px] -webkit-backdrop-blur-[28px] border border-white/45 rounded-[28px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[#6B7280]">
          
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#6D5EF5] to-[#8B5CF6] flex items-center justify-center text-white shadow-md">
              <Brain className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-[#111827]">
              AI-Based Early Alzheimer's Disease Detection System
            </span>
          </div>

          <div className="text-xs flex items-center space-x-2 bg-white/60 backdrop-blur-[15px] px-4 py-1.5 rounded-full border border-white/60 shadow-sm">
            <ShieldAlert className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
            <span className="font-bold text-[#111827]">Research & Clinical Decision Support Tool</span>
          </div>

          <div className="text-xs font-semibold text-[#6B7280]">
            &copy; {new Date().getFullYear()} Final Year Capstone Project. All rights reserved.
          </div>

        </div>
      </div>
    </footer>
  );
};
