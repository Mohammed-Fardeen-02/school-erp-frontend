import { useCallback } from 'react';
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
  const {
    permissionsSet,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useEffectivePermissions();

  const checkPermission = useCallback(
    (code: string): boolean => {
      // Fail-closed security rule: any unready or error state denies access
      if (isLoading || isError || !permissionsSet) {
        return false;
      }
      return permissionsSet.has(code);
    },
    [isLoading, isError, permissionsSet]
  );

  const hasPermission = permissionCode ? checkPermission(permissionCode) : false;

  return {
    hasPermission,
    isLoading,
    isError,
    isSuccess,
    error,
    checkPermission,
  };
}

