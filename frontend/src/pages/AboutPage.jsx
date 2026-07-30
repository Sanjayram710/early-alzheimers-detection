import React from 'react';
import { Cpu, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { GlassCard } from '../components/glass/GlassCard';

export const AboutPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto px-4 py-8 space-y-10"
    >
      <div className="text-center space-y-3">
        <h1 className="font-display text-3xl sm:text-[48px] leading-tight font-extrabold text-[#111827] tracking-tight">
          System Architecture & Research
        </h1>
        <p className="text-[#6B7280] text-sm sm:text-base font-semibold max-w-2xl mx-auto">
          Technical specifications for AI-based early Alzheimer's disease classification using deep convolutional networks and explainable AI.
        </p>
      </div>

      <DisclaimerBanner />

      {/* Core Technical Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard padding="p-7" className="space-y-4">
          <div className="flex items-center space-x-3 text-[#6D5EF5]">
            <div className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-[15px] border border-white/60 p-0.5 shadow-sm flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6D5EF5] to-[#8B5CF6] flex items-center justify-center text-white">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <h2 className="font-display font-bold text-xl text-[#111827]">Model Architectures</h2>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#6B7280] font-semibold leading-relaxed">
            <li><strong className="text-[#111827]">NeuroDxNet CNN:</strong> Conv2D → ReLU → MaxPool → BatchNorm → Dropout → Dense Softmax.</li>
            <li><strong className="text-[#111827]">Transfer Learning Backbones:</strong> ResNet50, EfficientNetB0, DenseNet121, MobileNetV2.</li>
            <li><strong className="text-[#111827]">Vision Transformer (ViT):</strong> Multi-head self-attention patch encoder module.</li>
          </ul>
        </GlassCard>

        <GlassCard padding="p-7" className="space-y-4">
          <div className="flex items-center space-x-3 text-[#8B5CF6]">
            <div className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-[15px] border border-white/60 p-0.5 shadow-sm flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#6D5EF5] flex items-center justify-center text-white">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <h2 className="font-display font-bold text-xl text-[#111827]">Dataset Ingestion</h2>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#6B7280] font-semibold leading-relaxed">
            <li><strong className="text-[#111827]">Public Datasets:</strong> Integrated ingestion from ADNI, OASIS, AIBL, and Kaggle.</li>
            <li><strong className="text-[#111827]">Medical Formats:</strong> Native parsing of DICOM (.dcm), NIfTI (.nii), PNG, and JPG.</li>
            <li><strong className="text-[#111827]">Patient Leakage Prevention:</strong> Stratified patient-aware splits (70% train / 15% val / 15% test).</li>
          </ul>
        </GlassCard>
      </div>
    </motion.div>
  );
};
