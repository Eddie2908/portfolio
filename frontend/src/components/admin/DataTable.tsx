import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

type DataTableRow = Record<string, any> & {
  id?: string | number;
};

type DataTableColumn = {
  key: string;
  label: string;
  render?: (value: any, row: DataTableRow) => ReactNode;
};

type DataTableProps = {
  columns: DataTableColumn[];
  data: DataTableRow[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

export default function DataTable({ columns, data, page = 1, totalPages = 1, onPageChange }: DataTableProps) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-white/30">
                  Aucune donnée
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={row.id || i}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
          <span className="text-white/40 text-sm">
            Page {page} sur {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
