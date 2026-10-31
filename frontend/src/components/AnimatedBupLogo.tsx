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
    sm: { box: 'w-9 h-9', icon: 36, text: 'text-sm', sub: 'text-[9px]' },
    md: { box: 'w-11 h-11', icon: 44, text: 'text-base', sub: 'text-[10px]' },
    lg: { box: 'w-16 h-16', icon: 64, text: 'text-xl', sub: 'text-xs' },
    xl: { box: 'w-24 h-24', icon: 96, text: 'text-2xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className="flex items-center gap-3 select-none group">
      {/* Animated SVG Emblem */}
      <div className={`relative ${currentSize.box} shrink-0`}>
        {/* Glowing Ambient Backdrop */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-bup-700 via-emerald-500 to-amber-400 opacity-70 blur-md group-hover:opacity-100 transition-opacity animate-pulse" />

        {/* Orbiting Radial Cyber Ring */}
        <svg
          className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)] animate-[spin_12s_linear_infinite]"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke="url(#orbitGradient)"
            strokeWidth="1.5"
            strokeDasharray="6 8"
          />
          <circle cx="50" cy="4" r="3" fill="#eab308" />
          <circle cx="96" cy="50" r="2.5" fill="#22c55e" />
          <defs>
            <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Main Emblem Shield */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#0b1d3a] via-[#0f284e] to-[#041226] border border-amber-400/40 p-1 flex items-center justify-center shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(34,197,94,0.35),transparent_70%)]" />

          {/* SVG University Crest Elements */}
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
            {/* Laurel Wreath Left */}
            <path
              d="M25 65 C20 52 22 38 30 28 M22 55 C18 45 22 36 26 32 M27 42 C24 35 28 28 34 25"
              stroke="#eab308"
              strokeWidth="2"
              strokeLinecap="round"
              className="opacity-90"
            />
            {/* Laurel Wreath Right */}
            <path
              d="M75 65 C80 52 78 38 70 28 M78 55 C82 45 78 36 74 32 M73 42 C76 35 72 28 66 25"
              stroke="#eab308"
              strokeWidth="2"
              strokeLinecap="round"
              className="opacity-90"
            />

            {/* Central Academic Diamond / Shield */}
            <polygon
              points="50,18 70,36 50,56 30,36"
              fill="url(#shieldGrad)"
              stroke="#eab308"
              strokeWidth="1.5"
            />

            {/* Graduation Cap Silhouette / Torch */}
            <path
              d="M38 34 L50 28 L62 34 L50 40 Z"
              fill="#ffffff"
            />
            <path
              d="M62 34 L62 42"
              stroke="#eab308"
              strokeWidth="1.5"
            />
            <circle cx="62" cy="43" r="1.5" fill="#eab308" />

            {/* Bold BUP Brand Text */}
            <text
              x="50"
              y="74"
              fontSize="16"
              fontWeight="900"
              fontFamily="Arial, sans-serif"
              textAnchor="middle"
              fill="#ffffff"
              letterSpacing="1"
            >
              BUP
            </text>

            {/* University Stars */}
            <circle cx="50" cy="85" r="2" fill="#eab308" />
            <circle cx="42" cy="83" r="1.5" fill="#22c55e" />
            <circle cx="58" cy="83" r="1.5" fill="#22c55e" />

            <defs>
              <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#15803d" />
                <stop offset="100%" stopColor="#0b1d3a" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-slate-900 dark:text-white ${currentSize.text} whitespace-nowrap`}>
              BUP <span className="text-bup-700 dark:text-bup-400">SOCIAL</span>
            </span>
            <span className="hidden xs:inline-block text-[9px] font-extrabold px-1.5 py-0.2 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 uppercase shadow-sm whitespace-nowrap">
              BUPSOC
            </span>
          </div>
          <p className={`hidden sm:block text-slate-500 dark:text-slate-400 font-medium tracking-tight truncate ${currentSize.sub}`}>
            Excellence Through Knowledge • Mirpur
          </p>
        </div>
      )}
    </div>
  );
};
