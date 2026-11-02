import * as React from 'react';

export const AuthIllustration: React.FC = () => {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden py-4">
      <style>{`
        @keyframes floatLaptop {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes floatBadge1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(-1.5deg); }
        }
        @keyframes floatBadge2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-9px) rotate(2deg); }
        }
        @keyframes floatBadge3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes platformGlow {
          0%, 100% { opacity: 0.45; transform: scale(0.98); }
          50% { opacity: 0.85; transform: scale(1.02); }
        }
        .anim-laptop { animation: floatLaptop 6s ease-in-out infinite; }
        .anim-badge-1 { animation: floatBadge1 5s ease-in-out infinite; }
        .anim-badge-2 { animation: floatBadge2 7s 0.8s ease-in-out infinite; }
        .anim-badge-3 { animation: floatBadge3 6.5s 1.5s ease-in-out infinite; }
        .anim-glow { animation: platformGlow 4s ease-in-out infinite; }
      `}</style>

      <svg
        viewBox="0 0 680 430"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full max-h-[380px] w-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Radial Glow */}
          <radialGradient id="school-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </radialGradient>

          {/* Primary Gradient */}
          <linearGradient id="primary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>

          {/* Screen Gradient */}
          <linearGradient id="screen-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f5f3ff" />
          </linearGradient>

          {/* Accent Ribbon */}
          <linearGradient id="accent-ribbon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="var(--color-primary)" />
          </linearGradient>

          {/* Card Shadows */}
          <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="var(--color-primary)" floodOpacity="0.18" />
          </filter>
          <filter id="card-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0f172a" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Ambient background particles */}
        <circle cx="180" cy="50" r="4" fill="var(--color-primary-light)" opacity="0.6" />
        <circle cx="510" cy="40" r="5" fill="var(--color-primary-light)" opacity="0.5" />
        <circle cx="580" cy="120" r="3" fill="#a855f7" opacity="0.7" />
        <circle cx="120" cy="180" r="3.5" fill="#c084fc" opacity="0.5" />

        {/* Platform Glow Ellipse */}
        <g className="anim-glow">
          <ellipse cx="340" cy="385" rx="220" ry="24" fill="url(#school-glow)" />
          <ellipse cx="340" cy="385" rx="200" ry="20" fill="none" stroke="url(#accent-ribbon)" strokeWidth="1.5" opacity="0.6" />
        </g>

        {/* ========================================================
            MAIN DESKTOP DEVICE (School ERP Workstation)
            ======================================================== */}
        <g className="anim-laptop" filter="url(#soft-shadow)">
          {/* Base bottom stand */}
          <path d="M210 330 L235 365 L445 365 L470 330 Z" fill="#94a3b8" />
          <rect x="210" y="325" width="260" height="9" rx="3" fill="#cbd5e1" />
          {/* Trackpad */}
          <rect x="315" y="338" width="50" height="20" rx="3" fill="#e2e8f0" opacity="0.8" />

          {/* Device Screen Bezel */}
          <rect x="205" y="70" width="270" height="258" rx="12" fill="#1e1b4b" />
          {/* Camera dot */}
          <circle cx="340" cy="80" r="2.5" fill="#312e81" />
          <circle cx="340" cy="80" r="1" fill="#475569" />

          {/* Screen Content */}
          <rect x="215" y="90" width="250" height="230" rx="4" fill="url(#screen-grad)" />

          {/* Top Bar of Screen */}
          <rect x="215" y="90" width="250" height="24" fill="#ffffff" />
          <circle cx="228" cy="102" r="3" fill="#ef4444" />
          <circle cx="237" cy="102" r="3" fill="#f59e0b" />
          <circle cx="246" cy="102" r="3" fill="#10b981" />
          {/* School ERP title bar on screen */}
          <rect x="270" y="97" width="100" height="10" rx="5" fill="#f3f4f6" />
          <rect x="420" y="96" width="35" height="12" rx="3" fill="var(--color-primary-ghost)" />

          {/* Screen Sidebar */}
          <rect x="215" y="114" width="48" height="206" fill="#f8fafc" />
          <rect x="223" y="124" width="32" height="6" rx="2" fill="var(--color-primary)" opacity="0.8" />
          <rect x="223" y="136" width="28" height="4" rx="2" fill="#cbd5e1" />
          <rect x="223" y="146" width="30" height="4" rx="2" fill="#cbd5e1" />
          <rect x="223" y="156" width="26" height="4" rx="2" fill="#cbd5e1" />
          <rect x="223" y="166" width="29" height="4" rx="2" fill="#cbd5e1" />

          {/* Screen Workspace Body */}
          {/* Metric Cards inside screen */}
          <rect x="272" y="124" width="58" height="34" rx="4" fill="#ffffff" stroke="#ede9fe" strokeWidth="1" />
          <rect x="278" y="130" width="30" height="4" rx="2" fill="#94a3b8" />
          <rect x="278" y="138" width="22" height="7" rx="2" fill="var(--color-primary)" />

          <rect x="336" y="124" width="58" height="34" rx="4" fill="#ffffff" stroke="#ede9fe" strokeWidth="1" />
          <rect x="342" y="130" width="34" height="4" rx="2" fill="#94a3b8" />
          <rect x="342" y="138" width="20" height="7" rx="2" fill="#10b981" />

          <rect x="400" y="124" width="56" height="34" rx="4" fill="#ffffff" stroke="#ede9fe" strokeWidth="1" />
          <rect x="406" y="130" width="28" height="4" rx="2" fill="#94a3b8" />
          <rect x="406" y="138" width="24" height="7" rx="2" fill="#f59e0b" />

          {/* Timetable / Schedule Chart inside screen */}
          <rect x="272" y="168" width="184" height="80" rx="6" fill="#ffffff" stroke="#ede9fe" strokeWidth="1" />
          <rect x="280" y="176" width="60" height="5" rx="2.5" fill="#475569" />
          {/* Schedule bars */}
          <rect x="280" y="188" width="38" height="16" rx="3" fill="var(--color-primary-ghost)" />
          <rect x="322" y="188" width="52" height="16" rx="3" fill="#ecfdf5" />
          <rect x="378" y="188" width="40" height="16" rx="3" fill="#fef3c7" />

          <rect x="280" y="210" width="62" height="16" rx="3" fill="#eff6ff" />
          <rect x="346" y="210" width="42" height="16" rx="3" fill="var(--color-primary-ghost)" />
          <rect x="392" y="210" width="38" height="16" rx="3" fill="#ecfdf5" />

          {/* Student Progress Line */}
          <rect x="272" y="256" width="184" height="54" rx="6" fill="#ffffff" stroke="#ede9fe" strokeWidth="1" />
          <path
            d="M 285 292 Q 315 272, 345 284 T 405 268 T 445 265"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="445" cy="265" r="4" fill="var(--color-primary)" />
        </g>

        {/* ========================================================
            FLOATING SATELLITE CARDS
            ======================================================== */}

        {/* Floating Card 1: Live Attendance Rate (Top-Left) */}
        <g className="anim-badge-1" filter="url(#card-shadow)">
          <rect x="65" y="105" width="160" height="66" rx="12" fill="#ffffff" stroke="#ede9fe" strokeWidth="1.5" />
          <rect x="77" y="117" width="32" height="32" rx="8" fill="var(--color-primary-ghost)" />
          {/* Icon representation (Checkmark) */}
          <path d="M87 133 L92 138 L101 127" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="118" y="130" fill="#64748b" fontSize="10" fontWeight="600" fontFamily="sans-serif">Attendance Rate</text>
          <text x="118" y="148" fill="#1e1b4b" fontSize="15" fontWeight="800" fontFamily="sans-serif">98.4%</text>
          <rect x="118" y="154" width="85" height="4" rx="2" fill="#f1f5f9" />
          <rect x="118" y="154" width="76" height="4" rx="2" fill="var(--color-primary)" />
        </g>

        {/* Floating Card 2: Student Enrollment & Grade (Right) */}
        <g className="anim-badge-2" filter="url(#card-shadow)">
          <rect x="455" y="145" width="165" height="74" rx="12" fill="#ffffff" stroke="#ede9fe" strokeWidth="1.5" />
          <rect x="469" y="158" width="34" height="34" rx="9" fill="#ecfdf5" />
          {/* Graduation Cap path */}
          <path d="M475 174 L486 169 L497 174 L486 179 Z" fill="#10b981" />
          <path d="M480 177 L480 185 Q486 189 492 185 L492 177" fill="none" stroke="#10b981" strokeWidth="1.5" />
          <text x="512" y="172" fill="#64748b" fontSize="10" fontWeight="600" fontFamily="sans-serif">Active Students</text>
          <text x="512" y="191" fill="#0f172a" fontSize="15" fontWeight="800" fontFamily="sans-serif">2,480</text>
          <text x="512" y="204" fill="#10b981" fontSize="9" fontWeight="700" fontFamily="sans-serif">+12% vs last term</text>
        </g>

        {/* Floating Card 3: RBAC & Tenant Security (Bottom-Left) */}
        <g className="anim-badge-3" filter="url(#card-shadow)">
          <rect x="90" y="270" width="155" height="60" rx="12" fill="#ffffff" stroke="#ede9fe" strokeWidth="1.5" />
          <rect x="102" y="282" width="30" height="30" rx="8" fill="#f5f3ff" />
          {/* Shield path */}
          <path d="M117 289 L125 292 V298 C125 303 121 307 117 309 C113 307 109 303 109 298 V292 Z" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinejoin="round" />
          <text x="140" y="296" fill="#1e1b4b" fontSize="11" fontWeight="700" fontFamily="sans-serif">Multi-Tenant</text>
          <text x="140" y="309" fill="#64748b" fontSize="9" fontWeight="500" fontFamily="sans-serif">Encrypted RBAC</text>
        </g>
      </svg>
    </div>
  );
};
