import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import type { ModuleConfig } from '@/app/config/modules.config';
import {
  AcademicsIcon,
  StudentsIcon,
  AttendanceIcon,
  FeesIcon,
  StaffIcon,
  ExaminationsIcon,
  FrontDeskIcon,
  TimetableIcon,
  TransportIcon,
  LibraryIcon,
  HostelIcon,
  SettingsIcon,
  AdministrationIcon,
} from './module-icons';

export interface AppIconTileProps {
  module: ModuleConfig;
  isPermitted: boolean;
  onSelect?: (module: ModuleConfig) => void;
}

export const AppIconTile: React.FC<AppIconTileProps> = ({
  module,
  isPermitted,
  onSelect,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onSelect) {
      onSelect(module);
    } else if (isPermitted) {
      navigate(module.route);
    }
  };

  const renderIcon = () => {
    switch (module.id) {
      case 'academics':
        return <AcademicsIcon />;
      case 'students':
        return <StudentsIcon />;
      case 'attendance':
        return <AttendanceIcon />;
      case 'fees':
      case 'accounting':
        return <FeesIcon />;
      case 'staff':
      case 'people-ops':
        return <StaffIcon />;
      case 'exams':
        return <ExaminationsIcon />;
      case 'front-office':
        return <FrontDeskIcon />;
      case 'timetable':
        return <TimetableIcon />;
      case 'transport':
      case 'operations':
        return <TransportIcon />;
      case 'library':
        return <LibraryIcon />;
      case 'hostel':
      case 'organization':
        return <HostelIcon />;
      case 'settings':
      case 'admin':
        return <AdministrationIcon />;
      case 'erpnext-settings':
      case 'framework':
        return <SettingsIcon />;
      default: {
        const FallbackIcon = module.icon;
        return (
          <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[22px] shadow-md shadow-violet-600/20 p-4 text-white">
            {FallbackIcon ? (
              <FallbackIcon className="w-9 h-9" />
            ) : (
              <span className="text-2xl font-bold">{module.name.charAt(0)}</span>
            )}
          </div>
        );
      }
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`${module.name} - ${isPermitted ? 'Permitted' : 'Restricted'}`}
      className={`group relative flex flex-col items-center justify-start text-center cursor-pointer select-none focus:outline-hidden transition-all duration-200 ${
        isPermitted ? 'opacity-100' : 'opacity-70'
      }`}
    >
      {/* Squircle Tile Container with Spring Scale & Elevation */}
      <div className="relative w-[76px] h-[76px] sm:w-[82px] sm:h-[82px] transition-all duration-250 ease-out group-hover:scale-108 group-hover:-translate-y-1.5 group-active:scale-95 group-hover:shadow-[0_16px_30px_-6px_rgba(124,58,237,0.25)] rounded-[22px]">
        {renderIcon()}

        {/* Restricted Lock Overlay */}
        {!isPermitted && (
          <div
            title="Access Restricted"
            className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/90 text-white shadow-xs backdrop-blur-xs ring-2 ring-background"
          >
            <Lock className="h-2.5 w-2.5" />
          </div>
        )}
      </div>

      {/* Label */}
      <span className="mt-2.5 text-[13px] font-medium tracking-tight text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors text-center line-clamp-1 max-w-[100px]">
        {module.shortName || module.name}
      </span>

      {/* Hidden Accessible Status for Screen Readers & Tests */}
      <span className="sr-only">
        {isPermitted ? 'Permitted' : 'Restricted'}
      </span>
    </div>
  );
};
