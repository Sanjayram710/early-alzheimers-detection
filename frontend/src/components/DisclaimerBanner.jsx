import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner = ({ text }) => {
  const message = text || (
    "DISCLAIMER: This system is designed solely as an AI-assisted research and educational decision-support tool. " +
    "It is NOT a certified diagnostic medical device and should not replace professional clinical diagnosis by a qualified neurologist."
  );

  return (
    <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-4 flex items-start space-x-3 text-amber-200 text-xs sm:text-sm leading-relaxed shadow-lg backdrop-blur-sm my-4">
      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
      <div>
        <span className="font-bold text-amber-400 uppercase tracking-wider block mb-0.5">Medical & Educational Use Disclaimer</span>
        <p>{message}</p>
      </div>
    </div>
  );
};
