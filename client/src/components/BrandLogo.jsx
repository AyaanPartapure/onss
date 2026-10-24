import React from 'react';
import { Link } from 'react-router-dom';

/** ONSS brand mark. Self-contained SVG: no icon library or external asset required. */
export function LogoMark({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" role="img" aria-label="ONSS logo" className="shrink-0 drop-shadow-[0_8px_16px_rgba(5,27,56,0.15)]">
      <rect width="48" height="48" rx="15" fill="#0E2A47" />
      <path d="M12 35V13H17.6L30.8 28.4V13H36V35H30.4L17.2 19.6V35H12Z" fill="#F8FAFC" />
      <path d="M27.5 13H36V21.5H31.3L27.5 17V13Z" fill="#22D3C5" />
      <circle cx="37" cy="11" r="4" fill="#FFC86E" />
    </svg>
  );
}

export default function BrandLogo({
  to = '/',
  subtitle = 'ONLINE NOTES SHARING SYSTEM',
  className = '',
  small = false,
  inverse = false,
}) {
  return (
    <Link to={to} aria-label="ONSS home" className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark size={small ? 39 : 47} />
      <span className="min-w-0">
        <span className={`block text-[23px] leading-6 font-black tracking-[-0.065em] ${inverse ? 'text-white' : 'text-[#0E2A47]'}`}>
          ONSS<span className="text-[#087e7b]">.</span>
        </span>
        <span className={`mt-1 block text-[9px] font-extrabold uppercase tracking-[0.14em] ${inverse ? 'text-slate-300' : 'text-slate-600'}`}>
          {subtitle}
        </span>
      </span>
    </Link>
  );
}
