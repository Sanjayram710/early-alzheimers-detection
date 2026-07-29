import React from 'react';
import { Mail, Github, BookOpen, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { ClayCard } from '../components/clay/ClayCard';

export const ContactPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8 space-y-8"
    >
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl sm:text-[42px] leading-tight font-extrabold text-[#1F2937] tracking-tight">
          Project Support & Inquiry
        </h1>
        <p className="text-[#6B7280] text-sm sm:text-base font-medium">
          AI-Based Early Alzheimer's Disease Detection System - Capstone Engineering Project
        </p>
      </div>

      <DisclaimerBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ClayCard padding="p-7" className="space-y-4">
          <div className="flex items-center space-x-3 text-[#6D5EF5]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-[#EEF2FF] border border-white/80 p-0.5 shadow-[4px_4px_10px_rgba(163,177,198,0.3)] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6D5EF5] to-[#8E82FF] flex items-center justify-center text-white">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <h3 className="font-display font-bold text-lg text-[#1F2937]">Academic Context</h3>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed font-medium">
            This application was engineered as a final-year B.Tech / B.E. Capstone Engineering project.
            Designed to demonstrate production-grade MLOps, deep learning inference, Grad-CAM explainability, and clinical web application standards.
          </p>
        </ClayCard>

        <ClayCard padding="p-7" className="space-y-4">
          <div className="flex items-center space-x-3 text-[#8E82FF]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-[#EEF2FF] border border-white/80 p-0.5 shadow-[4px_4px_10px_rgba(163,177,198,0.3)] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8E82FF] to-[#6D5EF5] flex items-center justify-center text-white">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <h3 className="font-display font-bold text-lg text-[#1F2937]">Contact & Contributions</h3>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed font-medium">
            For technical queries, dataset licensing, or architectural discussions, reach out through the project repository or academic team lead.
          </p>
        </ClayCard>
      </div>
    </motion.div>
  );
};
