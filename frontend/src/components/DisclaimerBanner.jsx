import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner = ({ text }) => {
  const message = text || (
    "DISCLAIMER: This system is designed solely as an AI-assisted research and educational decision-support tool. " +
    "It is NOT a certified diagnostic medical device and should not replace professional clinical diagnosis by a qualified neurologist."
  );

  return (
    <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-[28px] p-5 flex items-start space-x-4 text-[#B45309] text-xs sm:text-sm leading-relaxed shadow-[0_10px_25px_rgba(245,158,11,0.12),inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(254,243,199,0.8)] my-4">
      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F59E0B] to-[#FBBF24] text-white flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(245,158,11,0.3),inset_0_1.5px_2px_rgba(255,255,255,0.7)] mt-0.5 border border-white/60">
        <AlertTriangle className="w-5 h-5 text-white" />
      </div>
      <div>
        <span className="font-extrabold text-[#92400E] uppercase tracking-wider block mb-0.5">
          Medical & Educational Use Disclaimer
        </span>
        <p className="font-semibold text-[#B45309]">{message}</p>
      </div>
    </div>
  );
};
