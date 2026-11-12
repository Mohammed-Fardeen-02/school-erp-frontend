import React from 'react';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminStatusBadge } from '../common/admin-status-badge';
import type { BillingInvoice } from '../../types/admin.types';

export interface InvoicesTableProps {
  invoices: BillingInvoice[];
}

export const InvoicesTable: React.FC<InvoicesTableProps> = ({ invoices }) => {
  return (
    <div className="rounded-2xl border border-border bg-surface shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-surface-muted/30">
        <h3 className="text-base font-bold text-foreground">Billing & Invoice History</h3>
        <p className="text-xs text-muted-foreground">
          Download past tax invoices, receipts, and payment transactions.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-muted/60 text-muted-foreground uppercase font-bold text-[10px] tracking-wider border-b border-border">
            <tr>
              <th className="py-3 px-4">Invoice #</th>
              <th className="py-3 px-4">Billing Period</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-surface-muted/30 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  {inv.invoiceNumber}
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  {inv.periodStart} → {inv.periodEnd}
                </td>
                <td className="py-3 px-4 font-bold text-foreground">
                  ${inv.amount.toLocaleString()} {inv.currency}
                </td>
                <td className="py-3 px-4">
                  <AdminStatusBadge status={inv.status} />
                </td>
                <td className="py-3 px-4 text-muted-foreground">{inv.paymentMethod}</td>
                <td className="py-3 px-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => alert(`Downloading invoice ${inv.invoiceNumber}`)}
                    icon={<Download className="h-3.5 w-3.5" />}
                  >
                    PDF
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

