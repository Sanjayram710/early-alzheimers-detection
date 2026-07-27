import React from 'react';
import { Brain, Cpu, Database, ShieldCheck, Layers, GitBranch } from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">System Architecture & Research</h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Technical specifications for AI-based early Alzheimer's disease classification using deep convolutional networks and explainable AI.
        </p>
      </div>

      <DisclaimerBanner />

      {/* Core Technical Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3 text-blue-400">
            <Cpu className="w-6 h-6" />
            <h2 className="font-display font-bold text-xl text-white">Model Architectures</h2>
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><strong className="text-white">Custom Baseline CNN:</strong> Conv2D → ReLU → MaxPool → BatchNorm → Dropout → Dense Softmax.</li>
            <li><strong className="text-white">Transfer Learning Backbones:</strong> ResNet50, EfficientNetB0, DenseNet121, MobileNetV2.</li>
            <li><strong className="text-white">Vision Transformer (ViT):</strong> Multi-head self-attention patch encoder module.</li>
          </ul>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3 text-purple-400">
            <Database className="w-6 h-6" />
            <h2 className="font-display font-bold text-xl text-white">Dataset Ingestion</h2>
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><strong className="text-white">Public Datasets:</strong> Integrated ingestion from ADNI, OASIS, AIBL, and Kaggle.</li>
            <li><strong className="text-white">Medical Formats:</strong> Native parsing of DICOM (.dcm), NIfTI (.nii), PNG, and JPG.</li>
            <li><strong className="text-white">Patient Leakage Prevention:</strong> Stratified patient-aware splits (70% train / 15% val / 15% test).</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
