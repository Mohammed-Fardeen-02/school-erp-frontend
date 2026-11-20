import React from 'react';
import {
  WorkspacePageHeader,
  type WorkspacePageHeaderProps,
} from '@/components/navigation/page-header';

export interface AdminPageHeaderProps extends WorkspacePageHeaderProps {}

/**
 * AdminPageHeader
 * Standardized across all School ERP administration views.
 * Aliased to the universal WorkspacePageHeader.
 */
export const AdminPageHeader: React.FC<AdminPageHeaderProps> = (props) => {
  return <WorkspacePageHeader {...props} />;
};
