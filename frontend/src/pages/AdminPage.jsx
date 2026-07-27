import React, { useState, useEffect } from 'react';
import { Shield, Users, Brain, Activity, CheckCircle, Clock } from 'lucide-react';
import api from '../services/api';

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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white">System Administration Panel</h1>
          <p className="text-slate-400 text-sm">Model registry controls, user role management, and security audit logs</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('models')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
            activeTab === 'models' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Model Registry ({models.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
            activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
            activeTab === 'audit' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Security Audit Logs</span>
        </button>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : activeTab === 'models' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((mod) => (
            <div key={mod.id} className={`glass-card p-6 rounded-2xl border ${mod.is_active ? 'border-blue-500/50 bg-blue-950/20' : 'border-slate-800'} space-y-4`}>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-white uppercase text-base">{mod.version_name}</span>
                {mod.is_active ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>ACTIVE</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 font-mono">INACTIVE</span>
                )}
              </div>

              <div className="space-y-1 text-xs text-slate-400">
                <div className="flex justify-between"><span>Architecture:</span><span className="text-slate-200 font-mono">{mod.architecture}</span></div>
                <div className="flex justify-between"><span>Validation Acc:</span><span className="text-emerald-400 font-mono font-bold">{mod.val_accuracy ? `${(mod.val_accuracy * 100).toFixed(1)}%` : 'N/A'}</span></div>
              </div>

              {!mod.is_active && (
                <button
                  onClick={() => handleActivateModel(mod.version_name)}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-xs font-semibold text-white transition-colors"
                >
                  Set as Active Model
                </button>
              )}
            </div>
          ))}
        </div>
      ) : activeTab === 'users' ? (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="p-4 font-semibold text-white">{u.full_name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4 uppercase font-bold text-blue-400">{u.role}</td>
                  <td className="p-4 text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Action</th>
                <th className="p-4">Resource</th>
                <th className="p-4">User ID</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="p-4 font-bold text-blue-400">{log.action}</td>
                  <td className="p-4">{log.resource}</td>
                  <td className="p-4 text-slate-400">{log.user_id || 'System'}</td>
                  <td className="p-4 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
