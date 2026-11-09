import React from 'react';

interface PuffLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'receipt' | 'header';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const PuffLogo: React.FC<PuffLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-20 w-20',
    xl: 'h-28 w-28',
  };

  if (variant === 'receipt') {
    // Monochrome high-contrast version for thermal printing
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <svg
          viewBox="0 0 200 180"
          className="w-16 h-14 mx-auto mb-1 text-black"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shield Outline */}
          <path
            d="M40 25 H160 V85 C160 120 100 145 100 145 C100 145 40 120 40 85 Z"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bubbles / Foam on roof */}
          <circle cx="75" cy="40" r="7" stroke="currentColor" strokeWidth="2" />
          <circle cx="92" cy="35" r="9" stroke="currentColor" strokeWidth="2" />
          <circle cx="110" cy="38" r="8" stroke="currentColor" strokeWidth="2" />
          <circle cx="125" cy="42" r="6" stroke="currentColor" strokeWidth="2" />
          {/* Car profile */}
          <path
            d="M48 78 L68 62 H130 L152 75 L158 84 H145 C145 78 135 78 135 84 H75 C75 78 65 78 65 84 H44 Z"
            fill="currentColor"
          />
          {/* Windows */}
          <path
            d="M72 65 H96 V75 H65 Z"
            fill="white"
          />
          <path
            d="M102 65 H126 L138 75 H102 Z"
            fill="white"
          />
          {/* Wheels cutouts */}
          <circle cx="70" cy="84" r="7" fill="white" />
          <circle cx="140" cy="84" r="7" fill="white" />
          {/* Lower Shield accent */}
          <path
            d="M70 125 L100 138 L130 125"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
        <span className="font-black text-sm tracking-widest uppercase">PUFF.id</span>
        <span className="text-[9px] tracking-wide font-medium text-neutral-600">
          we come, we clean, you shine
        </span>
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}>
        <svg
          viewBox="0 0 200 180"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id="bubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Upper Shield Arch */}
          <path
            d="M36 28 H164 V85 C164 125 100 152 100 152 C100 152 36 125 36 85 Z"
            stroke="url(#shieldGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="filter drop-shadow"
          />

          {/* Bubbles on Top */}
          <g className="opacity-95">
            <circle cx="68" cy="46" r="9" fill="url(#bubbleGrad)" stroke="#bae6fd" strokeWidth="1.5" />
            <circle cx="86" cy="38" r="12" fill="url(#bubbleGrad)" stroke="#bae6fd" strokeWidth="1.5" />
            <circle cx="106" cy="36" r="13" fill="url(#bubbleGrad)" stroke="#bae6fd" strokeWidth="1.5" />
            <circle cx="128" cy="44" r="10" fill="url(#bubbleGrad)" stroke="#bae6fd" strokeWidth="1.5" />
            <circle cx="98" cy="24" r="5" fill="#e0f2fe" />
            <circle cx="118" cy="27" r="4" fill="#e0f2fe" />
          </g>

          {/* Car Body Silhouette */}
          <path
            d="M38 90 L64 68 H134 L158 84 L165 96 H148 C148 88 136 88 136 96 H72 C72 88 60 88 60 96 H34 Z"
            fill="url(#chromeGrad)"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Windows */}
          <path
            d="M68 72 H96 V86 H58 Z"
            fill="#0369a1"
            opacity="0.9"
          />
          <path
            d="M102 72 H130 L144 86 H102 Z"
            fill="#0369a1"
            opacity="0.9"
          />

          {/* Wheel Arch Outlines */}
          <path
            d="M52 98 A 14 14 0 0 1 80 98"
            stroke="url(#shieldGrad)"
            strokeWidth="3.5"
            fill="none"
          />
          <path
            d="M128 98 A 14 14 0 0 1 156 98"
            stroke="url(#shieldGrad)"
            strokeWidth="3.5"
            fill="none"
          />

          {/* Lower Shield Emblem Chevron */}
          <path
            d="M72 136 L100 150 L128 136"
            stroke="url(#shieldGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  // Full Brand Logo with Typography
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative shrink-0">
        <svg
          viewBox="0 0 200 180"
          className="h-14 w-14 md:h-16 md:w-16 drop-shadow-lg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="shieldGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="chromeGradFull" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id="bubbleGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* Shield Outline */}
          <path
            d="M34 26 H166 V85 C166 128 100 155 100 155 C100 155 34 128 34 85 Z"
            stroke="url(#shieldGradFull)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Foamy Soap Bubbles */}
          <g>
            <circle cx="68" cy="46" r="9" fill="url(#bubbleGradFull)" stroke="#bae6fd" strokeWidth="1.5" />
            <circle cx="86" cy="38" r="12" fill="url(#bubbleGradFull)" stroke="#bae6fd" strokeWidth="1.5" />
            <circle cx="106" cy="36" r="13" fill="url(#bubbleGradFull)" stroke="#bae6fd" strokeWidth="1.5" />
            <circle cx="128" cy="44" r="10" fill="url(#bubbleGradFull)" stroke="#bae6fd" strokeWidth="1.5" />
            <circle cx="98" cy="22" r="5" fill="#e0f2fe" />
            <circle cx="118" cy="25" r="4" fill="#e0f2fe" />
          </g>

          {/* Car Body */}
          <path
            d="M38 90 L64 68 H134 L158 84 L165 96 H148 C148 88 136 88 136 96 H72 C72 88 60 88 60 96 H34 Z"
            fill="url(#chromeGradFull)"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Windows */}
          <path d="M68 72 H96 V86 H58 Z" fill="#0284c7" opacity="0.85" />
          <path d="M102 72 H130 L144 86 H102 Z" fill="#0284c7" opacity="0.85" />

          {/* Wheel Arches */}
          <path d="M52 98 A 14 14 0 0 1 80 98" stroke="url(#shieldGradFull)" strokeWidth="3.5" fill="none" />
          <path d="M128 98 A 14 14 0 0 1 156 98" stroke="url(#shieldGradFull)" strokeWidth="3.5" fill="none" />

          {/* Lower Shield V */}
          <path
            d="M70 138 L100 152 L130 138"
            stroke="url(#shieldGradFull)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-2xl md:text-3xl font-black tracking-tight text-white font-sans drop-shadow">
            PUFF<span className="text-cyan-300">.id</span>
          </span>
        </div>
        <p className="text-[11px] md:text-xs font-semibold text-cyan-100 tracking-wide">
          we come, we clean, you shine
        </p>
      </div>
    </div>
  );
};
