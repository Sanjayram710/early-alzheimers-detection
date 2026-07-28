import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Eye, Download, Search } from 'lucide-react';
import api from '../services/api';

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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white">MRI Upload History</h1>
          <p className="text-slate-400 text-sm">Past predictions and clinical analysis logs</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search by Patient Name, ID or Class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl border border-slate-800 text-slate-400 text-sm">
          No prediction history found. Upload a brain MRI image to get started.
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
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
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white">{item.patient_name || 'N/A'}</td>
                    <td className="p-4 font-mono text-slate-400">{item.patient_id || 'N/A'}</td>
                    <td className="p-4 text-slate-300">{item.patient_age ? `${item.patient_age} yrs` : 'N/A'}</td>
                    <td className="p-4 font-semibold text-red-400">{item.blood_group || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full font-semibold ${
                        item.predicted_class.includes('Non')
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {item.predicted_class}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-white">{(item.confidence * 100).toFixed(1)}%</td>
                    <td className="p-4 text-slate-400">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleViewDetail(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 transition-all inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
