import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner = ({ text }) => {
  const message = text || (
    "DISCLAIMER: This system is designed solely as an AI-assisted research and educational decision-support tool. " +
    "It is NOT a certified diagnostic medical device and should not replace professional clinical diagnosis by a qualified neurologist."
  );

  return (
    <div className="bg-[rgba(255,243,205,0.55)] backdrop-blur-[20px] -webkit-backdrop-blur-[20px] border border-white/80 rounded-[24px] p-5 flex items-start space-x-4 text-[#7A4B00] text-xs sm:text-sm leading-relaxed shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.9),0_12px_32px_rgba(245,158,11,0.12)] my-4">
      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F59E0B] to-[#FBBF24] text-white flex items-center justify-center flex-shrink-0 shadow-md mt-0.5 border border-white/60">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div>
        <span className="font-extrabold text-[#7A4B00] uppercase tracking-wider block mb-0.5">
          Medical & Educational Use Disclaimer
        </span>
        <p className="font-semibold text-[#7A4B00]">{message}</p>
      </div>
    </div>
  );
};
