import React from 'react';
import { Brain, ShieldAlert } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Inflated Claymorphism Footer Container with Black Border Layout Line */}
      <div className="max-w-7xl mx-auto bg-white/94 backdrop-blur-[20px] -webkit-backdrop-blur-[20px] border-2 border-black rounded-[32px] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.18),0_8px_16px_rgba(0,0,0,0.03),inset_0_2px_4px_0_rgba(255,255,255,1),inset_0_-4px_8px_0_rgba(219,234,254,0.7)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[#475569]">
          
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#60A5FA] p-0.5 border border-white shadow-[0_6px_16px_rgba(59,130,246,0.25)] flex items-center justify-center text-white">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-[#0F172A] tracking-tight">
              AI-Based Early Alzheimer's Disease Detection System
            </span>
          </div>

          <div className="text-xs flex items-center space-x-2 bg-white/90 backdrop-blur-[15px] px-4 py-1.5 rounded-full border border-black/30 shadow-sm">
            <ShieldAlert className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
            <span className="font-extrabold text-[#0F172A]">Research & Clinical Decision Support Tool</span>
          </div>

          <div className="text-xs font-bold text-[#475569]">
            &copy; {new Date().getFullYear()} Final Year Capstone Project. All rights reserved.
          </div>

        </div>
      </div>
    </footer>
  );
};
