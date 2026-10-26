import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, header, footer, children, ...props }) => {
  return (
    <div
      className={cn('rounded-xl border border-slate-200 bg-white shadow-sm', className)}
      {...props}
    >
      {header && <div className="border-b border-slate-100 px-6 py-4">{header}</div>}
      <div className="px-6 py-5">{children}</div>
      {footer && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-3 rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
};
