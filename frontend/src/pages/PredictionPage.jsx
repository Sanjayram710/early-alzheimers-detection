import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Brain, FileText, Download, CheckCircle, AlertTriangle, ArrowLeft, Clock, Activity, Star, User, Calendar, Droplet, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { GradCamViewer } from '../components/GradCamViewer';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassButton } from '../components/glass/GlassButton';
import { GlassProgress } from '../components/glass/GlassProgress';
import { GlassBadge } from '../components/glass/GlassBadge';
import api from '../services/api';

export const PredictionPage = () => {
  const location = useLocation();
  const prediction = location.state?.prediction;
  const [downloading, setDownloading] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  if (!prediction) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-[#FEF3C7]/80 backdrop-blur-[20px] border border-white/60 p-2 shadow-md flex items-center justify-center mx-auto text-[#D97706]">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-[#111827]">No Prediction Loaded</h2>
        <p className="text-[#6B7280] text-sm font-semibold">Please upload a brain MRI image to generate a decision-support report.</p>
        <Link to="/upload">
          <GlassButton variant="primary">Go to Upload</GlassButton>
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
    medical_disclaimer
  } = prediction;

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      // Trigger PDF generation if not exists
      const genRes = await api.post(`/reports/generate/${id}`);
      const pdfUrl = genRes.data.pdf_url;

      // Download file
      const response = await api.get(pdfUrl, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Alzheimers_Report_${id.slice(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('PDF Download Error:', err);
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
      console.error('Feedback Submission Error:', err);
    }
  };

  const isNonDemented = predicted_class.includes('Non');

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-8"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div>
          <Link to="/upload" className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#6D5EF5] hover:underline mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Upload Another MRI</span>
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Prediction Analysis Results
          </h1>
          <span className="text-xs font-mono font-semibold text-[#6B7280]">
            ID: {id} | Patient: {patient_name ? `${patient_name} (${patient_id || 'N/A'})` : (patient_id || 'N/A')}
          </span>
        </div>

        <GlassButton
          variant="primary"
          icon={Download}
          onClick={handleDownloadPDF}
          disabled={downloading}
        >
          {downloading ? 'Generating PDF...' : 'Download PDF Report'}
        </GlassButton>
      </div>

      <DisclaimerBanner text={medical_disclaimer} />

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Classification Summary & Patient Profile */}
        <div className="space-y-6">

          {/* Classification Glass Card */}
          <div
            className={`
              rounded-[28px] p-6 border border-white/60 space-y-4
              backdrop-blur-[30px] -webkit-backdrop-blur-[30px]
              shadow-[0_10px_40px_rgba(0,0,0,0.08)]
              ${isNonDemented
                ? 'bg-[#DCFCE7]/80 text-[#15803D]'
                : 'bg-[#FEE2E2]/80 text-[#B91C1C]'
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

          {/* Patient Metadata Summary Card */}
          <GlassCard padding="p-6">
            <h3 className="font-bold text-sm text-[#111827] flex items-center space-x-2 border-b border-slate-200/50 pb-3 mb-4">
              <User className="w-4 h-4 text-[#6D5EF5]" />
              <span>Patient Profile & Symptoms</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-[#6B7280] font-semibold flex items-center space-x-1">
                  <User className="w-3 h-3 text-[#6D5EF5]" />
                  <span>Name</span>
                </span>
                <p className="font-bold text-[#111827] truncate">{patient_name || 'Not Specified'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[#6B7280] font-semibold flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-[#6D5EF5]" />
                  <span>Age</span>
                </span>
                <p className="font-bold text-[#111827]">{patient_age ? `${patient_age} yrs` : 'N/A'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[#6B7280] font-semibold flex items-center space-x-1">
                  <Droplet className="w-3 h-3 text-[#EF4444]" />
                  <span>Blood Group</span>
                </span>
                <p className="font-bold text-[#EF4444]">{blood_group || 'N/A'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[#6B7280] font-semibold flex items-center space-x-1">
                  <FileText className="w-3 h-3 text-[#6D5EF5]" />
                  <span>Patient ID</span>
                </span>
                <p className="font-mono font-bold text-[#111827] truncate">{patient_id || 'N/A'}</p>
              </div>
            </div>

            {/* Observed Symptoms Badges */}
            <div className="pt-4 border-t border-slate-200/50 space-y-2 mt-4">
              <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block">
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
                <p className="text-xs text-[#9CA3AF] italic">No symptoms recorded</p>
              )}
            </div>
          </GlassCard>

          {/* Model & Runtime Info */}
          <GlassCard padding="p-5" className="text-xs text-[#111827] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] font-semibold flex items-center space-x-1.5">
                <Brain className="w-4 h-4 text-[#6D5EF5]" />
                <span>Active AI Architecture:</span>
              </span>
              <span className="font-bold font-mono text-[#6D5EF5] px-2 py-0.5 rounded-md bg-[#EEF4FF] border border-white/60">
                {model_version}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] font-semibold flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-[#22C55E]" />
                <span>Inference Processing Time:</span>
              </span>
              <span className="font-bold font-mono">{inference_time_ms} ms</span>
            </div>
          </GlassCard>

          {/* Clinical Feedback Widget */}
          <GlassCard padding="p-6">
            <h3 className="font-bold text-sm text-[#111827] flex items-center space-x-2 border-b border-slate-200/50 pb-3 mb-3">
              <Star className="w-4 h-4 text-[#F59E0B]" />
              <span>Clinician Diagnostic Feedback</span>
            </h3>

            {feedbackSubmitted ? (
              <div className="p-3 rounded-2xl bg-[#DCFCE7]/80 border border-white/60 text-[#15803D] text-xs font-bold text-center">
                Thank you! Diagnostic feedback submitted.
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-[#6B7280]">Diagnostic Accuracy Rating:</span>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="px-3 py-1 rounded-full bg-white/60 text-xs font-bold border border-white/60 text-[#111827] cursor-pointer"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <textarea
                  rows="2"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Optional clinical notes or feedback..."
                  className="w-full p-3 rounded-2xl bg-white/60 text-xs text-[#111827] placeholder-[#9CA3AF] border border-white/60 focus:outline-none focus:border-[#6D5EF5]"
                />

                <GlassButton type="submit" size="sm" variant="secondary" className="w-full text-xs">
                  Submit Feedback
                </GlassButton>
              </form>
            )}
          </GlassCard>
        </div>

        {/* Right 2 Columns: Grad-CAM Explainability & Probability Distribution */}
        <div className="lg:col-span-2 space-y-6">
          {/* Class Probability Distribution Breakdown */}
          <GlassCard padding="p-6">
            <h3 className="font-bold text-sm text-[#111827] flex items-center space-x-2 border-b border-slate-200/50 pb-3 mb-4">
              <Activity className="w-4 h-4 text-[#6D5EF5]" />
              <span>Full Category Class Probabilities</span>
            </h3>

            <div className="space-y-3">
              {class_probabilities && Object.entries(class_probabilities).map(([cls, prob]) => (
                <div key={cls} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className={cls === predicted_class ? 'text-[#6D5EF5]' : 'text-[#111827]'}>
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

          {/* Grad-CAM Viewer Component */}
          <GradCamViewer
            originalUrl={prediction.original_image_url || prediction.original_base64 || prediction.original_image_path}
            heatmapUrl={heatmap_base64 || prediction.heatmap_url || prediction.heatmap_path}
            overlayUrl={overlay_base64 || prediction.overlay_url || prediction.overlay_path}
          />
        </div>

      </div>
    </motion.div>
  );
};
