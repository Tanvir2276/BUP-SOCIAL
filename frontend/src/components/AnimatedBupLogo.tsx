import React from 'react';

interface AnimatedBupLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const AnimatedBupLogo: React.FC<AnimatedBupLogoProps> = ({
  size = 'md',
  showText = true,
}) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8 sm:w-9 sm:h-9', text: 'text-base sm:text-lg', sub: 'text-[9px]' },
    md: { box: 'w-10 h-10 sm:w-11 sm:h-11', text: 'text-lg sm:text-xl', sub: 'text-[10px]' },
    lg: { box: 'w-12 h-12 sm:w-14 sm:h-14', text: 'text-xl sm:text-2xl', sub: 'text-xs' },
    xl: { box: 'w-16 h-16 sm:w-20 sm:h-20', text: 'text-2xl sm:text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 select-none group shrink-0">
      {/* Reference Design: Stylized Circular Academic B Emblem with Cap & Leaves */}
      <div className={`relative ${currentSize.box} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        {/* Soft Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-blue-500/20 dark:bg-blue-500/30 blur-sm group-hover:blur-md transition-all" />

        {/* Circular Emblem SVG */}
        <svg
          viewBox="0 0 100 100"
          className="relative w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Circular Badge Base */}
          <circle cx="50" cy="50" r="47" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2.5" />

          {/* Inner Accent Ring */}
          <circle cx="50" cy="50" r="43" stroke="#f1f5f9" strokeWidth="1.5" />

          {/* Stylized Modern 'B' in Royal Blue / Navy Gradient */}
          <path
            d="M 28 24 L 28 76 L 46 76 C 58 76 68 68 68 58 C 68 51.5 63 47.5 56 45.5 C 61.5 43.5 65 38.5 65 33 C 65 25.5 57.5 24 46 24 Z"
            fill="url(#bupLogoGrad)"
          />

          {/* Top Loop Cutout */}
          <path
            d="M 38 33 L 45 33 C 50 33 54.5 35 54.5 39 C 54.5 43 50 45 45 45 L 38 45 Z"
            fill="#ffffff"
          />

          {/* Bottom Loop Cutout */}
          <path
            d="M 38 54 L 46 54 C 52 54 57 56.5 57 62.5 C 57 68 52 70 46 70 L 38 70 Z"
            fill="#ffffff"
          />

          {/* Graduation Mortarboard / Academic Cap on Top */}
          <polygon points="26,20 44,13 62,20 44,26" fill="#0f172a" />
          <polygon points="26,20 44,26 44,29 26,23" fill="#1e293b" />
          {/* Cap Gold Tassel */}
          <path
            d="M 55,20 Q 58,26 57,30"
            stroke="#eab308"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="57" cy="30" r="1.5" fill="#eab308" />

          {/* Two Green Growth Leaves on Lower Right (Mirpur Green Campus) */}
          <path
            d="M 64 67 C 73 64 78 56 76 49 C 69 51 64 59 64 67 Z"
            fill="#22c55e"
          />
          <path
            d="M 71 73 C 80 71 84 63 81 57 C 75 59 71 66 71 73 Z"
            fill="#16a34a"
          />

          {/* Graduate Silhouettes in Bottom Counter */}
          <circle cx="43" cy="60" r="2.2" fill="#94a3b8" />
          <path d="M 39.5 67 C 39.5 64 41 63 43 63 C 45 63 46.5 64 46.5 67 Z" fill="#94a3b8" />
          <circle cx="49" cy="61" r="1.8" fill="#cbd5e1" />
          <path d="M 46.5 67 C 46.5 64.5 47.8 63.5 49 63.5 C 50.2 63.5 51.5 64.5 51.5 67 Z" fill="#cbd5e1" />

          <defs>
            <linearGradient id="bupLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="45%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typography: BUP Social */}
      {showText && (
        <div className="flex items-center tracking-tight">
          <span className={`font-black text-slate-900 dark:text-white ${currentSize.text} tracking-tight`}>
            BUP
          </span>
          <span className={`font-black text-blue-600 dark:text-blue-500 ${currentSize.text} tracking-tight ml-1`}>
            Social
          </span>
        </div>
      )}
    </div>
  );
};
