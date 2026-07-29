import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, ArrowUpRight, Zap, Users, Eye, Shield, Activity, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { ClayCard } from '../components/clay/ClayCard';
import { ClayButton } from '../components/clay/ClayButton';

export const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8"
    >
      {/* Hero Outer Container */}
      <div className="relative rounded-[36px] border border-white/80 bg-gradient-to-br from-white via-[#F8FAFC] to-[#EEF2FF] p-6 sm:p-12 shadow-[16px_16px_40px_rgba(163,177,198,0.35),-14px_-14px_32px_rgba(255,255,255,0.95)] overflow-hidden">
        
        {/* Background Ambient Lighting Blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0 w-[500px] h-[500px] bg-[#6D5EF5]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-10 right-10 -z-0 w-[300px] h-[300px] bg-[#8E82FF]/10 rounded-full blur-[90px] pointer-events-none" />

        {/* Central Viewport Portal Window */}
        <div className="relative z-10 max-w-2xl mx-auto my-4 sm:my-8 bg-gradient-to-br from-white to-[#EEF2FF] border border-white/90 rounded-[48px] p-8 sm:p-14 text-center flex flex-col items-center justify-center shadow-[12px_12px_28px_rgba(163,177,198,0.35),-10px_-10px_24px_rgba(255,255,255,0.95)]">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#F4F6FB] border border-white/80 text-[#6D5EF5] text-xs font-bold uppercase tracking-widest mb-6 shadow-[inset_2px_2px_4px_rgba(163,177,198,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]">
            <Brain className="w-4 h-4 text-[#6D5EF5]" />
            <span>AI Neuro-Diagnostic Platform</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F2937] tracking-tight leading-[1.1] mb-6">
            Experience AI Diagnosis <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D5EF5] via-[#8E82FF] to-[#4A3BC3]">
              Like Never Before
            </span>
          </h1>

          <p className="text-[#6B7280] text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-8 font-medium">
            From structural brain MRI scans to Grad-CAM heatmaps and clinical decision support, we create AI diagnostics that feel effortless and precise.
          </p>

          <Link to="/upload">
            <ClayButton variant="primary" size="lg" icon={ArrowUpRight}>
              Explore MRI Analysis
            </ClayButton>
          </Link>
        </div>

        {/* Floating Feature Clay Cards */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 sm:mt-12">
          
          {/* Feature 1 */}
          <ClayCard padding="p-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-[#EEF2FF] border border-white/80 p-1 shadow-[6px_6px_14px_rgba(163,177,198,0.3),-4px_-4px_10px_rgba(255,255,255,0.95)] mb-5 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6D5EF5] to-[#8E82FF] flex items-center justify-center text-white shadow-inner">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-display text-xl font-bold text-[#1F2937] mb-2">
              Authentic Clinical Precision
            </h3>
            <p className="text-[#6B7280] text-xs sm:text-sm leading-relaxed font-medium">
              Detect subtle structural hippocampal changes, cortical atrophy, and early stage indicators with expert deep learning models trained on benchmark datasets.
            </p>
          </ClayCard>

          {/* Feature 2 */}
          <ClayCard padding="p-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-[#EEF2FF] border border-white/80 p-1 shadow-[6px_6px_14px_rgba(163,177,198,0.3),-4px_-4px_10px_rgba(255,255,255,0.95)] mb-5 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#22C55E] to-[#4ADE80] flex items-center justify-center text-white shadow-inner">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-display text-xl font-bold text-[#1F2937] mb-2">
              Stress-Free Every Step
            </h3>
            <p className="text-[#6B7280] text-xs sm:text-sm leading-relaxed font-medium">
              From DICOM/NIfTI ingestion to automated PDF report generation, we handle every detail so medical specialists can focus on care.
            </p>
          </ClayCard>

        </div>

        {/* Disclaimer Banner */}
        <div className="relative z-10 pt-8 max-w-4xl mx-auto">
          <DisclaimerBanner />
        </div>

      </div>
    </motion.div>
  );
};
