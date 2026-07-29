import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Brain, FileText, Download, CheckCircle, AlertTriangle, ArrowLeft, Clock, Activity, Star, User, Calendar, Droplet, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { GradCamViewer } from '../components/GradCamViewer';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { ClayCard } from '../components/clay/ClayCard';
import { ClayButton } from '../components/clay/ClayButton';
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
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border border-white/80 p-2 shadow-[8px_8px_20px_rgba(245,158,11,0.2)] flex items-center justify-center mx-auto text-[#D97706]">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-[#1F2937]">No Prediction Loaded</h2>
        <p className="text-[#6B7280] text-sm">Please upload a brain MRI image to generate a decision-support report.</p>
        <Link to="/upload">
          <ClayButton variant="primary">Go to Upload</ClayButton>
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
      className="max-w-6xl mx-auto px-4 py-8 space-y-8"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link to="/upload" className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#6D5EF5] hover:underline mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Upload Another MRI</span>
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Prediction Analysis Results
          </h1>
          <span className="text-xs font-mono font-semibold text-[#6B7280]">
            ID: {id} | Patient: {patient_name ? `${patient_name} (${patient_id || 'N/A'})` : (patient_id || 'N/A')}
          </span>
        </div>

        <ClayButton
          variant="primary"
          icon={Download}
          onClick={handleDownloadPDF}
          disabled={downloading}
        >
          {downloading ? 'Generating PDF...' : 'Download PDF Report'}
        </ClayButton>
      </div>

      <DisclaimerBanner text={medical_disclaimer} />

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Classification Summary & Patient Profile */}
        <div className="space-y-6">
          
          {/* Classification Clay Card */}
          <div
            className={`
              rounded-[28px] p-6 border border-white/80 space-y-4
              shadow-[12px_12px_28px_rgba(163,177,198,0.35),-10px_-10px_24px_rgba(255,255,255,0.95)]
              ${isNonDemented 
                ? 'bg-gradient-to-br from-[#DCFCE7] to-[#F0FDF4] text-[#15803D]' 
                : 'bg-gradient-to-br from-[#FEE2E2] to-[#FEF2F2] text-[#B91C1C]'
              }
            `}
          >
            <span className="text-xs font-bold uppercase tracking-wider block opacity-80">
              Predicted Disease Stage
            </span>
            <div className="font-display text-3xl font-extrabold tracking-tight">
              {predicted_class}
            </div>
            
            <div className="pt-3 border-t border-black/10 flex items-center justify-between text-xs font-semibold">
              <span>Confidence Score:</span>
              <span className="font-bold text-lg font-mono">{(confidence * 100).toFixed(2)}%</span>
            </div>
          </div>

          {/* Patient Metadata Summary Card */}
          <ClayCard padding="p-6">
            <h3 className="font-bold text-sm text-[#1F2937] flex items-center space-x-2 border-b border-slate-200/70 pb-3 mb-4">
              <User className="w-4 h-4 text-[#6D5EF5]" />
              <span>Patient Profile & Symptoms</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-[#6B7280] font-medium flex items-center space-x-1">
                  <User className="w-3 h-3 text-[#6D5EF5]" />
                  <span>Name</span>
                </span>
                <p className="font-bold text-[#1F2937] truncate">{patient_name || 'Not Specified'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[#6B7280] font-medium flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-[#6D5EF5]" />
                  <span>Age</span>
                </span>
                <p className="font-bold text-[#1F2937]">{patient_age ? `${patient_age} yrs` : 'N/A'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[#6B7280] font-medium flex items-center space-x-1">
                  <Droplet className="w-3 h-3 text-[#EF4444]" />
                  <span>Blood Group</span>
                </span>
                <p className="font-bold text-[#EF4444]">{blood_group || 'N/A'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[#6B7280] font-medium flex items-center space-x-1">
                  <FileText className="w-3 h-3 text-[#6D5EF5]" />
                  <span>Patient ID</span>
                </span>
                <p className="font-mono font-bold text-[#1F2937] truncate">{patient_id || 'N/A'}</p>
              </div>
            </div>

            {/* Observed Symptoms Badges */}
            <div className="pt-4 border-t border-slate-200/70 space-y-2 mt-4">
              <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block">
                Observed Symptoms
              </span>
              {symptoms && symptoms.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {symptoms.map((sym, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-[#EEF2FF] border border-white/80 text-[#6D5EF5] text-[11px] font-bold shadow-[inset_2px_2px_4px_rgba(163,177,198,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]"
                    >
                      {sym}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#9CA3AF] italic">No symptoms recorded</p>
              )}
            </div>
          </ClayCard>

          {/* Model & Runtime Info */}
          <ClayCard padding="p-5" className="text-xs text-[#1F2937] space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 font-medium text-[#6B7280]">
                <Brain className="w-4 h-4 text-[#6D5EF5]" />
                <span>Model Version:</span>
              </span>
              <span className="font-mono font-bold text-[#1F2937] uppercase">{model_version}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 font-medium text-[#6B7280]">
                <Clock className="w-4 h-4 text-[#8E82FF]" />
                <span>Inference Time:</span>
              </span>
              <span className="font-mono font-bold text-[#1F2937]">{inference_time_ms} ms</span>
            </div>
          </ClayCard>

          {/* Probabilities Breakdown */}
          <ClayCard padding="p-6" className="space-y-4">
            <h3 className="font-bold text-sm text-[#1F2937] flex items-center space-x-2">
              <Activity className="w-4 h-4 text-[#6D5EF5]" />
              <span>Class Probabilities</span>
            </h3>

            <div className="space-y-3">
              {class_probabilities && Object.entries(class_probabilities).map(([cls, prob]) => {
                const pct = (prob * 100).toFixed(1);
                const isTop = cls === predicted_class;
                return (
                  <div key={cls} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className={isTop ? 'font-bold text-[#6D5EF5]' : 'text-[#6B7280]'}>{cls}</span>
                      <span className="font-mono text-[#1F2937]">{pct}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#F4F6FB] rounded-full overflow-hidden border border-white/80 shadow-[inset_2px_2px_4px_rgba(163,177,198,0.3)]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isTop ? 'bg-[#6D5EF5]' : 'bg-[#CBD5E1]'}`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ClayCard>
        </div>

        {/* Right Column: Grad-CAM Explainability & Feedback */}
        <div className="lg:col-span-2 space-y-6">
          <GradCamViewer
            originalUrl={
              prediction.original_base64 ||
              prediction.original_image_url ||
              (prediction.original_image_path ? `/uploads/${prediction.original_image_path.split(/[/\\]/).pop()}` : null)
            }
            heatmapUrl={heatmap_base64}
            overlayUrl={overlay_base64}
          />

          {/* User Feedback Widget */}
          <ClayCard padding="p-6" className="space-y-4">
            <h3 className="font-bold text-base text-[#1F2937]">Clinical Decision Feedback</h3>
            {feedbackSubmitted ? (
              <div className="p-4 rounded-[20px] bg-[#DCFCE7] border border-white/80 text-[#15803D] text-sm flex items-center space-x-2 font-bold shadow-[inset_2px_2px_5px_rgba(163,177,198,0.2)]">
                <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                <span>Thank you! Your feedback has been recorded for model evaluation.</span>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-[#6B7280]">Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1 rounded-md transition-transform hover:scale-110 ${rating >= star ? 'text-[#F59E0B]' : 'text-[#CBD5E1]'}`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Optional clinical notes or feedback on this prediction..."
                  className="w-full p-4 rounded-[22px] bg-[#F4F6FB] text-xs text-[#1F2937] placeholder-[#9CA3AF] font-medium shadow-[inset_4px_4px_8px_rgba(163,177,198,0.35),inset_-4px_-4px_8px_rgba(255,255,255,0.95)] border border-white/60 focus:outline-none focus:border-[#6D5EF5]"
                  rows="2"
                />
                <ClayButton type="submit" variant="secondary" size="sm">
                  Submit Feedback
                </ClayButton>
              </form>
            )}
          </ClayCard>
        </div>

      </div>
    </motion.div>
  );
};
