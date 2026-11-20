import React from 'react';
import { Drawer, type DrawerProps, type DrawerWidth } from '@/components/ui/drawer';

export interface AdminDrawerProps extends DrawerProps {}

/**
 * AdminDrawer
 * Legacy alias for the universal Drawer component.
 * Preserves 100% backward-compatibility across all administration pages and tests.
 */
export const AdminDrawer: React.FC<AdminDrawerProps> = (props) => {
  return <Drawer {...props} />;
};

export type { DrawerWidth };
