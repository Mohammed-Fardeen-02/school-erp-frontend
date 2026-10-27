import { type ReactNode } from 'react';
import { MoreHorizontal, Eye, Edit2, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown';

export interface CustomAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  className?: string;
}

export interface ActionMenuProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  customActions?: CustomAction[];
}

export function ActionMenu({ onView, onEdit, onDelete, customActions }: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors focus:outline-none"
          onClick={e => e.stopPropagation()}
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-36">
        {onView && (
          <DropdownMenuItem
            onClick={e => {
              e.stopPropagation();
              onView();
            }}
          >
            <Eye className="w-4 h-4 mr-2 text-primary" />
            <span className="font-medium text-sm">View</span>
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem
            onClick={e => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Edit2 className="w-4 h-4 mr-2 text-primary" />
            <span className="font-medium text-sm">Edit</span>
          </DropdownMenuItem>
        )}
        {customActions &&
          customActions.map((action, idx) => (
            <DropdownMenuItem
              key={idx}
              onClick={e => {
                e.stopPropagation();
                action.onClick();
              }}
              className={action.className}
            >
              {action.icon && (
                <span className="mr-2 flex items-center shrink-0">{action.icon}</span>
              )}
              <span className="font-medium text-sm">{action.label}</span>
            </DropdownMenuItem>
          ))}
        {onDelete && (
          <DropdownMenuItem
            onClick={e => {
              e.stopPropagation();
              onDelete();
            }}
            variant="destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            <span className="font-medium text-sm">Delete</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
