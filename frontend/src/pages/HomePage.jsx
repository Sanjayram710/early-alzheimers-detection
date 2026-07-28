import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, ArrowUpRight, Zap, Users, Eye, Shield, Activity } from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const HomePage = () => {
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Outer Main Container Card matching reference image layout */}
      <div className="relative rounded-[36px] border border-blue-500/20 bg-slate-950/90 p-6 sm:p-12 shadow-[0_0_90px_rgba(37,99,235,0.15)] overflow-hidden">
        
        {/* Background Ambient Glow Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-10 right-10 -z-0 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Central Portal Viewport Window */}
        <div className="relative z-10 max-w-2xl mx-auto my-4 sm:my-8 portal-window rounded-[50px] p-8 sm:p-16 text-center flex flex-col items-center justify-center transition-all duration-300">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-widest mb-6 shadow-inner">
            <Brain className="w-4 h-4 text-blue-400" />
            <span>AI Neuro-Diagnostic Platform</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
            Experience AI Diagnosis <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-400">
              Like Never Before
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-8 font-medium">
            From structural brain MRI scans to Grad-CAM heatmaps and clinical decision support, we create AI diagnostics that feel effortless and precise.
          </p>

          <Link
            to="/upload"
            className="group px-8 py-3.5 rounded-full font-bold text-slate-950 bg-white hover:bg-slate-100 shadow-2xl shadow-blue-500/30 transition-all duration-300 flex items-center space-x-3 hover:scale-105"
          >
            <span className="text-sm">Explore Analysis</span>
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white group-hover:rotate-45 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* Floating Bottom Cards */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 sm:mt-12">
          
          {/* Bottom Left Card */}
          <div className="glass-card-sunrock p-6 sm:p-8 rounded-3xl text-left relative overflow-hidden group">
            <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-blue-600 mb-5 shadow-lg shadow-white/10 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-blue-600 fill-blue-600" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Authentic Clinical Precision
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Detect subtle structural hippocampal changes, cortical atrophy, and early stage indicators with expert deep learning models trained on benchmark datasets.
            </p>
          </div>

          {/* Bottom Right Card */}
          <div className="glass-card-sunrock p-6 sm:p-8 rounded-3xl text-left relative overflow-hidden group">
            <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-blue-600 mb-5 shadow-lg shadow-white/10 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Stress-Free Every Step
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              From DICOM/NIfTI ingestion to automated PDF report generation, we handle every detail so medical specialists can focus on care.
            </p>
          </div>

        </div>

        {/* Disclaimer Footer Banner */}
        <div className="relative z-10 pt-8 max-w-4xl mx-auto">
          <DisclaimerBanner />
        </div>

      </div>
    </div>
  );
};
