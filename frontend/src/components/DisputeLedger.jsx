import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

/**
 * Enterprise Dispute Ledger built on AG Grid (Sponsor Tool).
 * High-density financial transaction table styled in dark institutional palette.
 */
export const DisputeLedger = ({ disputes, onSelectDispute, selectedDisputeId }) => {

  const columnDefs = useMemo(() => [
    {
      headerName: "CASE IDENTIFIER",
      field: "id",
      minWidth: 160,
      cellRenderer: (params) => (
        <span className="font-mono text-xs font-semibold text-accent hover:underline cursor-pointer">
          {params.value}
        </span>
      ),
      pinned: 'left'
    },
    {
      headerName: "PAYPAL TXN REF",
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
      headerName: "CHARGEBACK REASON",
      field: "reason",
      minWidth: 240,
      cellRenderer: (params) => (
        <span className="font-mono text-[11px] text-ink-muted uppercase">
          {params.value ? params.value.replace(/_/g, " ") : ""}
        </span>
      )
    },
    {
      headerName: "RETRIEVED EVIDENCE",
      field: "evidence_type",
      minWidth: 180,
      cellRenderer: (params) => (
        <span className="font-mono text-[11px] text-ink-secondary">
          {params.value ? params.value.replace(/_/g, " ") : "SYNTHESIZING..."}
        </span>
      )
    },
    {
      headerName: "DEFENSE SLA",
      field: "execution_time_seconds",
      minWidth: 120,
      valueFormatter: (params) => params.value ? `${params.value}s` : "Pending",
      cellClass: "font-mono text-xs text-ink-muted"
    },
    {
      headerName: "ADJUDICATION STATE",
      field: "status",
      minWidth: 160,
      cellRenderer: (params) => {
        const status = params.value;
        let badgeStyle = "bg-[#1E293B] text-slate-300 border-[#334155]";
        if (status === "AUTO_DEFENDED") {
          badgeStyle = "bg-[#064E3B]/60 text-emerald-300 border-[#059669]";
        } else if (status === "PROCESSING") {
          badgeStyle = "bg-[#1E3A8A]/60 text-blue-300 border-[#2563EB]";
        }

        return (
          <span className={`inline-block px-2 py-0.5 text-[10px] font-mono font-medium border rounded-[1px] ${badgeStyle}`}>
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
        headerHeight={38}
        rowHeight={40}
        animateRows={false}
      />
    </div>
  );
};
