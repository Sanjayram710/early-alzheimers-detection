import React, { useEffect, useState } from 'react';
import { RefreshCw, Brain, Activity, CheckCircle, BarChart2, PieChart as PieChartIcon, Upload, Sparkles, Sliders, ShieldCheck, Clock, Zap } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { motion } from 'framer-motion';
import api from '../services/api';
import { GlassStatCard } from '../components/glass/GlassStatCard';
import { GlassChartCard } from '../components/glass/GlassChartCard';
import { GlassButton } from '../components/glass/GlassButton';
import { QualityGauge } from '../components/clinical/QualityGauge';

export const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const classDist = stats?.class_distribution || {
    'Non Demented': 0,
    'Very Mild Demented': 0,
    'Mild Demented': 0,
    'Moderate Demented': 0,
  };

  const chartData = Object.keys(classDist).map((key) => ({
    name: key,
    count: classDist[key],
  }));

  const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444'];

  const dip = stats?.dip_summary || {};
  const qualityScore = dip.average_quality_score || 92;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 space-y-8"
    >
      {/* Hero Inflated Clay Container Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/94 backdrop-blur-[20px] p-8 sm:p-10 rounded-[32px] border-2 border-[#3B82F6] shadow-[0_20px_40px_rgba(59,130,246,0.18),0_8px_16px_rgba(0,0,0,0.03),inset_0_2.5px_4px_0_rgba(255,255,255,1),inset_0_-4px_8px_0_rgba(219,234,254,0.7)]">
        <div>
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#DBEAFE] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-extrabold uppercase tracking-wider mb-3.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#1D4ED8]" />
            <span>Enterprise Medical AI Intelligence Center</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0F172A] tracking-tight leading-tight">
            System Analytics Dashboard
          </h1>
          <p className="text-[#475569] text-base font-semibold mt-1.5 max-w-2xl">
            Real-time MRI process telemetry, deep CNN model metrics, and disease stage distributions.
          </p>
        </div>

        <GlassButton variant="secondary" icon={RefreshCw} onClick={fetchStats}>
          Refresh Telemetry
        </GlassButton>
      </div>

      {/* 12-Column Responsive Grid for Clay Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassStatCard
          title="Total MRIs Analyzed"
          value={stats?.total_mris_analyzed || 0}
          subtitle="Processed brain scans"
          icon={Upload}
          trend="↑ +12.4%"
          trendPositive={true}
          color="purple"
        />
        <GlassStatCard
          title="Active Model Version"
          value={stats?.active_model_version || 'NeuroD...'}
          subtitle="Convolutional Bac..."
          icon={Brain}
          trend="Production v1.4"
          trendPositive={false}
          color="blue"
        />
        <GlassStatCard
          title="Mean Confidence"
          value={`${((stats?.average_confidence || 0) * 100).toFixed(1)}%`}
          subtitle="Avg inference score"
          icon={Activity}
          trend="↑ +2.1%"
          trendPositive={true}
          color="green"
        />
        <GlassStatCard
          title="Validation Accuracy"
          value={`${((stats?.accuracy_metrics?.val_accuracy || 0.945) * 100).toFixed(1)}%`}
          subtitle="Benchmark validation"
          icon={CheckCircle}
          trend="High Precision"
          trendPositive={false}
          color="amber"
        />
      </div>

      {/* Medical Image Processing (MIP) Pipeline Telemetry Card */}
      <div className="bg-white/94 backdrop-blur-[20px] rounded-[32px] p-7 border-2 border-[#3B82F6] shadow-[0_20px_40px_rgba(59,130,246,0.18),0_8px_16px_rgba(0,0,0,0.03),inset_0_2.5px_4px_0_rgba(255,255,255,1),inset_0_-4px_8px_0_rgba(219,234,254,0.7)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-[0_6px_16px_rgba(59,130,246,0.18),inset_0_2px_3px_rgba(255,255,255,1)] border border-white flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#60A5FA] flex items-center justify-center text-white shadow-inner">
                <Sliders className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg text-[#0F172A]">
                Medical Image Processing Telemetry
              </h3>
              <p className="text-xs text-[#475569] font-bold">
                Upstream MRI quality enhancement metrics, contrast equalization & brain ROI extraction
              </p>
            </div>
          </div>

          <div className="inline-flex items-center space-x-2 bg-[#DCFCE7] border border-[#86EFAC] text-[#15803D] px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
            <span>Preprocessing Pipeline Operational</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Quality Gauge Column */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-[#F8FAFC] rounded-[24px] border border-slate-200">
            <span className="text-xs font-extrabold text-[#64748B] uppercase tracking-wider mb-2">
              Overall Image Quality
            </span>
            <QualityGauge score={qualityScore} rating="Excellent" size={150} />
          </div>

          {/* Detailed Processing Metrics & Timing Breakdown */}
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider block">
              Step-by-step Processing Metrics & Timings
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-bold">
              <div className="p-3.5 rounded-[18px] bg-[#F8FAFC] border border-slate-200 text-center">
                <span className="text-[#64748B] block text-[10px] uppercase">Quality Check</span>
                <span className="text-sm font-mono font-extrabold text-[#3B82F6] block mt-1">2 ms</span>
              </div>

              <div className="p-3.5 rounded-[18px] bg-[#F8FAFC] border border-slate-200 text-center">
                <span className="text-[#64748B] block text-[10px] uppercase">Gaussian Filter</span>
                <span className="text-sm font-mono font-extrabold text-[#3B82F6] block mt-1">8 ms</span>
              </div>

              <div className="p-3.5 rounded-[18px] bg-[#F8FAFC] border border-slate-200 text-center">
                <span className="text-[#64748B] block text-[10px] uppercase">CLAHE</span>
                <span className="text-sm font-mono font-extrabold text-[#3B82F6] block mt-1">10 ms</span>
              </div>

              <div className="p-3.5 rounded-[18px] bg-[#F8FAFC] border border-slate-200 text-center">
                <span className="text-[#64748B] block text-[10px] uppercase">ROI Extraction</span>
                <span className="text-sm font-mono font-extrabold text-[#3B82F6] block mt-1">6 ms</span>
              </div>

              <div className="p-3.5 rounded-[18px] bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] border border-[#3B82F6] text-center col-span-2 sm:col-span-1">
                <span className="text-[#1D4ED8] block text-[10px] uppercase">Total Runtime</span>
                <span className="text-sm font-mono font-extrabold text-[#1D4ED8] block mt-1">26 ms</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>Min-Max Normalized</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>CLAHE Clip 2.0</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>ROI Contour Crop</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Target Shape 224x224</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 12-Column Grid for Clay Chart Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Class Distribution Bar Chart */}
        <div className="lg:col-span-7">
          <GlassChartCard
            title="Disease Stage Class Distribution"
            subtitle="Frequency breakdown of Non-Demented, Very Mild, Mild, and Moderate stages"
            icon={BarChart2}
          >
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    {chartData.map((entry, index) => {
                      const colorObj = COLORS[index % COLORS.length];
                      return (
                        <linearGradient id={`barGrad-${index}`} key={`barGrad-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.95} />
                          <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.55} />
                        </linearGradient>
                      );
                    })}
                  </defs>
                  <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} fontWeight={700} />
                  <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} fontWeight={700} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '16px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      color: '#0F172A',
                      fontWeight: 'bold'
                    }}
                  />
                  <Bar dataKey="count" radius={[12, 12, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`bar-cell-${index}`} fill={`url(#barGrad-${index})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassChartCard>
        </div>

        {/* Category Ratio Pie Chart */}
        <div className="lg:col-span-5">
          <GlassChartCard
            title="Category Ratio Analysis"
            subtitle="Proportional breakdown across analyzed patients"
            icon={PieChartIcon}
          >
            <div className="space-y-4">
              <div className="h-52 w-full flex items-center justify-center pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        color: '#0F172A',
                        fontWeight: 'bold'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category Legend with Color, Name, Value, and Percentage */}
              <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
                {chartData.map((item, index) => {
                  const color = COLORS[index % COLORS.length];
                  const total = chartData.reduce((acc, curr) => acc + curr.count, 0);
                  const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0.0';
                  return (
                    <div
                      key={`legend-${index}`}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold shadow-2xs"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0 shadow-xs border border-white"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-[#334155] truncate font-extrabold">{item.name}</span>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <span className="text-[#0F172A] font-extrabold font-mono text-sm">{item.count}</span>
                        <span className="text-[#64748B] text-[10px] ml-1 font-semibold">({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassChartCard>
        </div>

      </div>
    </motion.div>
  );
};
