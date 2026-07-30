import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileImage, AlertCircle, ArrowRight, Loader2, User, Calendar, Droplet, Activity, CheckSquare, Square, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassInput } from '../components/glass/GlassInput';
import { GlassButton } from '../components/glass/GlassButton';
import { DEMO_PATIENTS } from '../data/demoPatients';

const ALZHEIMERS_SYMPTOMS = [
  "Memory loss disrupting daily life",
  "Challenges in planning or solving problems",
  "Difficulty completing familiar tasks",
  "Confusion with time, date, or location",
  "Trouble understanding visual images & spatial relationships",
  "New problems with words in speaking or writing",
  "Misplacing things & losing ability to retrace steps",
  "Decreased or poor judgment",
  "Withdrawal from work or social activities",
  "Changes in mood, personality, or behavior",
  "Disorientation or wandering tendency"
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [patientId, setPatientId] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [demoLoadedBanner, setDemoLoadedBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setError(null);

      // Create preview for standard images
      if (selected.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(selected);
      } else {
        setPreview(null);
      }
    }
  };

  const applyDemoPatient = (demoObj) => {
    if (!demoObj) return;
    setPatientName(demoObj.name);
    setPatientAge(demoObj.age.toString());
    setBloodGroup(demoObj.bloodGroup);
    setPatientId(demoObj.patientId);
    setSelectedSymptoms(demoObj.symptoms || []);
    setCustomSymptom(demoObj.notes || '');
    setDemoLoadedBanner(`Auto-filled: ${demoObj.name} (${demoObj.patientId}) - ${demoObj.age} yrs, ${demoObj.bloodGroup}`);
  };

  const handleRandomDemo = () => {
    const randomIndex = Math.floor(Math.random() * DEMO_PATIENTS.length);
    applyDemoPatient(DEMO_PATIENTS[randomIndex]);
  };

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an MRI image file.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    if (patientId) formData.append('patient_id', patientId);
    if (patientName) formData.append('patient_name', patientName);
    if (patientAge) formData.append('patient_age', patientAge);
    if (bloodGroup) formData.append('blood_group', bloodGroup);

    // Combine selected checkboxes and custom symptom text into array
    const allSymptoms = [...selectedSymptoms];
    if (customSymptom.trim()) {
      allSymptoms.push(customSymptom.trim());
    }
    if (allSymptoms.length > 0) {
      formData.append('symptoms', JSON.stringify(allSymptoms));
    }

    try {
      const res = await api.post('/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Pass prediction result to prediction page via state
      navigate('/prediction', { state: { prediction: res.data } });
    } catch (err) {
      console.error('Upload Error:', err);
      setError(err.response?.data?.detail || 'Failed to process MRI image. Please ensure valid format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8"
    >
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl sm:text-[48px] leading-tight font-extrabold text-[#1D1D1F] tracking-tight">
          Patient Intake & Brain MRI Upload
        </h1>
        <p className="text-[#6B7280] text-sm sm:text-base font-semibold">
          Enter patient details, select observed symptoms, and upload MRI scan for AI analysis
        </p>
      </div>

      <DisclaimerBanner />

      {demoLoadedBanner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-[20px] bg-[#DCFCE7]/60 backdrop-blur-[20px] border border-white/60 text-[#15803D] text-xs font-bold flex items-center justify-between shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.8)]"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <span>{demoLoadedBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setDemoLoadedBanner(null)}
            className="text-xs text-[#15803D] underline ml-4 hover:opacity-80 font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {error && (
        <div className="p-4 rounded-[22px] bg-[#FEE2E2]/60 backdrop-blur-[20px] border border-[#FCA5A5]/80 text-[#991B1B] text-sm flex items-center space-x-3 shadow-md">
          <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
          <span className="font-bold">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Patient General Demographics with single Demo Button */}
        <GlassCard hoverEffect={false} padding="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/30 pb-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-[15px] border border-white/60 p-0.5 shadow-sm flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4F8EF7] to-[#6D5EF5] flex items-center justify-center text-white">
                  <User className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1D1D1F]">1. Patient Demographic Details</h2>
                <p className="text-xs text-[#6B7280] font-semibold">Enter general medical identity details</p>
              </div>
            </div>

            {/* Single Demo Button placed on the right side of Section 1 */}
            <GlassButton
              type="button"
              variant="secondary"
              size="sm"
              icon={Sparkles}
              onClick={handleRandomDemo}
              className="w-full sm:w-auto text-xs whitespace-nowrap font-bold"
            >
              Fill Demo Patient Data
            </GlassButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <GlassInput
              label="Patient Name"
              icon={User}
              placeholder="e.g. John Doe"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />

            <GlassInput
              label="Age (Years)"
              icon={Calendar}
              type="number"
              min="1"
              max="120"
              placeholder="e.g. 68"
              value={patientAge}
              onChange={(e) => setPatientAge(e.target.value)}
            />

            {/* Blood Group Select */}
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-[#1D1D1F] ml-1 tracking-wide">
                Blood Group
              </label>
              <div className="relative flex items-center">
                <Droplet className="w-4 h-4 text-[#4F8EF7] absolute left-4 pointer-events-none z-10" />
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-[20px] bg-white/60 backdrop-blur-[18px] text-sm text-[#1D1D1F] font-semibold shadow-[inset_0_2px_4px_rgba(0,0,0,0.03),inset_0_1px_1px_0_rgba(255,255,255,0.8)] border border-white/80 focus:outline-none focus:border-[#4F8EF7] focus:bg-white/80 focus:ring-4 focus:ring-[#4F8EF7]/30 appearance-none cursor-pointer"
                >
                  <option value="">-- Select Blood Group --</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            <GlassInput
              label="Patient / Study ID (Optional)"
              icon={FileText}
              placeholder="e.g. PT-98231 or OAS1_0001"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
          </div>
        </GlassCard>

        {/* Section 2: Observed Symptoms Checklist */}
        <GlassCard hoverEffect={false} padding="p-6 sm:p-8">
          <div className="flex items-center space-x-3 border-b border-white/30 pb-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-[15px] border border-white/60 p-0.5 shadow-sm flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6D5EF5] to-[#7C6CFF] flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1D1D1F]">2. Symptoms & Clinical Observations</h2>
              <p className="text-xs text-[#6B7280] font-semibold">Select any symptoms currently exhibited by the patient</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ALZHEIMERS_SYMPTOMS.map((symptom) => {
              const isChecked = selectedSymptoms.includes(symptom);
              return (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => toggleSymptom(symptom)}
                  className={`p-3.5 rounded-[20px] text-left transition-all flex items-start space-x-3 border cursor-pointer ${
                    isChecked
                      ? 'bg-gradient-to-r from-[#EAF3FF] to-[#DCEBFF] border-[#4F8EF7] text-[#1D1D1F] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.8),0_4px_16px_rgba(79,142,247,0.20)] backdrop-blur-[15px]'
                      : 'bg-white/50 backdrop-blur-[15px] border-white/60 text-[#6B7280] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.6)] hover:text-[#1D1D1F] hover:bg-white/70'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-[#4F8EF7] flex-shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-5 h-5 text-[#9CA3AF] flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-xs leading-relaxed font-bold">{symptom}</span>
                </button>
              );
            })}
          </div>

          {/* Additional Notes */}
          <div className="space-y-2 pt-4">
            <label className="block text-xs font-extrabold text-[#1D1D1F] tracking-wider uppercase ml-1">
              Other Symptoms / Clinical Notes (Optional)
            </label>
            <textarea
              rows="2"
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              placeholder="Enter any additional behavioral or cognitive observations..."
              className="w-full p-4 rounded-[20px] bg-white/60 backdrop-blur-[18px] text-xs text-[#1D1D1F] placeholder-[#6B7280]/70 font-semibold shadow-[inset_0_2px_4px_rgba(0,0,0,0.03),inset_0_1px_1px_0_rgba(255,255,255,0.8)] border border-white/80 focus:outline-none focus:border-[#4F8EF7] focus:bg-white/80 focus:ring-4 focus:ring-[#4F8EF7]/30 transition-all"
            />
          </div>
        </GlassCard>

        {/* Section 3: MRI Scan Upload */}
        <GlassCard hoverEffect={false} padding="p-6 sm:p-8">
          <div className="flex items-center space-x-3 border-b border-white/30 pb-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-[15px] border border-white/60 p-0.5 shadow-sm flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#22C55E] to-[#4ADE80] flex items-center justify-center text-white">
                <Upload className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1D1D1F]">3. Upload Patient Brain MRI Scan</h2>
              <p className="text-xs text-[#6B7280] font-semibold">Supported formats: DICOM (.dcm), NIfTI (.nii, .nii.gz), PNG, JPG (Max 25MB)</p>
            </div>
          </div>

          {/* Apple VisionOS Floating Glass Dropzone Panel */}
          <div className="relative overflow-hidden rounded-[28px] p-8 text-center bg-white/45 backdrop-blur-[25px] border-2 border-dashed border-[#4F8EF7]/50 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.8),0_12px_36px_rgba(31,38,135,0.10)] group hover:border-[#4F8EF7] hover:bg-white/60 transition-all">
            {/* Top Sheen */}
            <div 
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 100%)'
              }}
            />

            <input
              type="file"
              onChange={handleFileChange}
              accept=".png,.jpg,.jpeg,.dcm,.dicom,.nii,.gz"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />

            {preview ? (
              <div className="relative z-10 space-y-3">
                <img src={preview} alt="MRI Preview" className="max-h-56 mx-auto rounded-[24px] border border-white/60 object-contain shadow-lg" />
                <p className="text-xs font-extrabold text-[#4F8EF7]">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
              </div>
            ) : (
              <div className="relative z-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/50 backdrop-blur-[15px] border border-white/70 p-1 shadow-lg flex items-center justify-center mx-auto text-[#4F8EF7] group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <span className="block text-base font-extrabold text-[#1D1D1F]">Click or drag brain MRI scan here</span>
                  <span className="block text-xs text-[#6B7280] font-semibold mt-1">DICOM, NIfTI, PNG or JPG files up to 25MB</span>
                </div>
                {file && (
                  <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-[15px] border border-white/80 text-[#1D1D1F] text-xs font-mono font-bold shadow-sm">
                    <FileImage className="w-4 h-4 text-[#4F8EF7]" />
                    <span>{file.name}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </GlassCard>

        {/* Submit Button */}
        <GlassButton
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading || !file}
          className="w-full py-4 text-base font-bold"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing Patient Data & Analyzing MRI...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Run AI Prediction & Grad-CAM Analysis</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          )}
        </GlassButton>
      </form>
    </motion.div>
  );
};
