import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner = ({ text }) => {
  const message = text || (
    "DISCLAIMER: This system is designed solely as an AI-assisted research and educational decision-support tool. " +
    "It is NOT a certified diagnostic medical device and should not replace professional clinical diagnosis by a qualified neurologist."
  );

  return (
    <div className="bg-[#FEF3C7]/80 backdrop-blur-[20px] -webkit-backdrop-blur-[20px] border border-white/60 rounded-[28px] p-5 flex items-start space-x-4 text-[#92400E] text-xs sm:text-sm leading-relaxed shadow-[0_8px_25px_rgba(245,158,11,0.15)] my-4">
      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F59E0B] to-[#FBBF24] text-white flex items-center justify-center flex-shrink-0 shadow-md mt-0.5">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div>
        <span className="font-extrabold text-[#78350F] uppercase tracking-wider block mb-0.5">
          Medical & Educational Use Disclaimer
        </span>
        <p className="font-semibold text-[#854D0E]">{message}</p>
      </div>
    </div>
  );
};
