import type { PermissionNodeType } from './permissions.types';

export type MatrixExplicitState = 'GRANT' | 'DENY' | 'UNSET';

export type MatrixDisplayState =
  | 'EXPLICIT_GRANT'
  | 'EXPLICIT_DENY'
  | 'INHERITED_GRANT'
  | 'INHERITED_DENY'
  | 'DEFAULT_DENY'
  | 'MIXED';

export interface MatrixNodeModel {
  id: string;
  nodeCode: string;
  nodeName: string;
  nodeType: PermissionNodeType;
  nodeLevel: number;
  description: string | null;
  parentId: string | null;
  children: MatrixNodeModel[];

  // Explicit configuration on this role:
  explicitState: MatrixExplicitState; // 'GRANT' | 'DENY' | 'UNSET'
  initialExplicitState: MatrixExplicitState; // baseline for dirty tracking

  // Evaluated effective state:
  displayState: MatrixDisplayState;
  effectiveVote: 'GRANTED' | 'DENIED';
  inheritedFromCode: string | null;
  inheritedFromName: string | null;

  // Container aggregation counts:
  totalLeafCount: number;
  grantedLeafCount: number;
  deniedLeafCount: number;

  // Delegation restriction:
  canDelegate: boolean; // false if actor lacks this permission org-wide
}

export interface MatrixDiffItem {
  nodeId: string;
  nodeCode: string;
  previousState: MatrixExplicitState;
  nextState: MatrixExplicitState;
}
