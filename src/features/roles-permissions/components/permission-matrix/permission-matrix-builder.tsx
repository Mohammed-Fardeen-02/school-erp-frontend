import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Shield,
  Layers,
  ChevronDown,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { usePermissionTree } from '../../hooks/use-permission-tree';
import { useRolePermissionsMatrix, useUpdateRolePermissions } from '../../hooks/use-roles';
import { useEffectivePermissions } from '../../hooks/use-effective-permissions';
import { MatrixTreeNode } from './matrix-tree-node';
import { MatrixStickyBar } from './matrix-sticky-bar';
import { Input } from '@/components/forms/input';
import { Alert } from '@/components/feedback/alert';
import { Spinner } from '@/components/feedback/spinner';
import type {
  MatrixNodeModel,
  MatrixExplicitState,
  MatrixDisplayState,
} from '../../types/matrix.types';
import type { CanonicalTreeNode } from '../../types/permissions.types';

export interface PermissionMatrixBuilderProps {
  roleId: string;
  roleName: string;
  roleCode: string;
  isReadOnly?: boolean;
  onClose?: () => void;
}

export const PermissionMatrixBuilder: React.FC<PermissionMatrixBuilderProps> = ({
  roleId,
  roleName,
  roleCode,
  isReadOnly = false,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [overrides, setOverrides] = useState<Map<string, MatrixExplicitState>>(new Map());
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Queries
  const { data: treeData, isLoading: treeLoading, error: treeError } = usePermissionTree();
  const {
    data: roleMatrixData,
    isLoading: roleLoading,
    error: roleError,
  } = useRolePermissionsMatrix(roleId);
  const { permissionsSet: actorPermissions, isLoading: actorLoading } = useEffectivePermissions();

  // Mutation
  const updatePermissionsMutation = useUpdateRolePermissions();

  // Baseline explicit permissions map from server
  const baselineMap = useMemo(() => {
    const map = new Map<string, MatrixExplicitState>();
    if (roleMatrixData?.permissions) {
      for (const item of roleMatrixData.permissions) {
        if (item.isDirect) {
          map.set(item.nodeId, item.isGranted ? 'GRANT' : 'DENY');
        }
      }
    }
    return map;
  }, [roleMatrixData?.permissions]);

  // Handle single leaf/node explicit state change
  const handleSetExplicitState = (nodeId: string, state: MatrixExplicitState) => {
    if (isReadOnly) return;
    setOverrides((prev) => {
      const next = new Map(prev);
      const baseline = baselineMap.get(nodeId) ?? 'UNSET';
      if (state === baseline) {
        next.delete(nodeId);
      } else {
        next.set(nodeId, state);
      }
      return next;
    });
  };

  // Helper to collect all child IDs under a container
  const collectChildIds = (node: MatrixNodeModel): string[] => {
    let ids: string[] = [];
    if (node.nodeType === 'ACTION' || (!node.children || node.children.length === 0)) {
      ids.push(node.id);
    }
    if (node.children) {
      for (const child of node.children) {
        ids = ids.concat(collectChildIds(child));
      }
    }
    return ids;
  };

  // Bulk cascade to children
  const handleCascadeState = (node: MatrixNodeModel, state: MatrixExplicitState) => {
    if (isReadOnly) return;
    const childIds = collectChildIds(node);
    setOverrides((prev) => {
      const next = new Map(prev);
      for (const id of childIds) {
        const baseline = baselineMap.get(id) ?? 'UNSET';
        if (state === baseline) {
          next.delete(id);
        } else {
          next.set(id, state);
        }
      }
      return next;
    });
  };

  // Recursive tree evaluator calculating effective inheritance, mixed states, and delegation limits
  const evaluatedTree: MatrixNodeModel[] = useMemo(() => {
    if (!treeData) return [];

    const evaluateBranch = (
      rawNode: CanonicalTreeNode,
      ancestorExplicitState: MatrixExplicitState = 'UNSET',
      ancestorCode: string | null = null,
      ancestorName: string | null = null
    ): MatrixNodeModel => {
      const initialExplicitState = baselineMap.get(rawNode.id) ?? 'UNSET';
      const explicitState = overrides.has(rawNode.id)
        ? (overrides.get(rawNode.id) as MatrixExplicitState)
        : initialExplicitState;

      // Current effective vote: explicit override wins; otherwise inherits from ancestor; defaults to DENIED
      let effectiveVote: 'GRANTED' | 'DENIED' = 'DENIED';
      let inheritedFromCode: string | null = null;
      let inheritedFromName: string | null = null;

      if (explicitState === 'GRANT') {
        effectiveVote = 'GRANTED';
      } else if (explicitState === 'DENY') {
        effectiveVote = 'DENIED';
      } else if (ancestorExplicitState === 'GRANT') {
        effectiveVote = 'GRANTED';
        inheritedFromCode = ancestorCode;
        inheritedFromName = ancestorName;
      } else if (ancestorExplicitState === 'DENY') {
        effectiveVote = 'DENIED';
        inheritedFromCode = ancestorCode;
        inheritedFromName = ancestorName;
      }

      // Next ancestor context to pass down to children
      const nextAncestorState = explicitState !== 'UNSET' ? explicitState : ancestorExplicitState;
      const nextAncestorCode = explicitState !== 'UNSET' ? rawNode.nodeCode : ancestorCode;
      const nextAncestorName = explicitState !== 'UNSET' ? rawNode.nodeName : ancestorName;

      // Evaluate children recursively
      const children: MatrixNodeModel[] = (rawNode.children || []).map((child) =>
        evaluateBranch(child, nextAncestorState, nextAncestorCode, nextAncestorName)
      );

      // Aggregate leaf counts
      let totalLeafCount = 0;
      let grantedLeafCount = 0;
      let deniedLeafCount = 0;

      if (rawNode.nodeType === 'ACTION' || children.length === 0) {
        totalLeafCount = 1;
        if (effectiveVote === 'GRANTED') grantedLeafCount = 1;
        else deniedLeafCount = 1;
      } else {
        for (const child of children) {
          totalLeafCount += child.totalLeafCount;
          grantedLeafCount += child.grantedLeafCount;
          deniedLeafCount += child.deniedLeafCount;
        }
      }

      // Determine visual display state
      let displayState: MatrixDisplayState = 'DEFAULT_DENY';

      if (rawNode.nodeType !== 'ACTION' && children.length > 0) {
        if (grantedLeafCount === totalLeafCount && totalLeafCount > 0) {
          displayState = 'EXPLICIT_GRANT';
        } else if (grantedLeafCount === 0) {
          displayState = 'DEFAULT_DENY';
        } else {
          displayState = 'MIXED';
        }
      } else {
        if (explicitState === 'GRANT') {
          displayState = 'EXPLICIT_GRANT';
        } else if (explicitState === 'DENY') {
          displayState = 'EXPLICIT_DENY';
        } else if (effectiveVote === 'GRANTED' && inheritedFromCode) {
          displayState = 'INHERITED_GRANT';
        } else if (effectiveVote === 'DENIED' && inheritedFromCode) {
          displayState = 'INHERITED_DENY';
        } else {
          displayState = 'DEFAULT_DENY';
        }
      }

      // Delegation ceiling: actor must actively possess the permission org-wide to grant it
      const canDelegate = actorPermissions?.has(rawNode.nodeCode) ?? true;

      return {
        id: rawNode.id,
        nodeCode: rawNode.nodeCode,
        nodeName: rawNode.nodeName,
        nodeType: rawNode.nodeType,
        nodeLevel: rawNode.nodeLevel,
        description: rawNode.description,
        parentId: rawNode.parentId,
        children,
        explicitState,
        initialExplicitState,
        displayState,
        effectiveVote,
        inheritedFromCode,
        inheritedFromName,
        totalLeafCount,
        grantedLeafCount,
        deniedLeafCount,
        canDelegate,
      };
    };

    return treeData.map((rootNode) => evaluateBranch(rootNode));
  }, [treeData, overrides, baselineMap, actorPermissions]);

  // Compute dirty changes against baseline
  const diff = useMemo(() => {
    const changes: Array<{
      nodeId: string;
      nodeCode: string;
      isGranted: boolean | null;
      type: 'GRANT' | 'DENY' | 'RESET';
    }> = [];

    // Check all touched overrides
    overrides.forEach((state, nodeId) => {
      const initial = baselineMap.get(nodeId) ?? 'UNSET';
      if (state !== initial) {
        if (state === 'GRANT') {
          changes.push({ nodeId, nodeCode: '', isGranted: true, type: 'GRANT' });
        } else if (state === 'DENY') {
          changes.push({ nodeId, nodeCode: '', isGranted: false, type: 'DENY' });
        } else if (state === 'UNSET') {
          changes.push({ nodeId, nodeCode: '', isGranted: null, type: 'RESET' });
        }
      }
    });

    return changes;
  }, [overrides, baselineMap]);

  const dirtyCount = diff.length;
  const grantsCount = diff.filter((d) => d.type === 'GRANT').length;
  const deniesCount = diff.filter((d) => d.type === 'DENY').length;
  const resetsCount = diff.filter((d) => d.type === 'RESET').length;

  const handleDiscard = () => {
    setOverrides(new Map());
    setFeedback(null);
  };

  const handleSave = async () => {
    if (diff.length === 0 || isReadOnly) return;
    try {
      setFeedback(null);
      await updatePermissionsMutation.mutateAsync({
        roleId,
        permissions: diff.map((d) => ({
          nodeId: d.nodeId,
          isGranted: d.isGranted,
        })),
      });

      setOverrides(new Map());
      setFeedback({
        type: 'success',
        text: `Role permissions matrix successfully saved (${diff.length} capability rules updated)`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save capability matrix';
      setFeedback({ type: 'error', text: msg });
    }
  };

  const isLoading = treeLoading || roleLoading || actorLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4">
        <Spinner size="lg" />
        <p className="text-xs text-muted-foreground animate-pulse">
          Loading canonical permission tree catalog and role capabilities...
        </p>
      </div>
    );
  }

  if (treeError || roleError) {
    return (
      <div className="p-6">
        <Alert variant="error" title="Capability Matrix Error">
          {treeError?.message || roleError?.message || 'Failed to load permission catalog.'}
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full relative pb-24" data-testid="permission-matrix-builder">
      {/* Header and Filter Bar */}
      <div className="sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-border p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">{roleName}</h2>
                <code className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground border border-border">
                  {roleCode}
                </code>
                {isReadOnly && (
                  <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                    Read-Only Template
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Configure explicit grants, denials, and recursive module inheritance
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-72">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by capability or code..."
              leftIcon={<Search className="w-4 h-4 text-muted-foreground" />}
              className="text-xs"
            />
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center gap-3 pt-2 border-t border-border/60 text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground">Legend:</span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded bg-emerald-600 inline-block" /> Explicit Grant
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded bg-rose-600 inline-block" /> Explicit Deny
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded border border-emerald-400 bg-emerald-50 inline-block" /> Inherited Grant
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded border border-rose-400 bg-rose-50 inline-block" /> Inherited Deny
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded border border-border bg-surface inline-block" /> Default Deny (Unset)
          </span>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className="p-4">
          <Alert
            variant={feedback.type === 'success' ? 'success' : 'error'}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-danger" />
              )}
              <span>{feedback.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-xs font-semibold underline hover:opacity-80 ml-4 cursor-pointer"
            >
              Dismiss
            </button>
          </Alert>
        </div>
      )}

      {/* Tree Canvas */}
      <div className="divide-y divide-border border border-border rounded-xl bg-surface mx-4 mt-4 overflow-hidden shadow-xs">
        {evaluatedTree.map((rootNode) => (
          <MatrixTreeNode
            key={rootNode.id}
            node={rootNode}
            searchTerm={searchTerm}
            isReadOnly={isReadOnly}
            onSetExplicitState={handleSetExplicitState}
            onCascadeState={handleCascadeState}
            depth={0}
          />
        ))}
      </div>

      {/* Sticky Bottom Save Bar */}
      <MatrixStickyBar
        dirtyCount={dirtyCount}
        grantsCount={grantsCount}
        deniesCount={deniesCount}
        resetsCount={resetsCount}
        isSaving={updatePermissionsMutation.isPending}
        onDiscard={handleDiscard}
        onSave={handleSave}
      />
    </div>
  );
};
