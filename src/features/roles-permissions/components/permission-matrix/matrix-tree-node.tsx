import * as React from 'react';
import { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Check,
  X,
  RotateCcw,
  Lock,
  Layers,
  Folder,
  FolderOpen,
  FileCode,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TriStateCheckbox } from './tri-state-checkbox';
import { InheritanceBadge } from './inheritance-badge';
import type { MatrixNodeModel, MatrixExplicitState } from '../../types/matrix.types';

export interface MatrixTreeNodeProps {
  node: MatrixNodeModel;
  searchTerm?: string;
  isReadOnly?: boolean;
  onSetExplicitState: (nodeId: string, state: MatrixExplicitState) => void;
  onCascadeState: (node: MatrixNodeModel, state: MatrixExplicitState) => void;
  depth?: number;
}

export const MatrixTreeNode: React.FC<MatrixTreeNodeProps> = ({
  node,
  searchTerm = '',
  isReadOnly = false,
  onSetExplicitState,
  onCascadeState,
  depth = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const hasChildren = node.children && node.children.length > 0;
  const isLeaf = node.nodeType === 'ACTION' || !hasChildren;

  // Search matching highlights
  const matchesSearch =
    searchTerm.trim() !== '' &&
    (node.nodeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.nodeCode.toLowerCase().includes(searchTerm.toLowerCase()));

  // Render container icon
  const renderTypeIcon = () => {
    switch (node.nodeType) {
      case 'MODULE':
        return <Layers className="w-4 h-4 text-primary" />;
      case 'SECTION':
      case 'FEATURE':
        return isExpanded ? (
          <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
        ) : (
          <Folder className="w-3.5 h-3.5 text-blue-600" />
        );
      case 'ACTION':
      default:
        return <FileCode className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  // Indentation styles based on depth
  const depthPadding = {
    0: 'pl-3',
    1: 'pl-7',
    2: 'pl-11',
    3: 'pl-15',
  }[depth] || 'pl-4';

  return (
    <div className="w-full flex flex-col" data-testid={`matrix-node-${node.nodeCode}`}>
      {/* Node Row Header */}
      <div
        className={cn(
          'flex items-center justify-between py-2 px-3 border-b border-border transition-colors group',
          depth === 0 ? 'bg-surface-muted/40 font-semibold' : 'bg-surface hover:bg-surface-muted/30',
          matchesSearch && 'bg-amber-500/10 border-amber-300'
        )}
      >
        <div className={cn('flex items-center gap-2.5 flex-1 min-w-0 pr-4', depthPadding)}>
          {/* Expand/Collapse Chevron for Containers */}
          {hasChildren ? (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors"
              aria-label={isExpanded ? 'Collapse node' : 'Expand node'}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}

          {/* Tri-state Checkbox */}
          <TriStateCheckbox
            displayState={node.displayState}
            disabled={isReadOnly || (!node.canDelegate && isLeaf)}
            onClick={() => {
              if (isLeaf) {
                // Leaf cycles: UNSET -> GRANT -> DENY -> UNSET
                if (node.explicitState === 'UNSET') onSetExplicitState(node.id, 'GRANT');
                else if (node.explicitState === 'GRANT') onSetExplicitState(node.id, 'DENY');
                else onSetExplicitState(node.id, 'UNSET');
              } else {
                // Container toggles all descendants: if granted -> unset, else grant
                if (node.displayState === 'EXPLICIT_GRANT') {
                  onCascadeState(node, 'UNSET');
                } else {
                  onCascadeState(node, 'GRANT');
                }
              }
            }}
          />

          {/* Type Icon */}
          <span className="shrink-0">{renderTypeIcon()}</span>

          {/* Title and Code */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'text-xs truncate text-foreground',
                  depth === 0 ? 'font-bold text-sm' : depth === 1 ? 'font-semibold' : 'font-medium'
                )}
              >
                {node.nodeName}
              </span>
              <code className="text-[10px] font-mono text-muted-foreground/80 hidden sm:inline">
                {node.nodeCode}
              </code>
            </div>
            {node.description && (
              <span className="text-[11px] text-muted-foreground truncate max-w-md hidden md:inline">
                {node.description}
              </span>
            )}
          </div>
        </div>

        {/* Right Action & Badge Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Inheritance State Badge */}
          <InheritanceBadge
            displayState={node.displayState}
            inheritedFromName={node.inheritedFromName}
          />

          {/* Container Leaf Stats */}
          {!isLeaf && (
            <span className="text-[11px] text-muted-foreground font-mono bg-surface-muted px-2 py-0.5 rounded-full border border-border">
              {node.grantedLeafCount}/{node.totalLeafCount} granted
            </span>
          )}

          {/* Delegation Ceiling Lock Warning */}
          {!node.canDelegate && isLeaf && !isReadOnly && (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full dark:bg-amber-950/40 dark:text-amber-300"
              title="You cannot delegate this permission because you do not possess it in the active workspace"
            >
              <Lock className="w-3 h-3 text-amber-600" />
              Ceiling Lock
            </span>
          )}

          {/* Quick Action Buttons for Leaf Actions */}
          {isLeaf && !isReadOnly && node.canDelegate && (
            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => onSetExplicitState(node.id, 'GRANT')}
                title="Explicitly Grant"
                className={cn(
                  'p-1 rounded text-xs transition-colors cursor-pointer',
                  node.explicitState === 'GRANT'
                    ? 'bg-emerald-600 text-white'
                    : 'text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700'
                )}
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onSetExplicitState(node.id, 'DENY')}
                title="Explicitly Deny"
                className={cn(
                  'p-1 rounded text-xs transition-colors cursor-pointer',
                  node.explicitState === 'DENY'
                    ? 'bg-rose-600 text-white'
                    : 'text-muted-foreground hover:bg-rose-50 hover:text-rose-700'
                )}
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {node.explicitState !== 'UNSET' && (
                <button
                  type="button"
                  onClick={() => onSetExplicitState(node.id, 'UNSET')}
                  title="Reset to Inherited State"
                  className="p-1 rounded text-xs text-muted-foreground hover:bg-surface-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Container Bulk Cascading Buttons */}
          {!isLeaf && !isReadOnly && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => onCascadeState(node, 'GRANT')}
                className="text-[10px] font-semibold text-emerald-700 hover:bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 transition-colors"
                title="Cascade Grant to all child permissions"
              >
                Grant All
              </button>
              <button
                type="button"
                onClick={() => onCascadeState(node, 'DENY')}
                className="text-[10px] font-semibold text-rose-700 hover:bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 transition-colors"
                title="Cascade Deny to all child permissions"
              >
                Deny All
              </button>
              <button
                type="button"
                onClick={() => onCascadeState(node, 'UNSET')}
                className="text-[10px] font-semibold text-slate-600 hover:bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 transition-colors"
                title="Reset all children to inherit baseline"
              >
                Reset All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Render Nested Children if Expanded */}
      {hasChildren && isExpanded && (
        <div className="flex flex-col">
          {node.children.map((child) => (
            <MatrixTreeNode
              key={child.id}
              node={child}
              searchTerm={searchTerm}
              isReadOnly={isReadOnly}
              onSetExplicitState={onSetExplicitState}
              onCascadeState={onCascadeState}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
