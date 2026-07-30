import React from 'react';
import { Mail, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { GlassCard } from '../components/glass/GlassCard';

export const ContactPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8 space-y-8"
    >
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl sm:text-[48px] leading-tight font-extrabold text-[#111827] tracking-tight">
          Project Support & Inquiry
        </h1>
        <p className="text-[#6B7280] text-sm sm:text-base font-semibold">
          AI-Based Early Alzheimer's Disease Detection System - Capstone Engineering Project
        </p>
      </div>

      <DisclaimerBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard padding="p-7" className="space-y-4">
          <div className="flex items-center space-x-3 text-[#6D5EF5]">
            <div className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-[15px] border border-white/60 p-0.5 shadow-sm flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6D5EF5] to-[#8B5CF6] flex items-center justify-center text-white">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <h3 className="font-display font-bold text-lg text-[#111827]">Academic Context</h3>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed font-semibold">
            This application was engineered as a final-year B.Tech / B.E. Capstone Engineering project.
            Designed to demonstrate production-grade MLOps, deep learning inference, Grad-CAM explainability, and clinical web application standards.
          </p>
        </GlassCard>

        <GlassCard padding="p-7" className="space-y-4">
          <div className="flex items-center space-x-3 text-[#8B5CF6]">
            <div className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-[15px] border border-white/60 p-0.5 shadow-sm flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#6D5EF5] flex items-center justify-center text-white">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <h3 className="font-display font-bold text-lg text-[#111827]">Contact & Contributions</h3>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed font-semibold">
            For technical queries, dataset licensing, or architectural discussions, reach out through the project repository or academic team lead.
          </p>
        </GlassCard>
      </div>
    </motion.div>
  );
};
