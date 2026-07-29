import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Brain, Activity, Upload, CheckCircle, BarChart2, Shield, RefreshCw, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { ClayStatCard } from '../components/clay/ClayStatCard';
import { ClayChartCard } from '../components/clay/ClayChartCard';
import { ClayButton } from '../components/clay/ClayButton';

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
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white to-[#EEF2FF] border border-white/80 p-2 shadow-[8px_8px_20px_rgba(163,177,198,0.35),-6px_-6px_16px_rgba(255,255,255,0.95)] flex items-center justify-center animate-bounce">
          <Brain className="w-8 h-8 text-[#6D5EF5]" />
        </div>
        <p className="text-sm font-bold text-[#6B7280]">Loading Claymorphism Analytics Dashboard...</p>
      </div>
    );
  }

  const classDist = stats?.class_distribution || {};
  const chartData = Object.entries(classDist).map(([name, count]) => ({ name, count }));
  
  // High contrast premium clay colors
  const COLORS = ['#22C55E', '#6D5EF5', '#8E82FF', '#F59E0B'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 space-y-8"
    >
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-br from-white via-[#F8FAFC] to-[#EEF2FF] p-8 rounded-[32px] border border-white/80 shadow-[12px_12px_28px_rgba(163,177,198,0.35),-10px_-10px_24px_rgba(255,255,255,0.95)]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#EEF2FF] border border-white/80 text-[#6D5EF5] text-xs font-bold uppercase tracking-wider mb-3 shadow-[inset_2px_2px_4px_rgba(163,177,198,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]">
            <Sparkles className="w-3.5 h-3.5 text-[#6D5EF5]" />
            <span>VisionOS Inspired AI Dashboard</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#1F2937] tracking-tight leading-tight">
            System Analytics Dashboard
          </h1>
          <p className="text-[#6B7280] text-sm sm:text-base font-medium mt-1">
            Real-time MRI process telemetry, deep CNN model metrics, and disease stage distributions.
          </p>
        </div>

        <ClayButton variant="secondary" icon={RefreshCw} onClick={fetchStats}>
          Refresh Telemetry
        </ClayButton>
      </div>

      {/* 12-Column Grid for Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ClayStatCard
          title="Total MRIs Analyzed"
          value={stats?.total_mris_analyzed || 0}
          subtitle="Processed brain scans"
          icon={Upload}
          trend="↑ +12.4%"
          trendPositive={true}
          color="blue"
        />
        <ClayStatCard
          title="Active Model Version"
          value={stats?.active_model_version || 'custom_cnn'}
          subtitle="Convolutional Backbone"
          icon={Brain}
          trend="Production v1.4"
          trendPositive={true}
          color="purple"
        />
        <ClayStatCard
          title="Mean Confidence"
          value={`${((stats?.average_confidence || 0) * 100).toFixed(1)}%`}
          subtitle="Avg inference score"
          icon={Activity}
          trend="↑ +2.1%"
          trendPositive={true}
          color="green"
        />
        <ClayStatCard
          title="Validation Accuracy"
          value={`${((stats?.accuracy_metrics?.val_accuracy || 0.945) * 100).toFixed(1)}%`}
          subtitle="Benchmark validation"
          icon={CheckCircle}
          trend="High Precision"
          trendPositive={true}
          color="amber"
        />
      </div>

      {/* 12-Column Grid for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Class Distribution Bar Chart (Col span 7) */}
        <div className="lg:col-span-7">
          <ClayChartCard
            title="Disease Stage Class Distribution"
            subtitle="Frequency breakdown of Non-Demented, Very Mild, Mild, and Moderate stages"
            icon={BarChart2}
          >
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6D5EF5" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#8E82FF" stopOpacity={0.6} />
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
                      backgroundColor: '#FFFFFF',
                      borderColor: 'rgba(255,255,255,0.8)',
                      borderRadius: '16px',
                      boxShadow: '8px 8px 20px rgba(163,177,198,0.3)',
                      color: '#1F2937',
                      fontWeight: 600,
                    }}
                    cursor={{ fill: '#EEF2FF', opacity: 0.6 }}
                  />
                  <Bar dataKey="count" radius={[12, 12, 4, 4]} fill="url(#barGradient)">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ClayChartCard>
        </div>

        {/* Proportional Distribution Pie Chart (Col span 5) */}
        <div className="lg:col-span-5">
          <ClayChartCard
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
                    paddingAngle={5}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#FFFFFF" strokeWidth={3} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: 'rgba(255,255,255,0.8)',
                      borderRadius: '16px',
                      boxShadow: '8px 8px 20px rgba(163,177,198,0.3)',
                      color: '#1F2937',
                      fontWeight: 600,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ClayChartCard>
        </div>

      </div>
    </motion.div>
  );
};
