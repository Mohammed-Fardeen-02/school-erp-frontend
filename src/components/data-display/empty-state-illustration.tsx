export function EmptyStateIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 560"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="No Data Found"
    >
      <defs>
        <linearGradient id="boxInnerGradThemeComp" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--color-primary, #7C3AED)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--color-primary-dark, #4C1D95)" />
        </linearGradient>

        <linearGradient id="handleGradThemeComp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-primary, #7C3AED)" />
          <stop offset="100%" stopColor="var(--color-primary-dark, #4C1D95)" />
        </linearGradient>

        <style>{`
          .stroke-main-theme { stroke: var(--color-primary, #7C3AED); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
          .stroke-thick-theme { stroke: var(--color-primary, #7C3AED); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
          .stroke-thin-theme { stroke: var(--color-primary-hover, #C4B5FD); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; opacity: 0.8; }
          .text-title-theme { font-family: var(--font-sans, 'Inter', system-ui, sans-serif); font-weight: 700; font-size: 34px; fill: var(--color-foreground, #111827); }
          .text-subtitle-theme { font-family: var(--font-sans, 'Inter', system-ui, sans-serif); font-weight: 400; font-size: 19px; fill: var(--color-muted-foreground, #6b7280); }
        `}</style>
      </defs>

      {/* 1. Background Soft Cloud */}
      <g id="background-cloud">
        <path
          d="M 230 280 
             C 170 270, 160 190, 220 160 
             C 230 100, 310 80, 360 110 
             C 410 70, 500 70, 540 115 
             C 600 90, 670 140, 650 200 
             C 690 240, 670 310, 610 320 
             C 590 370, 510 390, 460 360 
             C 410 400, 320 390, 280 350 
             C 230 360, 180 320, 230 280 Z"
          fill="var(--color-surface-muted, #f3f4f6)"
          opacity="0.8"
        />
      </g>

      {/* 2. Concentric Ripple Rings */}
      <g id="ripples" opacity="0.65">
        <ellipse
          cx="400"
          cy="300"
          rx="270"
          ry="115"
          fill="none"
          className="stroke-thin-theme"
          strokeDasharray="6 6"
        />
        <ellipse cx="400" cy="300" rx="215" ry="90" fill="none" className="stroke-thin-theme" />
        <ellipse
          cx="400"
          cy="300"
          rx="160"
          ry="68"
          fill="none"
          className="stroke-thin-theme"
          strokeDasharray="4 4"
        />
      </g>

      {/* 3. Small Floating Particle Accents */}
      <g id="particles" opacity="0.75">
        <path d="M 180 180 L 180 196 M 172 188 L 188 188" className="stroke-thick-theme" />
        <path d="M 620 140 L 620 156 M 612 148 L 628 148" className="stroke-thick-theme" />
        <circle
          cx="210"
          cy="130"
          r="5"
          fill="var(--color-primary-light, #DDD6FE)"
          className="stroke-thin-theme"
        />
        <circle
          cx="585"
          cy="110"
          r="4.5"
          fill="var(--color-primary-light, #DDD6FE)"
          className="stroke-thin-theme"
        />
        <polygon
          points="630,280 636,294 624,294"
          fill="var(--color-primary, #7C3AED)"
          opacity="0.7"
        />
        <rect
          x="160"
          y="270"
          width="9"
          height="9"
          rx="2"
          fill="var(--color-primary, #7C3AED)"
          transform="rotate(25 165 275)"
          opacity="0.6"
        />
      </g>

      {/* 4. Spiral Notebook (Far Left) */}
      <g id="spiral-notebook" transform="translate(140, 200) rotate(-18)">
        <rect
          x="0"
          y="0"
          width="80"
          height="105"
          rx="5"
          fill="var(--color-surface, #ffffff)"
          className="stroke-main-theme"
        />
        <rect
          x="0"
          y="0"
          width="80"
          height="105"
          rx="5"
          fill="var(--color-primary-ghost, #EDE9FE)"
          opacity="0.5"
        />
        <rect x="18" y="16" width="48" height="6" rx="3" fill="var(--color-primary, #7C3AED)" />
        <rect
          x="18"
          y="28"
          width="34"
          height="4"
          rx="2"
          fill="var(--color-primary-hover, #C4B5FD)"
        />
        <line
          x1="8"
          y1="44"
          x2="72"
          y2="44"
          stroke="var(--color-border, #e5e7eb)"
          strokeWidth="1.5"
        />
        <line
          x1="8"
          y1="58"
          x2="72"
          y2="58"
          stroke="var(--color-border, #e5e7eb)"
          strokeWidth="1.5"
        />
        <line
          x1="8"
          y1="72"
          x2="72"
          y2="72"
          stroke="var(--color-border, #e5e7eb)"
          strokeWidth="1.5"
        />
        <line
          x1="8"
          y1="86"
          x2="72"
          y2="86"
          stroke="var(--color-border, #e5e7eb)"
          strokeWidth="1.5"
        />
        <path
          d="M 15 41 C 15 46, 65 46, 65 41"
          fill="none"
          stroke="var(--color-primary, #7C3AED)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M 15 76 C 15 81, 65 81, 65 76"
          fill="none"
          stroke="var(--color-primary, #7C3AED)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </g>

      {/* 5. Folder Icon (Bottom Left) */}
      <g id="folder" transform="translate(230, 240) rotate(-12)">
        <path
          d="M 10 25 L 35 25 L 43 33 L 85 33 C 89 33, 92 36, 92 40 L 92 85 C 89 89, 89 92, 85 92 L 10 92 C 6 92, 3 89, 3 85 L 3 32 C 3 28, 6 25, 10 25 Z"
          fill="var(--color-primary-light, #DDD6FE)"
          className="stroke-main-theme"
          opacity="0.8"
        />
        <rect
          x="12"
          y="15"
          width="70"
          height="65"
          rx="4"
          fill="var(--color-surface, #ffffff)"
          className="stroke-main-theme"
        />
        <line
          x1="22"
          y1="28"
          x2="60"
          y2="28"
          stroke="var(--color-primary-hover, #C4B5FD)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="22"
          y1="36"
          x2="48"
          y2="36"
          stroke="var(--color-primary-hover, #C4B5FD)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 0 45 L 88 40 C 92 40, 95 43, 94 47 L 85 93 C 84 97, 80 100, 76 100 L 8 100 C 4 100, 1 97, 2 93 L 0 45 Z"
          fill="var(--color-primary-light, #DDD6FE)"
          className="stroke-main-theme"
        />
      </g>

      {/* 6. Document Card 1 (Top Right) */}
      <g id="document-image" transform="translate(485, 120) rotate(14)">
        <rect
          x="0"
          y="0"
          width="76"
          height="98"
          rx="7"
          fill="var(--color-surface, #ffffff)"
          className="stroke-main-theme"
        />
        <rect
          x="9"
          y="9"
          width="58"
          height="42"
          rx="4"
          fill="var(--color-primary-ghost, #EDE9FE)"
          stroke="var(--color-primary, #7C3AED)"
          strokeWidth="1.8"
        />
        <path
          d="M 12 47 L 28 28 L 42 42 L 52 32 L 64 47 Z"
          fill="var(--color-primary-light, #DDD6FE)"
        />
        <circle cx="50" cy="22" r="4" fill="var(--color-primary, #7C3AED)" />
        <line
          x1="12"
          y1="62"
          x2="64"
          y2="62"
          stroke="var(--color-primary-hover, #C4B5FD)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="12"
          y1="72"
          x2="48"
          y2="72"
          stroke="var(--color-primary-hover, #C4B5FD)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="12"
          y1="82"
          x2="56"
          y2="82"
          stroke="var(--color-primary-hover, #C4B5FD)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* 7. Document Card 2 (Lower Right) */}
      <g id="document-text" transform="translate(540, 190) rotate(22)">
        <path
          d="M 5 0 L 58 0 L 72 14 L 72 90 C 72 94, 69 97, 65 97 L 5 97 C 1 97, -2 94, -2 90 L -2 5 C -2 1, 1 0, 5 0 Z"
          fill="var(--color-surface, #ffffff)"
          className="stroke-main-theme"
        />
        <path
          d="M 58 0 L 58 14 L 72 14 Z"
          fill="var(--color-primary-ghost, #EDE9FE)"
          className="stroke-main-theme"
        />
        <line
          x1="8"
          y1="24"
          x2="54"
          y2="24"
          stroke="var(--color-primary-hover, #C4B5FD)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="8"
          y1="36"
          x2="60"
          y2="36"
          stroke="var(--color-primary-hover, #C4B5FD)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="8"
          y1="48"
          x2="50"
          y2="48"
          stroke="var(--color-primary-hover, #C4B5FD)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="8"
          y1="60"
          x2="58"
          y2="60"
          stroke="var(--color-primary-hover, #C4B5FD)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="8"
          y1="72"
          x2="40"
          y2="72"
          stroke="var(--color-primary-hover, #C4B5FD)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* 8. Open Cardboard Box */}
      <g id="cardboard-box">
        <polygon
          points="290,275 265,225 375,195 400,245"
          fill="var(--color-primary-ghost, #EDE9FE)"
          className="stroke-main-theme"
        />
        <polygon
          points="400,245 425,195 535,225 510,275"
          fill="var(--color-primary-ghost, #EDE9FE)"
          className="stroke-main-theme"
        />
        <polygon
          points="400,245 510,275 400,305 290,275"
          fill="url(#boxInnerGradThemeComp)"
          className="stroke-main-theme"
        />
        <polygon
          points="290,275 400,305 400,415 290,385"
          fill="var(--color-primary-light, #DDD6FE)"
          className="stroke-main-theme"
          opacity="0.9"
        />
        <polygon
          points="400,305 510,275 510,385 400,415"
          fill="var(--color-primary-ghost, #EDE9FE)"
          className="stroke-main-theme"
        />
        <polygon
          points="290,275 265,325 375,355 400,305"
          fill="var(--color-primary-ghost, #EDE9FE)"
          className="stroke-main-theme"
          opacity="0.95"
        />
        <polygon
          points="400,305 425,355 535,325 510,275"
          fill="var(--color-primary-ghost, #EDE9FE)"
          className="stroke-main-theme"
        />

        <g transform="translate(320, 328) skewY(15.2)">
          <rect
            x="0"
            y="0"
            width="36"
            height="24"
            rx="2.5"
            fill="var(--color-surface, #ffffff)"
            stroke="var(--color-primary, #7C3AED)"
            strokeWidth="1.5"
          />
          <line
            x1="6"
            y1="8"
            x2="30"
            y2="8"
            stroke="var(--color-primary-hover, #C4B5FD)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="6"
            y1="15"
            x2="22"
            y2="15"
            stroke="var(--color-primary-hover, #C4B5FD)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        <g transform="translate(425, 342) skewY(-15.2)">
          <line
            x1="0"
            y1="0"
            x2="20"
            y2="0"
            stroke="var(--color-primary-hover, #C4B5FD)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="0"
            y1="7"
            x2="20"
            y2="7"
            stroke="var(--color-primary-hover, #C4B5FD)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="0"
            y1="14"
            x2="13"
            y2="14"
            stroke="var(--color-primary-hover, #C4B5FD)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect
            x="28"
            y="-4"
            width="24"
            height="20"
            rx="2"
            fill="var(--color-primary-light, #DDD6FE)"
            stroke="var(--color-primary, #7C3AED)"
            strokeWidth="1.2"
            opacity="0.7"
          />
        </g>
      </g>

      {/* 9. Floating Magnifying Glass */}
      <g id="magnifying-glass">
        <path
          d="M 435 190 L 485 240"
          stroke="url(#handleGradThemeComp)"
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path
          d="M 470 225 L 485 240"
          stroke="var(--color-primary-dark, #4C1D95)"
          strokeWidth="22"
          strokeLinecap="round"
          opacity="0.3"
        />
        <circle
          cx="395"
          cy="148"
          r="62"
          fill="none"
          stroke="var(--color-primary, #7C3AED)"
          strokeWidth="7"
        />
        <circle
          cx="395"
          cy="148"
          r="56"
          fill="none"
          stroke="var(--color-primary-hover, #C4B5FD)"
          strokeWidth="4"
        />
        <circle
          cx="395"
          cy="148"
          r="54"
          fill="var(--color-surface, #ffffff)"
          stroke="var(--color-primary-ghost, #EDE9FE)"
          strokeWidth="2"
        />
        <path
          d="M 352 135 A 46 46 0 0 1 420 108"
          fill="none"
          stroke="var(--color-primary-ghost, #EDE9FE)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 389 114 C 389 110, 401 110, 401 114 L 398 150 C 398 153, 392 153, 392 150 Z"
          fill="var(--color-primary, #7C3AED)"
        />
        <circle cx="395" cy="167" r="6" fill="var(--color-primary, #7C3AED)" />
      </g>

      {/* 10. Text Labels */}
      <g id="text-labels">
        <text x="400" y="475" textAnchor="middle" className="text-title-theme">
          No Data Found
        </text>
        <text x="400" y="515" textAnchor="middle" className="text-subtitle-theme">
          There are no records to display.
        </text>
      </g>
    </svg>
  );
}
