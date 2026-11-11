import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

/**
 * AG Grid Dispute Ledger — Wise Light Design
 * Forest Ink headers, Linen Mist row hover, Lime Voltage status pills.
 */
export const DisputeLedger = ({ disputes, onSelectDispute }) => {
  const columnDefs = useMemo(() => [
    {
      headerName: "CASE ID",
      field: "id",
      minWidth: 150,
      cellRenderer: (p) => (
        <span style={{ color: '#163300', fontWeight: 700, fontFamily: 'IBM Plex Mono', fontSize: 13, cursor: 'pointer', letterSpacing: '-0.3px' }}>
          {p.value}
        </span>
      ),
      pinned: 'left',
    },
    {
      headerName: "PAYPAL TXN",
      field: "transaction_id",
      minWidth: 150,
      cellRenderer: (p) => (
        <span style={{ color: '#868685', fontFamily: 'IBM Plex Mono', fontSize: 12 }}>{p.value}</span>
      ),
    },
    {
      headerName: "DISPUTED AMOUNT",
      field: "amount",
      minWidth: 150,
      valueFormatter: (p) => `$${Number(p.value).toFixed(2)} USD`,
      cellStyle: { color: '#163300', fontWeight: 700, fontFamily: 'IBM Plex Mono', fontSize: 14, textAlign: 'right' },
      headerClass: 'text-right',
    },
    {
      headerName: "REASON",
      field: "reason",
      minWidth: 230,
      cellRenderer: (p) => (
        <span style={{ color: '#6a6c6a', fontFamily: 'IBM Plex Mono', fontSize: 12 }}>
          {p.value ? p.value.replace(/_/g, ' ') : ''}
        </span>
      ),
    },
    {
      headerName: "EVIDENCE",
      field: "evidence_type",
      minWidth: 180,
      cellRenderer: (p) => (
        <span style={{ color: '#454745', fontFamily: 'IBM Plex Mono', fontSize: 12 }}>
          {p.value ? p.value.replace(/_/g, ' ') : 'SYNTHESIZING...'}
        </span>
      ),
    },
    {
      headerName: "SLA",
      field: "execution_time_seconds",
      minWidth: 100,
      valueFormatter: (p) => p.value ? `${p.value}s` : 'Pending',
      cellStyle: { color: '#868685', fontFamily: 'IBM Plex Mono', fontSize: 12 },
    },
    {
      headerName: "STATUS",
      field: "status",
      minWidth: 160,
      cellRenderer: (p) => {
        const v = p.value;
        let bg = '#e8ebe6', color = '#454745';
        if (v === 'AUTO_DEFENDED') { bg = '#e2f6d5'; color = '#163300'; }
        if (v === 'PROCESSING')    { bg = '#163300'; color = '#9fe870'; }
        return (
          <span style={{
            display: 'inline-block', padding: '3px 12px', borderRadius: 9999,
            background: bg, color, fontSize: 11, fontWeight: 600,
            fontFamily: 'IBM Plex Mono', letterSpacing: '0.03em',
          }}>
            {v}
          </span>
        );
      },
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true, filter: true, resizable: true, flex: 1,
  }), []);

  return (
    <div className="w-full h-[380px] ag-theme-alpine" style={{ borderRadius: 10, overflow: 'hidden' }}>
      <AgGridReact
        rowData={disputes}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onRowClicked={(e) => e.data && onSelectDispute && onSelectDispute(e.data)}
        rowSelection="single"
        headerHeight={40}
        rowHeight={44}
        animateRows={false}
      />
    </div>
  );
};
