import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'monogram';
  invert?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'full' }) => {
  return (
    <Link 
      to="/" 
      id="brand-logo"
      className={`group inline-flex items-center gap-3.5 select-none text-left tracking-normal transition-opacity hover:opacity-90 ${className}`}
    >
      {/* Sleek architectural monogram framing icon */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 bg-[#111111] text-white shadow-sm transition-all duration-300 group-hover:border-[#E11D48] group-hover:bg-[#1A1A1A]">
        <span className="font-monogram text-sm font-black tracking-widest text-[#F5F5F4]">
          AL
        </span>
        {/* Crisp crimson red focal corner markers symbolizing the camera crop marks */}
        <span className="absolute -top-[1px] -left-[1px] h-1.5 w-1.5 border-t-2 border-l-2 border-[#E11D48]" />
        <span className="absolute -bottom-[1px] -right-[1px] h-1.5 w-1.5 border-b-2 border-r-2 border-[#E11D48]" />
      </div>

      {variant !== 'monogram' && (
        <div className="flex flex-col justify-center">
          <span className="font-display text-xl sm:text-2xl font-semibold tracking-[0.02em] leading-none text-[#F5F5F4] uppercase transition-colors group-hover:text-white">
            ALAN LUBY
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.3em] text-[#E11D48] uppercase mt-0.5">
            PHOTOGRAPHY
          </span>
        </div>
      )}
    </Link>
  );
};
