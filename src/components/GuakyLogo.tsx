import React from 'react';

interface GuakyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
}

export const GuakyLogo: React.FC<GuakyLogoProps> = ({
  className = '',
  size = 'md'
}) => {
  const heights = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-18'
  };

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img 
        src="/guakytopia-logo-horizontal.png" 
        alt="Güakytopia" 
        className={`${heights[size]} w-auto object-contain`} 
        onError={(e) => {
          e.currentTarget.style.visibility = 'hidden';
        }}
      />
    </div>
  );
};
