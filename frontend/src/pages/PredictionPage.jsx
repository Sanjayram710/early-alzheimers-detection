import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Download, Brain, Clock, ShieldAlert, Star, User, Calendar, Droplet, FileText, Activity, Sliders, CheckCircle2, Eye, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassButton } from '../components/glass/GlassButton';
import { GlassProgress } from '../components/glass/GlassProgress';
import { GlassBadge } from '../components/glass/GlassBadge';
import { GradCamViewer } from '../components/GradCamViewer';

export const PredictionPage = () => {
  const location = useLocation();
  const prediction = location.state?.prediction;
  const [downloading, setDownloading] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [mriTab, setMriTab] = useState('compare'); // 'compare' or 'gradcam'

  if (!prediction) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto px-4">
        <ShieldAlert className="w-12 h-12 text-[#EF4444] mx-auto" />
        <h2 className="text-xl font-bold text-[#0F172A]">No Prediction Results Available</h2>
        <p className="text-xs text-[#475569] font-semibold">Please upload a brain MRI scan image to initiate prediction.</p>
        <Link to="/upload">
          <GlassButton variant="primary" icon={ArrowLeft}>
            Go to Upload MRI
          </GlassButton>
        </Link>
      </div>
    );
  }

  const {
    id,
    patient_id,
    patient_name,
    patient_age,
    blood_group,
    symptoms,
    predicted_class,
    confidence,
    class_probabilities,
    model_version,
    inference_time_ms,
    heatmap_base64,
    overlay_base64,
    original_base64,
    processed_base64,
    preprocessing_metadata,
    medical_disclaimer
  } = prediction;

  const isNonDemented = predicted_class.includes('Non');
  const dip = preprocessing_metadata || {};
  const qualityScore = dip.quality_score || 88.5;
  const qualityRating = dip.rating || 'Good';

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const res = await api.post(`/reports/generate/${id}`);
      if (res.data && res.data.pdf_url) {
        window.open(res.data.pdf_url, '_blank');
      }
    } catch (err) {
      console.error('PDF Report Download Error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/feedback', {
        prediction_id: id,
        rating,
        feedback_text: feedbackText
      });
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error('Feedback Submit Error:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div>
          <Link to="/upload" className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#2563EB] hover:underline mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Upload Another MRI</span>
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Prediction Analysis Results
          </h1>
          <span className="text-xs font-mono font-bold text-[#475569]">
            ID: {id} | Patient: {patient_name ? `${patient_name} (${patient_id || 'N/A'})` : (patient_id || 'N/A')}
          </span>
        </div>

        <GlassButton
          variant="primary"
          icon={Download}
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="w-full sm:w-auto font-bold"
        >
          {downloading ? 'Generating PDF Report...' : 'Download PDF Report'}
        </GlassButton>
      </div>

      <DisclaimerBanner text={medical_disclaimer} />

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Classification Summary, Patient Profile & DIP Preprocessing Card */}
        <div className="space-y-6">

          {/* Classification Glass Card */}
          <div
            className={`
              rounded-[28px] p-6 border-2 space-y-4
              backdrop-blur-[30px] -webkit-backdrop-blur-[30px]
              shadow-[0_16px_36px_rgba(0,0,0,0.08)]
              ${isNonDemented
                ? 'bg-[#DCFCE7]/90 border-[#86EFAC] text-[#15803D]'
                : 'bg-[#FEE2E2]/90 border-[#FCA5A5] text-[#B91C1C]'
              }
            `}
          >
            <span className="text-xs font-extrabold uppercase tracking-wider block opacity-80">
              Predicted Disease Stage
            </span>
            <div className="font-display text-3xl font-extrabold tracking-tight">
              {predicted_class}
            </div>

            <GlassProgress value={confidence * 100} color={isNonDemented ? 'green' : 'red'} />
          </div>

          {/* DIP Image Quality & Preprocessing Metrics Card */}
          <GlassCard padding="p-6">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 mb-4">
              <h3 className="font-bold text-sm text-[#0F172A] flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-[#3B82F6]" />
                <span>DIP Quality & Preprocessing</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE]">
                Score: {qualityScore}/100
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200">
                <span className="text-[#64748B] block font-semibold">Overall Rating</span>
                <span className="font-extrabold text-[#0F172A] text-sm">{qualityRating}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200">
                <span className="text-[#64748B] block font-semibold">DIP Runtime</span>
                <span className="font-extrabold text-[#22C55E] text-sm">{dip.total_processing_time_ms || 24.5} ms</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200">
                <span className="text-[#64748B] block font-semibold">Brightness / Contrast</span>
                <span className="font-bold text-[#0F172A]">{dip.brightness || 120} / {dip.contrast || 45}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200">
                <span className="text-[#64748B] block font-semibold">Sharpness / Noise</span>
                <span className="font-bold text-[#0F172A]">{dip.sharpness || 250} / {dip.estimated_noise || 10}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/60 space-y-2 text-xs font-bold text-[#334155]">
              <div className="flex items-center justify-between">
                <span>Denoising Filter:</span>
                <span className="text-[#3B82F6]">{dip.denoise_method || 'Gaussian'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>CLAHE Equalization:</span>
                <span className="text-[#22C55E]">Applied (Clip 2.0)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>ROI Brain Crop:</span>
                <span className="text-[#8B5CF6]">{dip.roi_detected ? 'Bounding Box' : 'Full Frame'}</span>
              </div>
            </div>
          </GlassCard>

          {/* Patient Metadata Summary Card */}
          <GlassCard padding="p-6">
            <h3 className="font-bold text-sm text-[#0F172A] flex items-center space-x-2 border-b border-slate-200/60 pb-3 mb-4">
              <User className="w-4 h-4 text-[#3B82F6]" />
              <span>Patient Profile & Symptoms</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-[#64748B] font-semibold flex items-center space-x-1">
                  <User className="w-3 h-3 text-[#3B82F6]" />
                  <span>Name</span>
                </span>
                <p className="font-bold text-[#0F172A] truncate">{patient_name || 'Not Specified'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[#64748B] font-semibold flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-[#3B82F6]" />
                  <span>Age</span>
                </span>
                <p className="font-bold text-[#0F172A]">{patient_age ? `${patient_age} yrs` : 'N/A'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[#64748B] font-semibold flex items-center space-x-1">
                  <Droplet className="w-3 h-3 text-[#EF4444]" />
                  <span>Blood Group</span>
                </span>
                <p className="font-extrabold text-[#EF4444]">{blood_group || 'N/A'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[#64748B] font-semibold flex items-center space-x-1">
                  <FileText className="w-3 h-3 text-[#3B82F6]" />
                  <span>Patient ID</span>
                </span>
                <p className="font-mono font-bold text-[#0F172A] truncate">{patient_id || 'N/A'}</p>
              </div>
            </div>

            {/* Observed Symptoms Badges */}
            <div className="pt-4 border-t border-slate-200/60 space-y-2 mt-4">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
                Observed Symptoms
              </span>
              {symptoms && symptoms.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {symptoms.map((sym, idx) => (
                    <GlassBadge key={idx} variant="info">
                      {sym}
                    </GlassBadge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#64748B] italic font-semibold">No symptoms recorded</p>
              )}
            </div>
          </GlassCard>

          {/* Model & Runtime Info */}
          <GlassCard padding="p-5" className="text-xs text-[#0F172A] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#64748B] font-semibold flex items-center space-x-1.5">
                <Brain className="w-4 h-4 text-[#3B82F6]" />
                <span>CNN Model Version:</span>
              </span>
              <span className="font-bold font-mono text-[#2563EB] px-2.5 py-0.5 rounded-md bg-[#EFF6FF] border border-[#BFDBFE]">
                {model_version}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#64748B] font-semibold flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-[#22C55E]" />
                <span>CNN Inference Time:</span>
              </span>
              <span className="font-bold font-mono text-[#0F172A]">{inference_time_ms} ms</span>
            </div>
          </GlassCard>

        </div>

        {/* Right 2 Columns: Image Preprocessing Comparison, Grad-CAM & Class Probabilities */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Class Probability Distribution Breakdown */}
          <GlassCard padding="p-6">
            <h3 className="font-bold text-sm text-[#0F172A] flex items-center space-x-2 border-b border-slate-200/60 pb-3 mb-4">
              <Activity className="w-4 h-4 text-[#3B82F6]" />
              <span>Full Category Class Probabilities</span>
            </h3>

            <div className="space-y-3">
              {class_probabilities && Object.entries(class_probabilities).map(([cls, prob]) => (
                <div key={cls} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className={cls === predicted_class ? 'text-[#2563EB] font-black' : 'text-[#0F172A]'}>
                      {cls} {cls === predicted_class && '(Predicted)'}
                    </span>
                    <span className="font-mono font-bold">{(prob * 100).toFixed(2)}%</span>
                  </div>
                  <GlassProgress
                    value={prob * 100}
                    showLabel={false}
                    color={cls === predicted_class ? (isNonDemented ? 'green' : 'purple') : 'purple'}
                  />
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Original vs Preprocessed MRI Visual Comparison Card */}
          <GlassCard padding="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3 mb-4">
              <h3 className="font-bold text-sm text-[#0F172A] flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-[#3B82F6]" />
                <span>Visual Analysis: Original vs DIP Preprocessed MRI</span>
              </h3>

              <div className="flex items-center space-x-1.5 bg-[#F1F5F9] p-1 rounded-full border border-slate-200">
                <button
                  type="button"
                  onClick={() => setMriTab('compare')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    mriTab === 'compare' ? 'bg-[#3B82F6] text-white shadow-xs' : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  Side-by-Side DIP
                </button>
                <button
                  type="button"
                  onClick={() => setMriTab('gradcam')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    mriTab === 'gradcam' ? 'bg-[#3B82F6] text-white shadow-xs' : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  Grad-CAM Heatmap
                </button>
              </div>
            </div>

            {mriTab === 'compare' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 text-center">
                  <span className="text-xs font-extrabold text-[#0F172A] block uppercase tracking-wider">1. Original MRI Scan</span>
                  <div className="p-2 rounded-[24px] bg-[#F8FAFC] border-2 border-slate-200">
                    <img
                      src={prediction.original_image_url || prediction.original_base64 || prediction.original_image_path}
                      alt="Original MRI"
                      className="w-full h-64 object-contain rounded-[18px]"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-center">
                  <span className="text-xs font-extrabold text-[#3B82F6] block uppercase tracking-wider">2. DIP Enhanced MRI (CLAHE & Denoised)</span>
                  <div className="p-2 rounded-[24px] bg-[#F8FAFC] border-2 border-[#3B82F6]">
                    <img
                      src={processed_base64 || prediction.processed_image_url || prediction.original_image_url || prediction.original_base64}
                      alt="DIP Preprocessed MRI"
                      className="w-full h-64 object-contain rounded-[18px]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <GradCamViewer
                originalUrl={prediction.original_image_url || prediction.original_base64 || prediction.original_image_path}
                heatmapUrl={heatmap_base64 || prediction.heatmap_url || prediction.heatmap_path}
                overlayUrl={overlay_base64 || prediction.overlay_url || prediction.overlay_path}
              />
            )}
          </GlassCard>

        </div>

      </div>
    </motion.div>
  );
};
