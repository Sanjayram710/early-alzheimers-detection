import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, ArrowUpRight, Zap, Users, Shield, Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassButton } from '../components/glass/GlassButton';

export const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8"
    >
      {/* Hero Outer Glass Container */}
      <div className="relative rounded-[36px] border border-white/35 bg-white/22 backdrop-blur-[30px] -webkit-backdrop-blur-[30px] p-6 sm:p-12 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.6),0_12px_40px_rgba(31,38,135,0.10)] overflow-hidden">
        
        {/* Specular Top Sheen */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-[inherit] z-0"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.05) 60%, rgba(255, 255, 255, 0) 100%)'
          }}
        />

        {/* Ambient Soft Lighting Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0 w-[600px] h-[600px] bg-[#6D5EF5]/18 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute top-10 right-10 -z-0 w-[400px] h-[400px] bg-[#06B6D4]/18 rounded-full blur-[100px] pointer-events-none" />

        {/* Central Viewport Glass Portal Window */}
        <div className="relative z-10 max-w-2xl mx-auto my-4 sm:my-8 bg-white/28 backdrop-blur-[35px] -webkit-backdrop-blur-[35px] border border-white/45 rounded-[48px] p-8 sm:p-14 text-center flex flex-col items-center justify-center shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.8),0_20px_50px_rgba(31,38,135,0.15)]">
          
          {/* Specular Light Reflection */}
          <div 
            className="absolute inset-0 pointer-events-none rounded-[inherit] z-0"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 100%)'
            }}
          />

          <div className="relative z-10 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/30 backdrop-blur-[15px] border border-white/50 text-[#6D5EF5] text-xs font-extrabold uppercase tracking-widest mb-6 shadow-sm">
            <Brain className="w-4 h-4 text-[#6D5EF5]" />
            <span>AI Neuro-Diagnostic Platform</span>
          </div>

          <h1 className="relative z-10 font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.1] mb-6">
            Experience AI Diagnosis <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D5EF5] via-[#8B5CF6] to-[#4A3BC3]">
              Like Never Before
            </span>
          </h1>

          <p className="relative z-10 text-[#6B7280] text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-8 font-semibold">
            From structural brain MRI scans to Grad-CAM heatmaps and clinical decision support, we create AI diagnostics that feel effortless and precise.
          </p>

          <div className="relative z-10">
            <Link to="/upload">
              <GlassButton variant="primary" size="lg" icon={ArrowUpRight}>
                Explore MRI Analysis
              </GlassButton>
            </Link>
          </div>
        </div>

        {/* Floating Feature Glass Cards */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 sm:mt-12">
          
          {/* Feature 1 */}
          <GlassCard padding="p-8">
            <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-[15px] border border-white/40 p-1 shadow-md mb-5 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6D5EF5] to-[#8B5CF6] flex items-center justify-center text-white shadow-inner">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-display text-xl font-bold text-[#111827] mb-2">
              Authentic Clinical Precision
            </h3>
            <p className="text-[#6B7280] text-xs sm:text-sm leading-relaxed font-semibold">
              Detect subtle structural hippocampal changes, cortical atrophy, and early stage indicators with expert deep learning models trained on benchmark datasets.
            </p>
          </GlassCard>

          {/* Feature 2 */}
          <GlassCard padding="p-8">
            <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-[15px] border border-white/40 p-1 shadow-md mb-5 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#22C55E] to-[#4ADE80] flex items-center justify-center text-white shadow-inner">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-display text-xl font-bold text-[#111827] mb-2">
              Stress-Free Every Step
            </h3>
            <p className="text-[#6B7280] text-xs sm:text-sm leading-relaxed font-semibold">
              From DICOM/NIfTI ingestion to automated PDF report generation, we handle every detail so medical specialists can focus on care.
            </p>
          </GlassCard>

        </div>

        {/* Disclaimer Banner */}
        <div className="relative z-10 pt-8 max-w-4xl mx-auto">
          <DisclaimerBanner />
        </div>

      </div>
    </motion.div>
  );
};
