import React from 'react';
import { Mail, Github, BookOpen, ShieldAlert } from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const ContactPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl font-extrabold text-white">Project Support & Inquiry</h1>
        <p className="text-slate-400 text-sm">AI-Based Early Alzheimer's Disease Detection - Engineering Project</p>
      </div>

      <DisclaimerBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3 text-blue-400">
            <BookOpen className="w-6 h-6" />
            <h3 className="font-display font-bold text-lg text-white">Academic Context</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            This application was engineered as a final-year B.Tech / B.E. Capstone Engineering project.
            Designed to demonstrate production-grade MLOps, deep learning inference, Grad-CAM explainability, and clinical web application standards.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3 text-purple-400">
            <Mail className="w-6 h-6" />
            <h3 className="font-display font-bold text-lg text-white">Contact & Contributions</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            For technical queries, dataset licensing, or architectural discussions, reach out through the project repository or academic team lead.
          </p>
        </div>
      </div>
    </div>
  );
};
