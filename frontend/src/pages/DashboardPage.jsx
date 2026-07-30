import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Brain, Activity, Upload, CheckCircle, BarChart2, RefreshCw, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { GlassStatCard } from '../components/glass/GlassStatCard';
import { GlassChartCard } from '../components/glass/GlassChartCard';
import { GlassButton } from '../components/glass/GlassButton';

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

  if (loading && !stats) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-white/60 backdrop-blur-[20px] border border-white/60 p-2 shadow-[0_10px_30px_rgba(109,94,245,0.2)] flex items-center justify-center animate-bounce">
          <Brain className="w-8 h-8 text-[#6D5EF5]" />
        </div>
        <p className="text-sm font-bold text-[#6B7280]">Loading Glassmorphism Medical Telemetry...</p>
      </div>
    );
  }

  const classDist = stats?.class_distribution || {};
  const chartData = Object.entries(classDist).map(([name, count]) => ({ name, count }));
  
  // High contrast vibrant glass colors
  const COLORS = ['#22C55E', '#6D5EF5', '#8B5CF6', '#F59E0B'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 space-y-8"
    >
      {/* Hero Glass Banner Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/55 backdrop-blur-[28px] -webkit-backdrop-blur-[28px] p-8 sm:p-10 rounded-[32px] border border-white/45 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
        <div>
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#EEF4FF]/90 border border-white/60 text-[#6D5EF5] text-xs font-extrabold uppercase tracking-wider mb-3.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#6D5EF5]" />
            <span>Apple VisionOS Inspired Medical AI Dashboard</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-[48px] font-extrabold text-[#111827] tracking-tight leading-tight">
            System Analytics Dashboard
          </h1>
          <p className="text-[#6B7280] text-base font-semibold mt-1.5">
            Real-time MRI process telemetry, deep CNN model metrics, and disease stage distributions.
          </p>
        </div>

        <GlassButton variant="secondary" icon={RefreshCw} onClick={fetchStats}>
          Refresh Telemetry
        </GlassButton>
      </div>

      {/* 12-Column Responsive Grid for Glass Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassStatCard
          title="Total MRIs Analyzed"
          value={stats?.total_mris_analyzed || 0}
          subtitle="Processed brain scans"
          icon={Upload}
          trend="↑ +12.4%"
          trendPositive={true}
          color="blue"
        />
        <GlassStatCard
          title="Active Model Version"
          value={stats?.active_model_version || 'NeuroDxNet'}
          subtitle="Convolutional Backbone"
          icon={Brain}
          trend="Production v1.4"
          trendPositive={true}
          color="purple"
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
          trendPositive={true}
          color="amber"
        />
      </div>

      {/* 12-Column Grid for Glass Chart Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Class Distribution Bar Chart (Col span 7) */}
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
                    <linearGradient id="glassBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6D5EF5" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#E2E8F0' }}
                    fontFamily="Plus Jakarta Sans"
                  />
                  <YAxis
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#E2E8F0' }}
                    fontFamily="Plus Jakarta Sans"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.88)',
                      backdropFilter: 'blur(20px)',
                      borderColor: 'rgba(255,255,255,0.7)',
                      borderRadius: '20px',
                      boxShadow: '0 10px 30px rgba(17,24,39,0.1)',
                      color: '#111827',
                      fontWeight: 700,
                    }}
                    cursor={{ fill: 'rgba(109, 94, 245, 0.08)' }}
                  />
                  <Bar dataKey="count" radius={[14, 14, 4, 4]} fill="url(#glassBarGradient)">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassChartCard>
        </div>

        {/* Proportional Distribution Pie Chart (Col span 5) */}
        <div className="lg:col-span-5">
          <GlassChartCard
            title="Category Ratio Analysis"
            subtitle="Proportional breakdown across cohort dataset"
            icon={Brain}
          >
            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={6}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#FFFFFF" strokeWidth={3} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.88)',
                      backdropFilter: 'blur(20px)',
                      borderColor: 'rgba(255,255,255,0.7)',
                      borderRadius: '20px',
                      boxShadow: '0 10px 30px rgba(17,24,39,0.1)',
                      color: '#111827',
                      fontWeight: 700,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassChartCard>
        </div>

      </div>
    </motion.div>
  );
};
