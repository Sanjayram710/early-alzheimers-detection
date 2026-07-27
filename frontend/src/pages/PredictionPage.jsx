import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Brain, FileText, Download, CheckCircle, AlertTriangle, ArrowLeft, Clock, Activity, Star } from 'lucide-react';
import { GradCamViewer } from '../components/GradCamViewer';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
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
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Prediction Loaded</h2>
        <p className="text-slate-400 text-sm">Please upload a brain MRI image to generate a decision-support report.</p>
        <Link to="/upload" className="inline-block px-6 py-2.5 rounded-xl bg-blue-600 font-semibold text-white">
          Go to Upload
        </Link>
      </div>
    );
  }

  const {
    id,
    patient_id,
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

  const stageColor = predicted_class.includes('Non')
    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
    : 'border-red-500/40 bg-red-500/10 text-red-400';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link to="/upload" className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Upload Another MRI</span>
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">Prediction Analysis Results</h1>
          <span className="text-xs text-slate-400 font-mono">ID: {id} | Patient: {patient_id || 'N/A'}</span>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="px-5 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center space-x-2 text-sm"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Generating PDF...' : 'Download PDF Report'}</span>
        </button>
      </div>

      <DisclaimerBanner text={medical_disclaimer} />

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Classification Summary */}
        <div className="space-y-6">
          <div className={`glass-card p-6 rounded-2xl border ${stageColor} space-y-4`}>
            <span className="text-xs font-semibold uppercase tracking-wider block opacity-80">Predicted Disease Stage</span>
            <div className="font-display text-3xl font-extrabold">{predicted_class}</div>
            
            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-300">
              <span>Confidence Score:</span>
              <span className="font-bold text-base font-mono">{(confidence * 100).toFixed(2)}%</span>
            </div>
          </div>

          {/* Model & Runtime Info */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5"><Brain className="w-4 h-4 text-blue-400" /><span>Model Version:</span></span>
              <span className="font-mono font-bold text-white uppercase">{model_version}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5"><Clock className="w-4 h-4 text-purple-400" /><span>Inference Time:</span></span>
              <span className="font-mono font-bold text-white">{inference_time_ms} ms</span>
            </div>
          </div>

          {/* Probabilities Breakdown */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-semibold text-sm text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span>Class Probabilities</span>
            </h3>

            <div className="space-y-3">
              {class_probabilities && Object.entries(class_probabilities).map(([cls, prob]) => {
                const pct = (prob * 100).toFixed(1);
                const isTop = cls === predicted_class;
                return (
                  <div key={cls} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className={isTop ? 'font-bold text-white' : 'text-slate-400'}>{cls}</span>
                      <span className="font-mono text-slate-300">{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all ${isTop ? 'bg-blue-500' : 'bg-slate-700'}`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-semibold text-base text-white">Clinical Decision Feedback</h3>
            {feedbackSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-sm flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Thank you! Your feedback has been recorded for model evaluation.</span>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1 rounded ${rating >= star ? 'text-amber-400' : 'text-slate-700'}`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Optional clinical notes or feedback on this prediction..."
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  rows="2"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700"
                >
                  Submit Feedback
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
