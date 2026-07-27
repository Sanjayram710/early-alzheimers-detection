import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileImage, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [patientId, setPatientId] = useState('');
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
        <h1 className="font-display text-3xl font-bold text-white">Upload Brain MRI Scan</h1>
        <p className="text-slate-400 text-sm">Supported formats: DICOM (.dcm), NIfTI (.nii, .nii.gz), PNG, JPG (Max 25MB)</p>
      </div>

      <DisclaimerBanner />

      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          
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

          {/* Patient / Study ID input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Patient / Study Identifier (Optional)
            </label>
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="e.g. PT-98231 or OAS1_0001"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 text-base"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing MRI Scan with Deep Learning...</span>
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
