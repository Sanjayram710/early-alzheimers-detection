import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassButton } from '../components/glass/GlassButton';

export const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/reports');
        setReports(res.data);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleDownload = async (reportId, predictionId) => {
    try {
      const response = await api.get(`/reports/${reportId}/download`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Alzheimers_Report_${predictionId.slice(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 py-8 space-y-6"
    >
      <div>
        <h1 className="font-display text-3xl sm:text-[48px] leading-tight font-extrabold text-[#111827] tracking-tight">
          Downloadable Clinical Reports
        </h1>
        <p className="text-[#6B7280] text-sm sm:text-base font-semibold">
          Archived PDF decision support reports generated for MRI scans
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white/60 backdrop-blur-[15px] border border-white/60 p-2 shadow-md flex items-center justify-center mx-auto animate-bounce">
            <Brain className="w-6 h-6 text-[#6D5EF5]" />
          </div>
          <p className="text-xs font-bold text-[#6B7280]">Loading Archived PDF Reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <GlassCard padding="p-12 text-center" hoverEffect={false}>
          <p className="text-base font-bold text-[#111827]">No PDF reports generated yet</p>
          <p className="text-xs text-[#6B7280] font-semibold mt-1">Run a prediction to automatically generate clinical PDF reports.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reports.map((r) => (
            <GlassCard key={r.id} padding="p-6" className="flex items-center justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-[#6D5EF5] font-bold text-sm">
                  <FileText className="w-4 h-4" />
                  <span>Clinical Report #{r.id.slice(0, 8)}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-[#6B7280]">
                  <Calendar className="w-3.5 h-3.5 text-[#6D5EF5]" />
                  <span>Generated: {new Date(r.generated_at).toLocaleString()}</span>
                </div>
              </div>

              <GlassButton
                variant="primary"
                size="sm"
                icon={Download}
                onClick={() => handleDownload(r.id, r.prediction_id)}
                className="shadow-[0_4px_16px_rgba(109,94,245,0.4)]"
              >
                Download PDF
              </GlassButton>
            </GlassCard>
          ))}
        </div>
      )}
    </motion.div>
  );
};
