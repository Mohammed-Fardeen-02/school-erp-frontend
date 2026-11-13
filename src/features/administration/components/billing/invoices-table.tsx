import React from 'react';
import { Download, FileText } from 'lucide-react';
import { DataTable, type DataTableColumn } from '@/components/data-display/data-table';
import { AdminStatusBadge } from '../common/admin-status-badge';
import type { BillingInvoice } from '../../types/admin.types';

export interface InvoicesTableProps {
  invoices: BillingInvoice[];
}

export const InvoicesTable: React.FC<InvoicesTableProps> = ({ invoices }) => {
  const columns: DataTableColumn<BillingInvoice>[] = [
    {
      key: 'invoiceNumber',
      label: 'INVOICE #',
      sortable: true,
      align: 'left',
      render: (_, row) => (
        <div className="flex items-center gap-2 font-mono font-bold text-xs text-foreground">
          <FileText className="h-4 w-4 text-primary shrink-0" />
          <span>{row.invoiceNumber}</span>
        </div>
      ),
    },
    {
      key: 'periodStart',
      label: 'BILLING PERIOD',
      sortable: true,
      align: 'left',
      render: (_, row) => (
        <span className="text-xs text-muted-foreground">
          {row.periodStart} → {row.periodEnd}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'AMOUNT',
      sortable: true,
      align: 'left',
      render: (_, row) => (
        <span className="font-bold text-xs text-foreground">
          ${row.amount.toLocaleString()} {row.currency}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      sortable: true,
      align: 'center',
      render: (val) => <AdminStatusBadge status={val} />,
    },
    {
      key: 'paymentMethod',
      label: 'PAYMENT METHOD',
      sortable: true,
      align: 'left',
      render: (val) => (
        <span className="text-xs text-muted-foreground">{String(val || '—')}</span>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-1">
        <div>
          <h3 className="text-base font-bold text-foreground">Billing & Invoice History</h3>
          <p className="text-xs text-muted-foreground">
            Download past tax invoices, receipts, and payment transactions.
          </p>
        </div>
      </div>

      <DataTable<BillingInvoice>
        columns={columns}
        data={invoices}
        rowIdKey="id"
        resultLabel="invoices"
        actionConfig={{
          onView: (row) => alert(`Downloading invoice ${row.invoiceNumber}`),
          customActions: (row) => [
            {
              label: 'Download PDF',
              icon: <Download className="h-4 w-4 text-primary" />,
              onClick: () => alert(`Downloading PDF receipt for invoice ${row.invoiceNumber}`),
            },
          ],
        }}
      />
    </div>
  );
};

