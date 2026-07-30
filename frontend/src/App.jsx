import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { UploadPage } from './pages/UploadPage';
import { PredictionPage } from './pages/PredictionPage';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { ReportsPage } from './pages/ReportsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="relative flex flex-col min-h-screen">
          {/* Apple Liquid Glass Layered Background Gradient & Animated Blobs */}
          <div className="bg-glass-orbs">
            <div className="bg-glass-orb-1" />
            <div className="bg-glass-orb-2" />
            <div className="bg-glass-orb-3" />
            <div className="bg-glass-orb-4" />
          </div>

          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-6 sm:pt-10 pb-16">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="/register" element={<Navigate to="/" replace />} />

                {/* Direct Access Routes */}
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/prediction" element={<PredictionPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
