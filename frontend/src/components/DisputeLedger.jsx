import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

/**
 * Enterprise Dispute Ledger built on AG Grid (Sponsor Tool).
 * Displays dense financial transaction records with custom status renderers.
 */
export const DisputeLedger = ({ disputes, onSelectDispute, selectedDisputeId }) => {

  const columnDefs = useMemo(() => [
    {
      headerName: "CASE IDENTIFIER",
      field: "id",
      minWidth: 160,
      cellRenderer: (params) => (
        <span className="font-mono text-xs font-semibold text-periwinkle hover:underline cursor-pointer">
          {params.value}
        </span>
      ),
      pinned: 'left'
    },
    {
      headerName: "PAYPAL TRANSACTION",
      field: "transaction_id",
      minWidth: 160,
      cellRenderer: (params) => (
        <span className="font-mono text-xs text-ink-secondary">
          {params.value}
        </span>
      )
    },
    {
      headerName: "DISPUTED CAPITAL",
      field: "amount",
      minWidth: 140,
      valueFormatter: (params) => `$${Number(params.value).toFixed(2)} USD`,
      cellClass: "font-mono text-xs font-semibold text-ink text-right",
      headerClass: "text-right"
    },
    {
      headerName: "REASON CODE",
      field: "reason",
      minWidth: 220,
      cellRenderer: (params) => (
        <span className="font-mono text-[11px] text-ink-muted uppercase">
          {params.value.replace(/_/g, " ")}
        </span>
      )
    },
    {
      headerName: "EVIDENCE CATEGORY",
      field: "evidence_type",
      minWidth: 180,
      cellRenderer: (params) => (
        <span className="font-mono text-[11px] text-ink-secondary">
          {params.value ? params.value.replace(/_/g, " ") : "SYNTHESIZING"}
        </span>
      )
    },
    {
      headerName: "EXECUTION TIME",
      field: "execution_time_seconds",
      minWidth: 130,
      valueFormatter: (params) => params.value ? `${params.value}s` : "Pending",
      cellClass: "font-mono text-xs text-ink-muted"
    },
    {
      headerName: "STATUS",
      field: "status",
      minWidth: 150,
      cellRenderer: (params) => {
        const status = params.value;
        let badgeStyle = "bg-slate-200 text-ink-secondary border-slate-300";
        if (status === "AUTO_DEFENDED") {
          badgeStyle = "bg-emerald-100/70 text-emerald-900 border-emerald-300";
        } else if (status === "PROCESSING") {
          badgeStyle = "bg-blue-100/70 text-blue-900 border-blue-300";
        }

        return (
          <span className={`inline-block px-2 py-0.5 text-[10px] font-mono font-medium border rounded-[2px] ${badgeStyle}`}>
            {status}
          </span>
        );
      }
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1
  }), []);

  const handleRowClick = (event) => {
    if (onSelectDispute && event.data) {
      onSelectDispute(event.data);
    }
  };

  return (
    <div className="w-full h-[360px] ag-theme-alpine">
      <AgGridReact
        rowData={disputes}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onRowClicked={handleRowClick}
        rowSelection="single"
        headerHeight={36}
        rowHeight={38}
        animateRows={false}
      />
    </div>
  );
};

