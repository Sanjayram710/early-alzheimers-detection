import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Eye, Download, Search, Brain, User, Calendar, Droplet } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { ClayCard } from '../components/clay/ClayCard';
import { ClayInput } from '../components/clay/ClayInput';
import { ClayButton } from '../components/clay/ClayButton';

export const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/history');
        setHistory(res.data);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleViewDetail = async (id) => {
    try {
      const res = await api.get(`/history/${id}`);
      navigate('/prediction', { state: { prediction: res.data } });
    } catch (err) {
      console.error('Failed to fetch prediction detail:', err);
    }
  };

  const filteredHistory = history.filter((item) =>
    (item.patient_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.patient_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.predicted_class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-[42px] leading-tight font-extrabold text-[#1F2937] tracking-tight">
            MRI Scan & Prediction History
          </h1>
          <p className="text-[#6B7280] text-sm sm:text-base font-medium">
            Past AI prediction logs, patient profiles, and clinical analysis records
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-80">
          <ClayInput
            icon={Search}
            placeholder="Search Patient Name, ID, or Stage..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-[#EEF2FF] border border-white/80 p-2 shadow-[8px_8px_20px_rgba(163,177,198,0.35)] flex items-center justify-center mx-auto animate-bounce">
            <Brain className="w-6 h-6 text-[#6D5EF5]" />
          </div>
          <p className="text-xs font-bold text-[#6B7280]">Loading Prediction Logs...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <ClayCard padding="p-12 text-center" hoverEffect={false}>
          <p className="text-base font-bold text-[#1F2937]">No prediction history records found</p>
          <p className="text-xs text-[#6B7280] font-medium mt-1">Upload a brain MRI scan image to populate history logs.</p>
        </ClayCard>
      ) : (
        <div className="bg-gradient-to-br from-white via-[#F8FAFC] to-[#EEF2FF] rounded-[28px] border border-white/80 overflow-hidden shadow-[12px_12px_28px_rgba(163,177,198,0.35),-10px_-10px_24px_rgba(255,255,255,0.95)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EEF2FF] text-[#1F2937] font-extrabold uppercase tracking-wider border-b border-white/80">
                <tr>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Patient ID</th>
                  <th className="p-4">Age</th>
                  <th className="p-4">Blood Group</th>
                  <th className="p-4">Predicted Stage</th>
                  <th className="p-4">Confidence</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 text-[#1F2937] font-medium">
                {filteredHistory.map((item) => {
                  const isNonDemented = item.predicted_class.includes('Non');
                  return (
                    <tr key={item.id} className="hover:bg-white/70 transition-colors">
                      <td className="p-4 font-bold text-[#1F2937]">{item.patient_name || 'N/A'}</td>
                      <td className="p-4 font-mono font-bold text-[#6D5EF5]">{item.patient_id || 'N/A'}</td>
                      <td className="p-4 text-[#6B7280]">{item.patient_age ? `${item.patient_age} yrs` : 'N/A'}</td>
                      <td className="p-4 font-bold text-[#EF4444]">{item.blood_group || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full font-bold text-[11px] shadow-[inset_2px_2px_4px_rgba(163,177,198,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] ${
                          isNonDemented
                            ? 'bg-[#DCFCE7] text-[#15803D]'
                            : 'bg-[#FEE2E2] text-[#B91C1C]'
                        }`}>
                          {item.predicted_class}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-[#1F2937]">{(item.confidence * 100).toFixed(1)}%</td>
                      <td className="p-4 text-[#6B7280]">{new Date(item.created_at).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <ClayButton
                          variant="secondary"
                          size="sm"
                          icon={Eye}
                          onClick={() => handleViewDetail(item.id)}
                        >
                          View Report
                        </ClayButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};
