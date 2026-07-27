import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import api from '../services/api';

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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-white">Downloadable Clinical Reports</h1>
        <p className="text-slate-400 text-sm">Archived PDF decision support reports generated for MRI scans</p>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 text-slate-400 text-sm">
          No PDF reports generated yet. Run a prediction to generate reports.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((r) => (
            <div key={r.id} className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-blue-400 font-semibold text-sm">
                  <FileText className="w-4 h-4" />
                  <span>Clinical Report #{r.id.slice(0, 8)}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Generated: {new Date(r.generated_at).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => handleDownload(r.id, r.prediction_id)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center space-x-1.5 shadow-md shadow-blue-500/20"
              >
                <Download className="w-4 h-4" />
                <span>PDF</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
