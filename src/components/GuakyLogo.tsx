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
      {/* GÜAKY Macaw Vector Avatar */}
      <div className={`relative ${iconSizes[size]} shrink-0 transition-transform duration-300 hover:scale-105`}>
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Subtle Outer World Ring */}
          <circle cx="100" cy="100" r="95" stroke="#E6ECEF" strokeWidth="2.5" strokeDasharray="4 4" fill="#FFFDF8" />
          <circle cx="100" cy="100" r="88" fill="#F8FAFA" />

          {/* Guacamaya Head Base (Egg/Oval Silhouette) */}
          <ellipse cx="100" cy="108" rx="60" ry="70" fill="#2EC4B6" stroke="#243447" strokeWidth="6" />

          {/* Crest Feathers (Yellow & Coral accents) */}
          {/* Top crest feather */}
          <path
            d="M 90 42 C 95 32, 130 30, 145 48 C 130 52, 110 52, 95 48 Z"
            fill="#FFD166"
            stroke="#243447"
            strokeWidth="5"
          />
          {/* Side feather Coral */}
          <path
            d="M 52 75 C 38 65, 42 90, 52 98 C 58 92, 58 82, 52 75 Z"
            fill="#FF6B4A"
            stroke="#243447"
            strokeWidth="5"
          />
          {/* Side feather Yellow */}
          <path
            d="M 54 58 C 42 50, 48 70, 56 75 C 60 70, 60 62, 54 58 Z"
            fill="#FFD166"
            stroke="#243447"
            strokeWidth="5"
          />
          {/* Side feather Teal */}
          <path
            d="M 60 42 C 50 35, 58 52, 65 58 C 68 52, 66 46, 60 42 Z"
            fill="#2EC4B6"
            stroke="#243447"
            strokeWidth="5"
          />

          {/* World Grid Lines on Forehead (Curiosity & Globe Discovery) */}
          <path d="M 75 75 Q 100 68 125 75" stroke="#259C90" strokeWidth="2.5" fill="none" />
          <path d="M 72 88 Q 100 80 128 88" stroke="#259C90" strokeWidth="2.5" fill="none" />
          <path d="M 100 60 L 100 95" stroke="#259C90" strokeWidth="2.5" fill="none" />

          {/* White Mask / Cheek Patches around Eyes */}
          <path
            d="M 58 105 C 58 85, 78 80, 92 88 C 96 102, 92 125, 80 138 C 65 135, 58 122, 58 105 Z"
            fill="#FFFDF8"
            stroke="#243447"
            strokeWidth="5"
          />
          <path
            d="M 142 105 C 142 85, 122 80, 108 88 C 104 102, 108 125, 120 138 C 135 135, 142 122, 142 105 Z"
            fill="#FFFDF8"
            stroke="#243447"
            strokeWidth="5"
          />

          {/* Eyes (Curious, Big & Warm) */}
          {/* Left Eye */}
          <ellipse cx="80" cy="106" rx="13" ry="18" fill="#243447" />
          <circle cx="83" cy="100" r="5" fill="#FFFFFF" />
          <circle cx="77" cy="112" r="2.5" fill="#FFFFFF" />

          {/* Right Eye */}
          <ellipse cx="120" cy="106" rx="13" ry="18" fill="#243447" />
          <circle cx="123" cy="100" r="5" fill="#FFFFFF" />
          <circle cx="117" cy="112" r="2.5" fill="#FFFFFF" />

          {/* Beak & Chin (Warm Coral & Sun Gold) */}
          {/* Lower Neck / Chest Gold */}
          <path
            d="M 80 148 L 100 148 L 100 176 C 90 174, 82 165, 80 148 Z"
            fill="#FFD166"
            stroke="#243447"
            strokeWidth="5"
          />
          <path
            d="M 100 148 L 120 148 C 118 165, 110 174, 100 176 Z"
            fill="#FF6B4A"
            stroke="#243447"
            strokeWidth="5"
          />

          {/* Beak Upper (Center Curved) */}
          <path
            d="M 88 116 C 88 100, 112 100, 112 116 C 112 135, 100 156, 100 156 C 100 156, 88 135, 88 116 Z"
            fill="#FF9248"
            stroke="#243447"
            strokeWidth="5.5"
          />
          {/* Beak Split Dual Tone */}
          <path
            d="M 100 102 C 108 102, 112 110, 112 116 C 112 135, 100 156, 100 156 Z"
            fill="#FF6B4A"
          />
          <path
            d="M 88 116 C 88 106, 94 102, 100 102 L 100 156 C 100 156, 88 135, 88 116 Z"
            fill="#FFB03A"
          />
          {/* Little Nostrils */}
          <circle cx="95" cy="112" r="1.5" fill="#243447" />
          <circle cx="105" cy="112" r="1.5" fill="#243447" />
        </svg>
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
