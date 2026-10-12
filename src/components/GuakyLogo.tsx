import React from 'react';

interface GuakyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
}

export const GuakyLogo: React.FC<GuakyLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  showSubtitle = false
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* GÜAKY Macaw Avatar */}
      <div className={`relative ${iconSizes[size]} shrink-0 transition-transform duration-300 hover:scale-105`}>
        <img 
          src="/guaky-face.svg" 
          alt="Güaky" 
          className="w-full h-full object-contain drop-shadow-xs" 
        />
      </div>

      {/* Brand Typographic Wordmark */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center">
            <span className={`font-fredoka font-semibold tracking-tight text-[#243447] ${textSizes[size]}`}>
              G
            </span>
            {/* The Ü with Teal & Coral Dots */}
            <span className="relative inline-flex flex-col items-center">
              <span className="flex gap-[3px] mb-[-4px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2EC4B6]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" />
              </span>
              <span className={`font-fredoka font-semibold tracking-tight text-[#243447] ${textSizes[size]}`}>
                U
              </span>
            </span>
            <span className={`font-fredoka font-semibold tracking-tight text-[#243447] ${textSizes[size]}`}>
              AKYTOPIA
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[10px] sm:text-[11px] font-outfit font-semibold uppercase tracking-wider text-[#2EC4B6] mt-0.5">
              Open the World
            </span>
          )}
        </div>
      )}
    </div>
  );
};
