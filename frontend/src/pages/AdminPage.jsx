import React, { useState, useEffect } from 'react';
import { Shield, Users, Brain, Activity, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassButton } from '../components/glass/GlassButton';
import { GlassTable, GlassTableRow } from '../components/glass/GlassTable';
import { GlassBadge } from '../components/glass/GlassBadge';

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
        <div className="w-12 h-12 rounded-full bg-white/60 backdrop-blur-[15px] border border-white/60 p-1 shadow-md flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6D5EF5] to-[#8B5CF6] flex items-center justify-center text-white shadow-inner">
            <Shield className="w-5 h-5" />
          </div>
        </div>
        <div>
          <h1 className="font-display text-3xl sm:text-[48px] leading-tight font-extrabold text-[#111827] tracking-tight">
            System Administration Panel
          </h1>
          <p className="text-[#6B7280] text-sm sm:text-base font-semibold">
            Model registry controls, user role management, and security audit logs
          </p>
        </div>
      </div>

      {/* Glass Pill Tabs */}
      <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-[20px] p-2 rounded-full border border-white/60 shadow-sm max-w-max">
        <button
          onClick={() => setActiveTab('models')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'models'
              ? 'bg-gradient-to-r from-[#6D5EF5] to-[#8B5CF6] text-white shadow-md'
              : 'text-[#6B7280] hover:text-[#111827]'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Model Registry ({models.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-gradient-to-r from-[#6D5EF5] to-[#8B5CF6] text-white shadow-md'
              : 'text-[#6B7280] hover:text-[#111827]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-gradient-to-r from-[#6D5EF5] to-[#8B5CF6] text-white shadow-md'
              : 'text-[#6B7280] hover:text-[#111827]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white/60 backdrop-blur-[15px] border border-white/60 p-2 shadow-md flex items-center justify-center mx-auto animate-bounce">
            <Shield className="w-6 h-6 text-[#6D5EF5]" />
          </div>
          <p className="text-xs font-bold text-[#6B7280]">Loading Admin Dashboard...</p>
        </div>
      ) : (
        <>
          {/* Tab 1: Model Registry Controls */}
          {activeTab === 'models' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {models.map((m) => (
                <GlassCard key={m.id} padding="p-6" className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-display font-extrabold text-lg text-[#111827]">
                          {m.version_name}
                        </h3>
                        {m.is_active && (
                          <GlassBadge variant="success" icon={CheckCircle}>
                            Active Engine
                          </GlassBadge>
                        )}
                      </div>
                      <p className="text-xs text-[#6B7280] font-semibold mt-1">{m.architecture}</p>
                    </div>

                    {!m.is_active && (
                      <GlassButton
                        size="sm"
                        variant="secondary"
                        onClick={() => handleActivateModel(m.version_name)}
                      >
                        Set Active
                      </GlassButton>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/50 text-xs">
                    <div>
                      <span className="text-[#6B7280] font-semibold">Validation Accuracy</span>
                      <p className="font-mono font-extrabold text-[#22C55E] text-base">
                        {(m.val_accuracy * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <span className="text-[#6B7280] font-semibold">Validation F1 Score</span>
                      <p className="font-mono font-extrabold text-[#6D5EF5] text-base">
                        {(m.val_f1 * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {/* Tab 2: User Accounts Glass Table */}
          {activeTab === 'users' && (
            <GlassCard padding="p-6">
              <GlassTable headers={['User Name', 'Email Address', 'Role', 'Status', 'Registered Date']}>
                {users.map((u) => (
                  <GlassTableRow key={u.id}>
                    <td className="p-4 font-bold text-[#111827]">{u.full_name}</td>
                    <td className="p-4 text-[#6B7280] font-semibold">{u.email}</td>
                    <td className="p-4">
                      <GlassBadge variant={u.role === 'admin' ? 'info' : 'neutral'}>
                        {u.role.toUpperCase()}
                      </GlassBadge>
                    </td>
                    <td className="p-4">
                      <GlassBadge variant={u.is_active ? 'success' : 'danger'}>
                        {u.is_active ? 'Active' : 'Disabled'}
                      </GlassBadge>
                    </td>
                    <td className="p-4 font-medium text-[#6B7280]">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </GlassTableRow>
                ))}
              </GlassTable>
            </GlassCard>
          )}

          {/* Tab 3: Security Audit Glass Table */}
          {activeTab === 'audit' && (
            <GlassCard padding="p-6">
              <GlassTable headers={['User ID / System', 'Action Executed', 'IP Address', 'Timestamp']}>
                {auditLogs.map((log) => (
                  <GlassTableRow key={log.id}>
                    <td className="p-4 font-mono font-bold text-[#6D5EF5]">
                      {log.user_id ? log.user_id.slice(0, 8) : 'System Worker'}
                    </td>
                    <td className="p-4 font-semibold text-[#111827]">{log.action}</td>
                    <td className="p-4 font-mono text-[#6B7280]">{log.ip_address || '127.0.0.1'}</td>
                    <td className="p-4 font-medium text-[#6B7280]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </GlassTableRow>
                ))}
              </GlassTable>
            </GlassCard>
          )}
        </>
      )}
    </motion.div>
  );
};
