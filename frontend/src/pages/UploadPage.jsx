import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileImage, AlertCircle, ArrowRight, Loader2, User, Calendar, Droplet, Activity, CheckSquare, Square, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { ClayCard } from '../components/clay/ClayCard';
import { ClayInput } from '../components/clay/ClayInput';
import { ClayButton } from '../components/clay/ClayButton';
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
        <h1 className="font-display text-3xl sm:text-[42px] leading-tight font-extrabold text-[#1F2937] tracking-tight">
          Patient Intake & Brain MRI Upload
        </h1>
        <p className="text-[#6B7280] text-sm sm:text-base font-medium">
          Enter patient details, select observed symptoms, and upload MRI scan for AI analysis
        </p>
      </div>

      <DisclaimerBanner />

      {demoLoadedBanner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3.5 rounded-[20px] bg-[#DCFCE7] border border-white/80 text-[#15803D] text-xs font-bold flex items-center justify-between shadow-[inset_2px_2px_4px_rgba(163,177,198,0.2)]"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <span>{demoLoadedBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setDemoLoadedBanner(null)}
            className="text-xs text-[#15803D] underline ml-4 hover:opacity-80 font-bold"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {error && (
        <div className="p-4 rounded-[22px] bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] text-sm flex items-center space-x-3 shadow-[6px_6px_16px_rgba(239,68,68,0.2)]">
          <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
          <span className="font-bold">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Patient General Demographics with single Demo Button */}
        <ClayCard hoverEffect={false} padding="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/70 pb-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-[#EEF2FF] border border-white/80 p-0.5 shadow-[4px_4px_10px_rgba(163,177,198,0.3)] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6D5EF5] to-[#8E82FF] flex items-center justify-center text-white">
                  <User className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1F2937]">1. Patient Demographic Details</h2>
                <p className="text-xs text-[#6B7280] font-medium">Enter general medical identity details</p>
              </div>
            </div>

            {/* Single Demo Button placed on the right side of Section 1 */}
            <ClayButton
              type="button"
              variant="secondary"
              size="sm"
              icon={Sparkles}
              onClick={handleRandomDemo}
              className="w-full sm:w-auto text-xs whitespace-nowrap font-bold"
            >
              Fill Demo Patient Data
            </ClayButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ClayInput
              label="Patient Name"
              icon={User}
              placeholder="e.g. John Doe"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />

            <ClayInput
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
              <label className="block text-xs font-semibold text-[#1F2937] ml-1 tracking-wide">
                Blood Group
              </label>
              <div className="relative flex items-center">
                <Droplet className="w-4 h-4 text-[#6D5EF5] absolute left-4 pointer-events-none" />
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-[22px] bg-[#F4F6FB] text-sm text-[#1F2937] font-medium shadow-[inset_4px_4px_8px_rgba(163,177,198,0.35),inset_-4px_-4px_8px_rgba(255,255,255,0.95)] border border-white/60 focus:outline-none focus:border-[#6D5EF5] focus:ring-2 focus:ring-[#6D5EF5]/20 appearance-none cursor-pointer"
                >
                  <option value="">-- Select Blood Group --</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            <ClayInput
              label="Patient / Study ID (Optional)"
              icon={FileText}
              placeholder="e.g. PT-98231 or OAS1_0001"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
          </div>
        </ClayCard>

        {/* Section 2: Observed Symptoms Checklist */}
        <ClayCard hoverEffect={false} padding="p-6 sm:p-8">
          <div className="flex items-center space-x-3 border-b border-slate-200/70 pb-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-[#EEF2FF] border border-white/80 p-0.5 shadow-[4px_4px_10px_rgba(163,177,198,0.3)] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8E82FF] to-[#6D5EF5] flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1F2937]">2. Symptoms & Clinical Observations</h2>
              <p className="text-xs text-[#6B7280] font-medium">Select any symptoms currently exhibited by the patient</p>
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
                  className={`p-3.5 rounded-[20px] text-left transition-all flex items-start space-x-3 border ${
                    isChecked
                      ? 'bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] border-[#6D5EF5] text-[#1F2937] shadow-[6px_6px_14px_rgba(109,94,245,0.2)]'
                      : 'bg-[#F4F6FB] border-white/80 text-[#6B7280] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.2),inset_-3px_-3px_6px_rgba(255,255,255,0.9)] hover:text-[#1F2937]'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-[#6D5EF5] flex-shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-5 h-5 text-[#9CA3AF] flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-xs leading-relaxed font-semibold">{symptom}</span>
                </button>
              );
            })}
          </div>

          {/* Additional Notes */}
          <div className="space-y-2 pt-4">
            <label className="block text-xs font-semibold text-[#1F2937] tracking-wider uppercase ml-1">
              Other Symptoms / Clinical Notes (Optional)
            </label>
            <textarea
              rows="2"
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              placeholder="Enter any additional behavioral or cognitive observations..."
              className="w-full p-4 rounded-[22px] bg-[#F4F6FB] text-xs text-[#1F2937] placeholder-[#9CA3AF] font-medium shadow-[inset_4px_4px_8px_rgba(163,177,198,0.35),inset_-4px_-4px_8px_rgba(255,255,255,0.95)] border border-white/60 focus:outline-none focus:border-[#6D5EF5] transition-colors"
            />
          </div>
        </ClayCard>

        {/* Section 3: MRI Scan Upload */}
        <ClayCard hoverEffect={false} padding="p-6 sm:p-8">
          <div className="flex items-center space-x-3 border-b border-slate-200/70 pb-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-[#EEF2FF] border border-white/80 p-0.5 shadow-[4px_4px_10px_rgba(163,177,198,0.3)] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#22C55E] to-[#4ADE80] flex items-center justify-center text-white">
                <Upload className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1F2937]">3. Upload Patient Brain MRI Scan</h2>
              <p className="text-xs text-[#6B7280] font-medium">Supported formats: DICOM (.dcm), NIfTI (.nii, .nii.gz), PNG, JPG (Max 25MB)</p>
            </div>
          </div>

          {/* Indented Clay Dropzone Slot */}
          <div className="relative rounded-[28px] p-8 text-center bg-[#F4F6FB] border border-white/80 shadow-[inset_6px_6px_14px_rgba(163,177,198,0.3),inset_-6px_-6px_14px_rgba(255,255,255,0.95)] group hover:border-[#6D5EF5] transition-all">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".png,.jpg,.jpeg,.dcm,.dicom,.nii,.gz"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            {preview ? (
              <div className="space-y-3">
                <img src={preview} alt="MRI Preview" className="max-h-56 mx-auto rounded-[20px] border border-white/80 object-contain shadow-[8px_8px_20px_rgba(163,177,198,0.3)]" />
                <p className="text-xs font-bold text-[#6D5EF5]">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white to-[#EEF2FF] border border-white/80 p-1 shadow-[6px_6px_16px_rgba(163,177,198,0.3),-4px_-4px_12px_rgba(255,255,255,0.95)] flex items-center justify-center mx-auto text-[#6D5EF5] group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <span className="block text-base font-bold text-[#1F2937]">Click or drag brain MRI scan here</span>
                  <span className="block text-xs text-[#6B7280] font-medium mt-1">DICOM, NIfTI, PNG or JPG files up to 25MB</span>
                </div>
                {file && (
                  <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-white/80 text-[#1F2937] text-xs font-mono font-bold shadow-md">
                    <FileImage className="w-4 h-4 text-[#6D5EF5]" />
                    <span>{file.name}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </ClayCard>

        {/* Submit Button */}
        <ClayButton
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
        </ClayButton>
      </form>
    </motion.div>
  );
};
