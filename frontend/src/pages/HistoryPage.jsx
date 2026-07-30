import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Search, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassInput } from '../components/glass/GlassInput';
import { GlassButton } from '../components/glass/GlassButton';
import { GlassTable, GlassTableRow } from '../components/glass/GlassTable';
import { GlassBadge } from '../components/glass/GlassBadge';

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
          <h1 className="font-display text-3xl sm:text-[48px] leading-tight font-extrabold text-[#111827] tracking-tight">
            MRI Scan & Prediction History
          </h1>
          <p className="text-[#6B7280] text-sm sm:text-base font-semibold">
            Past AI prediction logs, patient profiles, and clinical analysis records
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-80">
          <GlassInput
            icon={Search}
            placeholder="Search Patient Name, ID, or Stage..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white/60 backdrop-blur-[15px] border border-white/60 p-2 shadow-md flex items-center justify-center mx-auto animate-bounce">
            <Brain className="w-6 h-6 text-[#6D5EF5]" />
          </div>
          <p className="text-xs font-bold text-[#6B7280]">Loading Prediction Logs...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <GlassCard padding="p-12 text-center" hoverEffect={false}>
          <p className="text-base font-bold text-[#111827]">No prediction history records found</p>
          <p className="text-xs text-[#6B7280] font-semibold mt-1">Upload a brain MRI scan image to populate history logs.</p>
        </GlassCard>
      ) : (
        <GlassCard padding="p-6">
          <GlassTable
            headers={['Patient Name', 'Patient ID', 'Age', 'Blood Group', 'Predicted Stage', 'Confidence', 'Date', 'Action']}
          >
            {filteredHistory.map((item) => {
              const isNonDemented = item.predicted_class.includes('Non');
              return (
                <GlassTableRow key={item.id} onClick={() => handleViewDetail(item.id)}>
                  <td className="p-4 font-bold text-[#111827]">{item.patient_name || 'N/A'}</td>
                  <td className="p-4 font-mono font-bold text-[#6D5EF5]">{item.patient_id || 'N/A'}</td>
                  <td className="p-4 font-semibold text-[#111827]">{item.patient_age ? `${item.patient_age}y` : 'N/A'}</td>
                  <td className="p-4 font-semibold text-[#EF4444]">{item.blood_group || 'N/A'}</td>
                  <td className="p-4">
                    <GlassBadge variant={isNonDemented ? 'success' : 'danger'}>
                      {item.predicted_class}
                    </GlassBadge>
                  </td>
                  <td className="p-4 font-mono font-extrabold text-[#111827]">
                    {(item.confidence * 100).toFixed(1)}%
                  </td>
                  <td className="p-4 font-medium text-[#6B7280]">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <GlassButton
                      size="sm"
                      variant="secondary"
                      icon={Eye}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetail(item.id);
                      }}
                    >
                      View
                    </GlassButton>
                  </td>
                </GlassTableRow>
              );
            })}
          </GlassTable>
        </GlassCard>
      )}
    </motion.div>
  );
};
