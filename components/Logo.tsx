
import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`font-serif font-bold text-slate-800 tracking-[0.2em] select-none ${className}`}>
      智音 ZhiYin
    </div>
  );
};
