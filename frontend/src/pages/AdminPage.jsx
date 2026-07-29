import React, { useState, useEffect } from 'react';
import { Shield, Users, Brain, Activity, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { ClayCard } from '../components/clay/ClayCard';
import { ClayButton } from '../components/clay/ClayButton';

export const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [models, setModels] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('models'); // 'models' | 'users' | 'audit'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersRes, modelsRes, auditRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/models'),
          api.get('/admin/audit-logs'),
        ]);
        setUsers(usersRes.data);
        setModels(modelsRes.data);
        setAuditLogs(auditRes.data);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleActivateModel = async (versionName) => {
    try {
      await api.post(`/models/activate/${versionName}`);
      const modelsRes = await api.get('/models');
      setModels(modelsRes.data);
    } catch (err) {
      console.error('Failed to activate model:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-8 space-y-8"
    >
      <div className="flex items-center space-x-3.5">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-[#EEF2FF] border border-white/80 p-1 shadow-[6px_6px_14px_rgba(163,177,198,0.3)] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6D5EF5] to-[#8E82FF] flex items-center justify-center text-white">
            <Shield className="w-5 h-5" />
          </div>
        </div>
        <div>
          <h1 className="font-display text-3xl sm:text-[42px] leading-tight font-extrabold text-[#1F2937] tracking-tight">
            System Administration Panel
          </h1>
          <p className="text-[#6B7280] text-sm sm:text-base font-medium">
            Model registry controls, user role management, and security audit logs
          </p>
        </div>
      </div>

      {/* Clay Pill Tabs */}
      <div className="flex items-center space-x-3 bg-gradient-to-br from-white to-[#EEF2FF] p-2 rounded-full border border-white/80 shadow-[10px_10px_24px_rgba(163,177,198,0.3)] max-w-max">
        <button
          onClick={() => setActiveTab('models')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'models'
              ? 'bg-[#6D5EF5] text-white shadow-md'
              : 'text-[#6B7280] hover:text-[#1F2937]'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Model Registry ({models.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'users'
              ? 'bg-[#6D5EF5] text-white shadow-md'
              : 'text-[#6B7280] hover:text-[#1F2937]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'audit'
              ? 'bg-[#6D5EF5] text-white shadow-md'
              : 'text-[#6B7280] hover:text-[#1F2937]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Security Audit Logs</span>
        </button>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-[#EEF2FF] border border-white/80 p-2 shadow-[8px_8px_20px_rgba(163,177,198,0.35)] flex items-center justify-center mx-auto animate-bounce">
            <Brain className="w-6 h-6 text-[#6D5EF5]" />
          </div>
          <p className="text-xs font-bold text-[#6B7280]">Loading Administration Telemetry...</p>
        </div>
      ) : activeTab === 'models' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((mod) => (
            <ClayCard key={mod.id} padding="p-6" className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono font-extrabold text-[#1F2937] uppercase text-base">{mod.version_name}</span>
                {mod.is_active ? (
                  <span className="px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-bold flex items-center space-x-1 shadow-sm">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>ACTIVE</span>
                  </span>
                ) : (
                  <span className="text-xs text-[#9CA3AF] font-mono font-semibold">INACTIVE</span>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-[#6B7280] font-medium">
                <div className="flex justify-between"><span>Architecture:</span><span className="text-[#1F2937] font-mono font-bold">{mod.architecture}</span></div>
                <div className="flex justify-between"><span>Validation Acc:</span><span className="text-[#22C55E] font-mono font-bold">{mod.val_accuracy ? `${(mod.val_accuracy * 100).toFixed(1)}%` : 'N/A'}</span></div>
              </div>

              {!mod.is_active && (
                <ClayButton
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => handleActivateModel(mod.version_name)}
                >
                  Set as Active Model
                </ClayButton>
              )}
            </ClayCard>
          ))}
        </div>
      ) : activeTab === 'users' ? (
        <div className="bg-gradient-to-br from-white via-[#F8FAFC] to-[#EEF2FF] rounded-[28px] border border-white/80 overflow-hidden shadow-[12px_12px_28px_rgba(163,177,198,0.35),-10px_-10px_24px_rgba(255,255,255,0.95)]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EEF2FF] text-[#1F2937] font-extrabold uppercase tracking-wider border-b border-white/80">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 text-[#1F2937] font-medium">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/70 transition-colors">
                  <td className="p-4 font-bold text-[#1F2937]">{u.full_name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4 uppercase font-bold text-[#6D5EF5]">{u.role}</td>
                  <td className="p-4 text-[#6B7280]">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-white via-[#F8FAFC] to-[#EEF2FF] rounded-[28px] border border-white/80 overflow-hidden shadow-[12px_12px_28px_rgba(163,177,198,0.35),-10px_-10px_24px_rgba(255,255,255,0.95)]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EEF2FF] text-[#1F2937] font-extrabold uppercase tracking-wider border-b border-white/80">
              <tr>
                <th className="p-4">Action</th>
                <th className="p-4">Resource</th>
                <th className="p-4">User ID</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 text-[#1F2937] font-mono font-medium">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/70 transition-colors">
                  <td className="p-4 font-bold text-[#6D5EF5]">{log.action}</td>
                  <td className="p-4">{log.resource}</td>
                  <td className="p-4 text-[#6B7280]">{log.user_id || 'System'}</td>
                  <td className="p-4 text-[#6B7280]">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};
