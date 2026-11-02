import * as React from 'react';

// 1. Academics & Curriculum (Royal Violet)
export const AcademicsIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`relative flex items-center justify-center w-full h-full bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 rounded-[22px] shadow-md shadow-violet-600/20 p-4 text-white transition-all ${className}`}
  >
    <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 stroke-white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      {/* Mortarboard */}
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      {/* Book Base */}
      <path d="M6 12.5v4.5c3 2.5 9 2.5 12 0v-4.5" />
    </svg>
  </div>
);

// 2. Students & Admissions (Ocean Blue / Sky)
export const StudentsIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`relative flex items-center justify-center w-full h-full bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 rounded-[22px] shadow-md shadow-blue-500/20 p-4 text-white transition-all ${className}`}
  >
    <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 stroke-white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2" />
      <circle cx="19" cy="6" r="1.5" fill="white" stroke="none" />
    </svg>
  </div>
);

// 3. Attendance & Registers (Vibrant Emerald)
export const AttendanceIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`relative flex items-center justify-center w-full h-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 rounded-[22px] shadow-md shadow-emerald-500/20 p-4 text-white transition-all ${className}`}
  >
    <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 stroke-white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="9.5" x2="21" y2="9.5" />
      <path d="m8.5 15 2.5 2.5 5-5" strokeWidth="2.2" />
    </svg>
  </div>
);

// 4. Fees & Finance (Warm Amber / Gold)
export const FeesIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`relative flex items-center justify-center w-full h-full bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-[22px] shadow-md shadow-amber-500/20 p-4 text-white transition-all ${className}`}
  >
    <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 stroke-white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="5" width="19" height="14" rx="3" />
      <line x1="2.5" y1="9.5" x2="21.5" y2="9.5" />
      <circle cx="7" cy="14.5" r="1.5" fill="white" stroke="none" />
      <path d="M14 14.5h4" strokeWidth="2" />
    </svg>
  </div>
);

// 5. Staff & Faculty (Rose / Coral)
export const StaffIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`relative flex items-center justify-center w-full h-full bg-gradient-to-br from-rose-500 via-pink-600 to-rose-700 rounded-[22px] shadow-md shadow-rose-500/20 p-4 text-white transition-all ${className}`}
  >
    <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 stroke-white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  </div>
);

// 6. Examinations & Marks (Electric Indigo)
export const ExaminationsIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`relative flex items-center justify-center w-full h-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-[22px] shadow-md shadow-indigo-600/20 p-4 text-white transition-all ${className}`}
  >
    <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 stroke-white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m9 15 1.5 1.5L15 12" strokeWidth="2.2" />
    </svg>
  </div>
);

// 7. Front Desk & Reception (Cobalt Blue)
export const FrontDeskIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`relative flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 rounded-[22px] shadow-md shadow-blue-600/20 p-4 text-white transition-all ${className}`}
  >
    <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 stroke-white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      <circle cx="18" cy="4" r="2" fill="white" stroke="none" />
    </svg>
  </div>
);

// 8. Timetable & Schedules (Fuchsia / Purple)
export const TimetableIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`relative flex items-center justify-center w-full h-full bg-gradient-to-br from-fuchsia-600 via-purple-600 to-pink-700 rounded-[22px] shadow-md shadow-fuchsia-600/20 p-4 text-white transition-all ${className}`}
  >
    <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 stroke-white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 6 12 12 16 14" strokeWidth="2.2" />
    </svg>
  </div>
);

// 9. Transport & Fleet (Teal / Mint)
export const TransportIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`relative flex items-center justify-center w-full h-full bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700 rounded-[22px] shadow-md shadow-teal-500/20 p-4 text-white transition-all ${className}`}
  >
    <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 stroke-white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h8" />
      <rect x="3" y="4" width="18" height="12" rx="3" />
      <path d="M3 10h18" />
      <circle cx="7.5" cy="18.5" r="2" fill="white" stroke="none" />
      <circle cx="16.5" cy="18.5" r="2" fill="white" stroke="none" />
      <path d="M9.5 18.5h5" />
    </svg>
  </div>
);

// 10. Library & Resources (Warm Amber / Ochre)
export const LibraryIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`relative flex items-center justify-center w-full h-full bg-gradient-to-br from-amber-600 via-orange-700 to-amber-900 rounded-[22px] shadow-md shadow-amber-600/20 p-4 text-white transition-all ${className}`}
  >
    <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 stroke-white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  </div>
);

// 11. Hostel & Housing (Slate / Navy)
export const HostelIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`relative flex items-center justify-center w-full h-full bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900 rounded-[22px] shadow-md shadow-slate-600/20 p-4 text-white transition-all ${className}`}
  >
    <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 stroke-white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 10h1" />
      <path d="M14 10h1" />
      <path d="M9 14h1" />
      <path d="M14 14h1" />
      <path d="M10 21v-4h4v4" />
    </svg>
  </div>
);

// 12. Settings & Security (Titanium / Slate)
export const SettingsIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`relative flex items-center justify-center w-full h-full bg-gradient-to-br from-slate-700 via-slate-800 to-zinc-950 rounded-[22px] shadow-md shadow-slate-700/20 p-4 text-white transition-all ${className}`}
  >
    <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 stroke-white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  </div>
);
