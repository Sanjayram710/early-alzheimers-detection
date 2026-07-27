import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, ShieldCheck, Zap, BarChart3, ArrowRight, Eye, FileCheck, Layers } from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const HomePage = () => {
  return (
    <div className="space-y-16 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <section className="relative text-center space-y-8 pt-8 pb-12 overflow-hidden">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-2xl"></div>
        </div>

        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Brain className="w-4 h-4" />
          <span>Final Year Engineering Research Project</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          AI-Based Early <span className="gradient-text">Alzheimer's Disease</span> Detection Using MRI Images
        </h1>

        <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Deep learning classification pipeline providing instant disease stage predictions, Grad-CAM visual explainability heatmaps, and downloadable clinical PDF reports.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/upload"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 group"
          >
            <span>Upload Brain MRI</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/about"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all flex items-center justify-center space-x-2"
          >
            <span>System Architecture</span>
          </Link>
        </div>

        <div className="max-w-3xl mx-auto pt-6">
          <DisclaimerBanner />
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Zap className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="font-display text-xl font-bold text-white">Multi-Class DL Inference</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Classifies MRI scans into 4 stages: Non Demented, Very Mild Demented, Mild Demented, and Moderate Demented.
          </p>
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
            <Eye className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="font-display text-xl font-bold text-white">Grad-CAM Explainability</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Generates high-resolution heatmaps illustrating critical anatomical brain regions driving prediction confidence.
          </p>
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <FileCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="font-display text-xl font-bold text-white">Clinical PDF Reports</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Generates standardized clinical decision-support PDF reports with patient metadata, image overlays, and disclaimers.
          </p>
        </div>
      </section>

    </div>
  );
};
