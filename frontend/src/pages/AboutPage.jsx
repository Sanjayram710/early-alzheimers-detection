import React from 'react';
import { Brain, Cpu, Database, ShieldCheck, Layers, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { ClayCard } from '../components/clay/ClayCard';

export const AboutPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto px-4 py-8 space-y-10"
    >
      <div className="text-center space-y-3">
        <h1 className="font-display text-3xl sm:text-[42px] leading-tight font-extrabold text-[#1F2937] tracking-tight">
          System Architecture & Research
        </h1>
        <p className="text-[#6B7280] text-sm sm:text-base font-medium max-w-2xl mx-auto">
          Technical specifications for AI-based early Alzheimer's disease classification using deep convolutional networks and explainable AI.
        </p>
      </div>

      <DisclaimerBanner />

      {/* Core Technical Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ClayCard padding="p-7" className="space-y-4">
          <div className="flex items-center space-x-3 text-[#6D5EF5]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-[#EEF2FF] border border-white/80 p-0.5 shadow-[4px_4px_10px_rgba(163,177,198,0.3)] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6D5EF5] to-[#8E82FF] flex items-center justify-center text-white">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <h2 className="font-display font-bold text-xl text-[#1F2937]">Model Architectures</h2>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#6B7280] font-medium leading-relaxed">
            <li><strong className="text-[#1F2937]">Custom Baseline CNN:</strong> Conv2D → ReLU → MaxPool → BatchNorm → Dropout → Dense Softmax.</li>
            <li><strong className="text-[#1F2937]">Transfer Learning Backbones:</strong> ResNet50, EfficientNetB0, DenseNet121, MobileNetV2.</li>
            <li><strong className="text-[#1F2937]">Vision Transformer (ViT):</strong> Multi-head self-attention patch encoder module.</li>
          </ul>
        </ClayCard>

        <ClayCard padding="p-7" className="space-y-4">
          <div className="flex items-center space-x-3 text-[#8E82FF]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-[#EEF2FF] border border-white/80 p-0.5 shadow-[4px_4px_10px_rgba(163,177,198,0.3)] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8E82FF] to-[#6D5EF5] flex items-center justify-center text-white">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <h2 className="font-display font-bold text-xl text-[#1F2937]">Dataset Ingestion</h2>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#6B7280] font-medium leading-relaxed">
            <li><strong className="text-[#1F2937]">Public Datasets:</strong> Integrated ingestion from ADNI, OASIS, AIBL, and Kaggle.</li>
            <li><strong className="text-[#1F2937]">Medical Formats:</strong> Native parsing of DICOM (.dcm), NIfTI (.nii), PNG, and JPG.</li>
            <li><strong className="text-[#1F2937]">Patient Leakage Prevention:</strong> Stratified patient-aware splits (70% train / 15% val / 15% test).</li>
          </ul>
        </ClayCard>
      </div>
    </motion.div>
  );
};
