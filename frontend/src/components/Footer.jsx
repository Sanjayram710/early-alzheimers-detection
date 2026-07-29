import React from 'react';
import { Brain, ShieldAlert, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-white to-[#EEF2FF] border border-white/80 rounded-[28px] p-6 shadow-[10px_10px_24px_rgba(163,177,198,0.3),-8px_-8px_20px_rgba(255,255,255,0.95)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[#6B7280]">
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6D5EF5] to-[#8E82FF] flex items-center justify-center text-white shadow-inner">
              <Brain className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#1F2937]">
              AI-Based Early Alzheimer's Disease Detection System
            </span>
          </div>

          <div className="text-xs flex items-center space-x-2 bg-[#F4F6FB] px-3.5 py-1.5 rounded-full border border-white/80 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.2),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]">
            <ShieldAlert className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
            <span className="font-semibold text-[#1F2937]">Research & Clinical Decision Support Tool</span>
          </div>

          <div className="text-xs font-medium text-[#6B7280]">
            &copy; {new Date().getFullYear()} Final Year Project. All rights reserved.
          </div>

        </div>
      </div>
    </footer>
  );
};
