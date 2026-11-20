import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import type { ModuleConfig } from '@/app/config/modules.config';
import { useToast } from '@/components/feedback/toast';
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

export type ModuleAccessStatus =
  | 'available'       // Subscribed, authorized, and operational
  | 'unauthorized'    // Subscribed, but user lacks permission
  | 'unsubscribed'    // Not subscribed by organization
  | 'unimplemented';  // Subscribed & authorized, but feature route not yet operational in ERP

export interface AppIconTileProps {
  module: ModuleConfig;
  status?: ModuleAccessStatus;
  isPermitted?: boolean;
  onSelect?: (module: ModuleConfig, status: ModuleAccessStatus) => void;
}

export const AppIconTile: React.FC<AppIconTileProps> = ({
  module,
  status,
  isPermitted,
  onSelect,
}) => {
  const navigate = useNavigate();
  const toast = useToast();

  const effectiveStatus: ModuleAccessStatus =
    status ?? (isPermitted ? 'available' : 'unauthorized');

  const handleClick = () => {
    if (onSelect) {
      onSelect(module, effectiveStatus);
      return;
    }

    switch (effectiveStatus) {
      case 'available':
        navigate(module.route);
        break;

      case 'unauthorized':
        toast.warning(
          'Access Restricted',
          `Your account does not possess the required permission (${module.requiredPermission}) to access ${module.name}.`
        );
        break;

      case 'unsubscribed':
        toast.info(
          'Module Not Subscribed',
          `${module.name} is not included in your institution's enabled module subscription.`
        );
        break;

      case 'unimplemented':
        toast.info(
          'Module in Development',
          `${module.name} is scheduled in the School ERP roadmap and is not yet operational.`
        );
        break;
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

  const getContainerStyles = () => {
    switch (effectiveStatus) {
      case 'available':
        return 'cursor-pointer opacity-100';
      case 'unimplemented':
        return 'cursor-pointer opacity-85';
      case 'unauthorized':
        return 'cursor-not-allowed opacity-70';
      case 'unsubscribed':
        return 'cursor-not-allowed opacity-45 grayscale';
    }
  };

  const getAriaLabel = () => {
    switch (effectiveStatus) {
      case 'available':
        return `${module.name} - Available (Permitted)`;
      case 'unauthorized':
        return `${module.name} - Restricted (Permission Required: ${module.requiredPermission})`;
      case 'unsubscribed':
        return `${module.name} - Not Subscribed`;
      case 'unimplemented':
        return `${module.name} - Planned (Coming Soon)`;
    }
  };

  const getScreenReaderStatus = () => {
    switch (effectiveStatus) {
      case 'available':
        return 'Permitted';
      case 'unauthorized':
        return 'Restricted';
      case 'unsubscribed':
        return 'Not Subscribed (Restricted)';
      case 'unimplemented':
        return 'Permitted (In Development)';
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
      aria-label={getAriaLabel()}
      className={`group relative flex flex-col items-center justify-start text-center select-none focus:outline-hidden transition-all duration-200 ${getContainerStyles()}`}
    >
      {/* Squircle Tile Container with Spring Scale & Elevation */}
      <div className="relative w-[76px] h-[76px] sm:w-[82px] sm:h-[82px] transition-all duration-250 ease-out group-hover:scale-108 group-hover:-translate-y-1.5 group-active:scale-95 group-hover:shadow-[0_16px_30px_-6px_rgba(124,58,237,0.25)] rounded-[22px]">
        {renderIcon()}

        {/* Status Overlays */}
        {effectiveStatus === 'unauthorized' && (
          <div
            title={`Access Restricted: Requires ${module.requiredPermission}`}
            className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/90 text-white shadow-xs backdrop-blur-xs ring-2 ring-background"
          >
            <Lock className="h-2.5 w-2.5" />
          </div>
        )}

        {effectiveStatus === 'unsubscribed' && (
          <div
            title="Module Not Subscribed"
            className="absolute -top-1.5 -right-1.5 flex h-5 items-center justify-center rounded-full bg-slate-700/90 px-1.5 text-[9px] font-bold text-slate-200 shadow-xs backdrop-blur-xs ring-2 ring-background"
          >
            Unsubscribed
          </div>
        )}

        {effectiveStatus === 'unimplemented' && (
          <div
            title="Module in Development (Coming Soon)"
            className="absolute -top-1.5 -right-1.5 flex h-5 items-center justify-center rounded-full bg-amber-500/95 px-1.5 text-[9px] font-bold text-white shadow-xs backdrop-blur-xs ring-2 ring-background"
          >
            Soon
          </div>
        )}
      </div>

      {/* Label */}
      <span className="mt-2.5 text-[13px] font-medium tracking-tight text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors text-center line-clamp-1 max-w-[100px]">
        {module.shortName || module.name}
      </span>

      {/* Hidden Accessible Status for Screen Readers & Tests */}
      <span className="sr-only">
        {getScreenReaderStatus()}
      </span>
    </div>
  );
};
