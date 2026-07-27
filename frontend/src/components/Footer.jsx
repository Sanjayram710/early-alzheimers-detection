import React from 'react';
import { Brain, ShieldAlert, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Brain className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold text-slate-300">
              AI-Based Early Alzheimer's Disease Detection System
            </span>
          </div>

          <div className="text-xs text-slate-500 flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>Research & Clinical Decision Support Tool. Not a Certified Diagnostic Device.</span>
          </div>

          <div className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Final Year Engineering Project. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
