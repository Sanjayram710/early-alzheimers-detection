import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Search, Brain, History as HistoryIcon, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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

  // Reset to Page 1 when searching
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

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

  // Pagination calculation
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredHistory.length);
  const currentRecords = filteredHistory.slice(startIndex, endIndex);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 space-y-8"
    >
      {/* Hero Claymorphism Banner Matching Dashboard Page */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/94 backdrop-blur-[20px] p-8 sm:p-10 rounded-[24px] border-2 border-[#3B82F6]/65 hover:border-[#3B82F6] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),0_8px_24px_rgba(59,130,246,0.08),0_2px_8px_rgba(59,130,246,0.05),inset_0_2px_4px_0_rgba(255,255,255,1),inset_0_-4px_8px_0_rgba(219,234,254,0.7)] transition-all duration-250 ease-in-out">
        <div>
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#DBEAFE] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-extrabold uppercase tracking-wider mb-3.5 shadow-sm">
            <HistoryIcon className="w-3.5 h-3.5 text-[#1D4ED8]" />
            <span>Diagnostic Logs & Patient Records</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0F172A] tracking-tight leading-tight">
            MRI Scan & Prediction History
          </h1>
          <p className="text-[#475569] text-base font-semibold mt-1.5 max-w-2xl">
            Past AI prediction logs, patient profiles, and clinical analysis records.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-80">
          <GlassInput
            icon={Search}
            placeholder="Search Patient Name, ID, or Stage..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white p-2 shadow-[0_10px_30px_rgba(59,130,246,0.2),inset_0_2px_4px_rgba(255,255,255,1)] border border-white flex items-center justify-center mx-auto animate-bounce">
            <Brain className="w-6 h-6 text-[#3B82F6]" />
          </div>
          <p className="text-xs font-bold text-[#475569]">Loading Prediction Logs...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <GlassCard padding="p-12 text-center" hoverEffect={false}>
          <p className="text-base font-bold text-[#0F172A]">No prediction history records found</p>
          <p className="text-xs text-[#475569] font-semibold mt-1">Upload a brain MRI scan image to populate history logs.</p>
        </GlassCard>
      ) : (
        <>
          <GlassCard hierarchy="primary" accent="blue" padding="p-6 sm:p-8">
            <GlassTable
              headers={['Patient Name', 'Patient ID', 'Age', 'Blood Group', 'Predicted Stage', 'Confidence', 'Date', 'Action']}
            >
              {currentRecords.map((item) => {
                const isNonDemented = item.predicted_class.includes('Non');
                return (
                  <GlassTableRow key={item.id} onClick={() => handleViewDetail(item.id)}>
                    <td className="p-4 font-extrabold text-[#0F172A]">{item.patient_name || 'N/A'}</td>
                    <td className="p-4 font-mono font-extrabold text-[#2563EB]">{item.patient_id || 'N/A'}</td>
                    <td className="p-4 font-bold text-[#0F172A]">{item.patient_age ? `${item.patient_age}y` : 'N/A'}</td>
                    <td className="p-4 font-extrabold text-[#EF4444]">{item.blood_group || 'N/A'}</td>
                    <td className="p-4">
                      <GlassBadge variant={isNonDemented ? 'success' : 'danger'}>
                        {item.predicted_class}
                      </GlassBadge>
                    </td>
                    <td className="p-4 font-mono font-extrabold text-[#0F172A]">
                      {(item.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="p-4 font-semibold text-[#475569]">
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

          {/* Pagination Section Centered in the Gap Between Table Box (Box 1) & Footer Box (Box 2) */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2 sm:px-4 py-2 font-semibold text-xs text-[#475569]">
            <div className="text-left">
              Showing <span className="font-extrabold text-[#0F172A]">{filteredHistory.length > 0 ? startIndex + 1 : 0}</span> to{' '}
              <span className="font-extrabold text-[#0F172A]">{endIndex}</span> of{' '}
              <span className="font-extrabold text-[#0F172A]">{filteredHistory.length}</span> patient records
            </div>

            {/* Pill Capsule Pagination Bar */}
            <div className="flex items-center justify-center md:justify-end w-full md:w-auto">
              <div className="inline-flex items-center space-x-2 bg-white/94 backdrop-blur-[20px] p-2 rounded-full border-2 border-[#3B82F6]/65 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),0_8px_24px_rgba(59,130,246,0.12)] transition-all duration-250 hover:border-[#3B82F6]">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-full bg-[#F8FAFC] border border-white text-[#64748B] font-extrabold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:text-[#0F172A] shadow-xs transition-all flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Previous</span>
                </button>

                {/* Page Number Pills */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 rounded-full font-black transition-all cursor-pointer flex items-center justify-center text-xs ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white shadow-[0_4px_14px_rgba(59,130,246,0.40)] border border-white scale-105'
                        : 'bg-white border border-slate-100 text-[#0F172A] hover:bg-[#F1F5F9] hover:text-[#2563EB] shadow-xs'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-4 py-2 rounded-full bg-white border border-slate-100 text-[#0F172A] font-extrabold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F1F5F9] hover:text-[#2563EB] shadow-xs transition-all flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#0F172A]" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};
