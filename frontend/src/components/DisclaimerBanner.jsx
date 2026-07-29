import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner = ({ text }) => {
  const message = text || (
    "DISCLAIMER: This system is designed solely as an AI-assisted research and educational decision-support tool. " +
    "It is NOT a certified diagnostic medical device and should not replace professional clinical diagnosis by a qualified neurologist."
  );

  return (
    <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border border-white/80 rounded-[22px] p-5 flex items-start space-x-3.5 text-[#92400E] text-xs sm:text-sm leading-relaxed shadow-[8px_8px_20px_rgba(245,158,11,0.15),-6px_-6px_16px_rgba(255,255,255,0.9)] my-4">
      <div className="w-9 h-9 rounded-full bg-[#F59E0B] text-white flex items-center justify-center flex-shrink-0 shadow-md mt-0.5">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div>
        <span className="font-extrabold text-[#78350F] uppercase tracking-wider block mb-0.5">
          Medical & Educational Use Disclaimer
        </span>
        <p className="font-medium text-[#854D0E]">{message}</p>
      </div>
    </div>
  );
};
