import { useCallback } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useEffectivePermissions } from './use-effective-permissions';

export interface UsePermissionResult {
  /**
   * Whether the specified permission is granted.
   * Guaranteed to be false if permissions are loading or in error (fail-closed).
   */
  hasPermission: boolean;
  /**
   * Whether effective permissions are currently being fetched
   */
  isLoading: boolean;
  /**
   * Whether fetching effective permissions failed
   */
  isError: boolean;
  /**
   * Whether effective permissions were successfully loaded
   */
  isSuccess: boolean;
  /**
   * Error details if the query failed
   */
  error: Error | null;
  /**
   * Imperative helper to check any permission code against the loaded set
   */
  checkPermission: (permissionCode: string) => boolean;
}

/**
 * Authoritative UI authorization hook consuming server-computed effective permissions.
 *
 * Implements strict fail-closed evaluation:
 * - If permissions are loading -> returns false
 * - If query encountered an error -> returns false
 * - If caller has no permissions -> returns false
 * - Checks exact membership in the backend-provided normalized permission set.
 */
export function usePermission(permissionCode?: string): UsePermissionResult {
  const isSuperAdmin = useAuthStore((state) => state.user?.role === 'SUPER_ADMIN');
  const {
    permissionsSet,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useEffectivePermissions();

  const checkPermission = useCallback(
    (code: string): boolean => {
      // Platform super-admins possess universal bypass
      if (isSuperAdmin) {
        return true;
      }
      // Fail-closed security rule: any unready or error state denies access
      if (isLoading || isError || !permissionsSet) {
        return false;
      }
      return permissionsSet.has(code);
    },
    [isSuperAdmin, isLoading, isError, permissionsSet]
  );

  const hasPermission = isSuperAdmin ? true : (permissionCode ? checkPermission(permissionCode) : false);

  return {
    hasPermission,
    isLoading: isSuperAdmin ? false : isLoading,
    isError: isSuperAdmin ? false : isError,
    isSuccess: isSuperAdmin ? true : isSuccess,
    error: isSuperAdmin ? null : error,
    checkPermission,
  };
}

