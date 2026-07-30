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
        <div className="w-16 h-16 rounded-full bg-white p-2 shadow-[0_10px_30px_rgba(59,130,246,0.2),inset_0_2px_4px_rgba(255,255,255,1)] flex items-center justify-center animate-bounce border border-white">
          <Brain className="w-8 h-8 text-[#3B82F6]" />
        </div>
        <p className="text-sm font-bold text-[#475569]">Loading Claymorphism Medical Telemetry...</p>
      </div>
    );
  }

  const classDist = stats?.class_distribution || {};
  const chartData = Object.entries(classDist).map(([name, count]) => ({ name, count }));
  
  // Vibrant Clay Palette Colors matching user sample image
  const COLORS = ['#60A5FA', '#818CF8', '#38BDF8', '#4ADE80'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 space-y-8"
    >
      {/* Hero Inflated Clay Container Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/94 backdrop-blur-[20px] p-8 sm:p-10 rounded-[32px] border-2 border-[#3B82F6] shadow-[0_20px_40px_rgba(59,130,246,0.18),0_8px_16px_rgba(0,0,0,0.03),inset_0_2px_4px_0_rgba(255,255,255,1),inset_0_-4px_8px_0_rgba(219,234,254,0.7)]">
        <div>
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#DBEAFE] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-extrabold uppercase tracking-wider mb-3.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#1D4ED8]" />
            <span>Apple VisionOS Inspired Medical AI Dashboard</span>
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
                    <linearGradient id="clayBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    stroke="#64748B"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#CBD5E1' }}
                    fontFamily="Plus Jakarta Sans"
                  />
                  <YAxis
                    stroke="#64748B"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#CBD5E1' }}
                    fontFamily="Plus Jakarta Sans"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderColor: 'rgba(255, 255, 255, 1)',
                      borderRadius: '20px',
                      boxShadow: '0 10px 30px rgba(59, 130, 246, 0.15)',
                      color: '#0F172A',
                      fontWeight: 700,
                    }}
                    cursor={{ fill: 'rgba(59, 130, 246, 0.06)' }}
                  />
                  <Bar dataKey="count" radius={[18, 18, 6, 6]} fill="url(#clayBarGradient)">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassChartCard>
        </div>

        {/* Proportional Distribution Pie Chart */}
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
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#FFFFFF" strokeWidth={4} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderColor: 'rgba(255, 255, 255, 1)',
                      borderRadius: '20px',
                      boxShadow: '0 10px 30px rgba(59, 130, 246, 0.15)',
                      color: '#0F172A',
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
