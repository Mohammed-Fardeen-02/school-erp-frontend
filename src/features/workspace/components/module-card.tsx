import * as React from 'react';
import type { ModuleConfig } from '@/app/config/modules.config';
import { AppIconTile } from './app-icon-tile';

export interface ModuleCardProps {
  module: ModuleConfig;
  isPermitted: boolean;
  onSelect?: (module: ModuleConfig) => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, isPermitted, onSelect }) => {
  return <AppIconTile module={module} isPermitted={isPermitted} onSelect={onSelect} />;
};
