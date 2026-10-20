import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'full' | 'compact' | 'symbol';
  theme?: 'light' | 'dark';
}

/**
 * NammaPrayanaLogo
 * 
 * Preserves the exact small Karnataka travel logo icon on the left,
 * paired with the 3 branding text lines on the right:
 * Line 1: ನಮ್ಮ (teal) ಪ್ರಯಾಣ (orange) in Kannada font
 * Line 2: — NAMMA PRAYANA — (bold uppercase lettering with subtle orange dashes)
 * Line 3: Your Journey, Your Story ✈ (smaller muted text)
 * 
 * Supports theme='light' (for header/white backgrounds) and theme='dark' (for dark footer).
 */
export const NammaPrayanaLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  theme = 'light',
}) => {
  const [useFallback, setUseFallback] = useState(false);

  // Scaled dimensions according to size
  const config = {
    sm: {
      iconSize: 38,
      line1: 'text-[15px]',
      line2: 'text-[9px]',
      line3: 'text-[8.5px]',
      dashSize: 'text-[7px]',
      planeSize: 'text-[9px]',
      gap: 'gap-2',
    },
    md: {
      iconSize: 46,
      line1: 'text-[17px] sm:text-[18px]',
      line2: 'text-[10px] sm:text-[10.5px]',
      line3: 'text-[9.5px] sm:text-[10px]',
      dashSize: 'text-[8px] sm:text-[9px]',
      planeSize: 'text-[10px]',
      gap: 'gap-2.5 sm:gap-3',
    },
    lg: {
      iconSize: 58,
      line1: 'text-xl sm:text-2xl',
      line2: 'text-xs',
      line3: 'text-[11px]',
      dashSize: 'text-[10px]',
      planeSize: 'text-xs',
      gap: 'gap-3',
    },
    xl: {
      iconSize: 76,
      line1: 'text-2xl sm:text-3xl',
      line2: 'text-sm',
      line3: 'text-xs',
      dashSize: 'text-xs',
      planeSize: 'text-sm',
      gap: 'gap-4',
    },
  }[size] || {
    iconSize: 46,
    line1: 'text-[17px] sm:text-[18px]',
    line2: 'text-[10px] sm:text-[10.5px]',
    line3: 'text-[9.5px] sm:text-[10px]',
    dashSize: 'text-[8px] sm:text-[9px]',
    planeSize: 'text-[10px]',
    gap: 'gap-2.5 sm:gap-3',
  };

  const isDark = theme === 'dark';

  return (
    <div className={`inline-flex items-center ${config.gap} select-none ${className}`}>
      {/* Existing small Karnataka travel logo icon on the left (rounded-full clips circular emblem smoothly) */}
      <img
        src={useFallback ? '/logo.png' : '/images/namma-prayana-logo.png'}
        alt="Namma Prayana (ನಮ್ಮ ಪ್ರಯಾಣ)"
        onError={() => {
          if (!useFallback) {
            setUseFallback(true);
          }
        }}
        style={{
          height: `${config.iconSize}px`,
          width: `${config.iconSize}px`,
          objectFit: 'contain',
        }}
        className="shrink-0 rounded-full transition-transform duration-200 hover:scale-105"
        loading="eager"
      />

      {/* Three lines of branding text on the right */}
      {variant !== 'symbol' && (
        <div className="flex flex-col justify-center text-left leading-none tracking-tight">
          {/* Line 1: ನಮ್ಮ (teal) ಪ್ರಯಾಣ (orange) */}
          <div className={`font-kannada font-black tracking-tight leading-tight pb-0.5 ${config.line1}`}>
            <span className={isDark ? 'text-teal-300' : 'text-[#0f4c5c]'}>ನಮ್ಮ</span>{' '}
            <span className={isDark ? 'text-amber-400' : 'text-[#e36414]'}>ಪ್ರಯಾಣ</span>
          </div>

          {/* Line 2: NAMMA PRAYANA with subtle orange decorative dashes on either side */}
          <div className={`flex items-center gap-1 font-black uppercase tracking-wider leading-tight mt-0.5 ${config.line2} ${isDark ? 'text-white' : 'text-stone-900'}`}>
            <span className={`${isDark ? 'text-amber-400' : 'text-[#e36414]'} font-bold select-none ${config.dashSize}`}>—</span>
            <span className="tracking-widest">NAMMA PRAYANA</span>
            <span className={`${isDark ? 'text-amber-400' : 'text-[#e36414]'} font-bold select-none ${config.dashSize}`}>—</span>
          </div>

          {/* Line 3: Your Journey, Your Story ✈ (hidden on tiny screens to avoid header crowding) */}
          <div className={`font-medium tracking-tight hidden sm:flex items-center gap-1 leading-none mt-0.5 ${config.line3} ${isDark ? 'text-stone-300' : 'text-stone-500'}`}>
            <span>Your Journey, Your Story</span>
            <span className={`text-amber-400 font-bold inline-block -rotate-12 ${config.planeSize}`}>✈</span>
          </div>
        </div>
      )}
    </div>
  );
};
