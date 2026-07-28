import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileImage, AlertCircle, ArrowRight, Loader2, User, Calendar, Droplet, Activity, CheckSquare, Square, FileText } from 'lucide-react';
import api from '../services/api';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl font-extrabold text-white">Patient Intake & Brain MRI Upload</h1>
        <p className="text-slate-400 text-sm">Enter patient details, select observed symptoms, and upload MRI scan for AI analysis</p>
      </div>

      <DisclaimerBanner />

      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Patient General Demographics */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">1. Patient Demographic Details</h2>
              <p className="text-xs text-slate-400">Enter general medical identity details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Patient Name */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Patient Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Patient Age */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Age (Years)
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="e.g. 68"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Blood Group */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Blood Group
              </label>
              <div className="relative">
                <Droplet className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                >
                  <option value="">-- Select Blood Group --</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Patient / Study ID */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Patient / Study ID (Optional)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="e.g. PT-98231 or OAS1_0001"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Observed Symptoms Checklist */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">2. Alzheimer's Symptoms & Clinical Observations</h2>
              <p className="text-xs text-slate-400">Select any symptoms currently exhibited by the patient</p>
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
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start space-x-3 ${
                    isChecked
                      ? 'bg-purple-600/15 border-purple-500/50 text-purple-200 shadow-md shadow-purple-950/40'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-xs leading-relaxed font-medium">{symptom}</span>
                </button>
              );
            })}
          </div>

          {/* Additional Notes */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Other Symptoms / Clinical Notes (Optional)
            </label>
            <textarea
              rows="2"
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              placeholder="Enter any additional behavioral or cognitive observations..."
              className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* Section 3: MRI Scan Upload */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">3. Upload Patient Brain MRI Scan</h2>
              <p className="text-xs text-slate-400">Supported formats: DICOM (.dcm), NIfTI (.nii, .nii.gz), PNG, JPG (Max 25MB)</p>
            </div>
          </div>

          {/* File Upload Box */}
          <div className="relative border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-xl p-8 text-center transition-all bg-slate-900/40 group">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".png,.jpg,.jpeg,.dcm,.dicom,.nii,.gz"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            {preview ? (
              <div className="space-y-3">
                <img src={preview} alt="MRI Preview" className="max-h-56 mx-auto rounded-lg border border-slate-700 object-contain shadow-lg" />
                <p className="text-xs font-semibold text-blue-400">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400 group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <span className="block text-base font-semibold text-white">Click or drag brain MRI scan here</span>
                  <span className="block text-xs text-slate-400 mt-1">DICOM, NIfTI, PNG or JPG files up to 25MB</span>
                </div>
                {file && (
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-mono">
                    <FileImage className="w-4 h-4 text-blue-400" />
                    <span>{file.name}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !file}
          className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 text-base"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing Patient Data & Analyzing MRI...</span>
            </>
          ) : (
            <>
              <span>Run AI Prediction & Grad-CAM Analysis</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
