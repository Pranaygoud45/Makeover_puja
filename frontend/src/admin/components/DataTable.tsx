import React, { useMemo, useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  render: (row: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  pageSize?: number;
  /* Optional server-side pagination */
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No records found.',
  pageSize = 10,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [internalPage, setInternalPage] = useState(1);

  const isServerPaginated =
    typeof currentPage === 'number' &&
    typeof totalPages === 'number' &&
    typeof onPageChange === 'function';

  const activePage = isServerPaginated ? currentPage : internalPage;

  const handleSort = (col: Column<T>) => {
    if (!col.sortable) return;
    if (sortKey === col.key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return data;

    return [...data].sort((a, b) => {
      const aVal = col.sortValue
        ? col.sortValue(a)
        : String((a as Record<string, unknown>)[col.key] ?? '');
      const bVal = col.sortValue
        ? col.sortValue(b)
        : String((b as Record<string, unknown>)[col.key] ?? '');

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const cmp = String(aVal).localeCompare(String(bVal), undefined, {
        numeric: true,
        sensitivity: 'base',
      });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, columns, sortKey, sortDir]);

  const computedTotalPages = isServerPaginated
    ? Math.max(1, totalPages)
    : Math.max(1, Math.ceil(sortedData.length / pageSize));

  const safePage = Math.min(activePage, computedTotalPages);

  const paginatedRows = useMemo(() => {
    if (isServerPaginated) return sortedData;
    const start = (safePage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [isServerPaginated, sortedData, safePage, pageSize]);

  const handlePageSelect = (nextPage: number) => {
    if (nextPage < 1 || nextPage > computedTotalPages) return;
    if (isServerPaginated && onPageChange) {
      onPageChange(nextPage);
    } else {
      setInternalPage(nextPage);
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-lg border border-champagne/70 bg-white">
        <div className="divide-y divide-champagne/40 p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="h-10 animate-pulse rounded-sm bg-ivory" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-champagne/70 bg-white p-12 text-center">
        <p className="text-sm text-espresso/60">{emptyMessage}</p>
      </div>
    );
  }

  const resolvedTotal = totalItems ?? sortedData.length;

  return (
    <div className="overflow-hidden rounded-lg border border-champagne/70 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-champagne/70 bg-ivory/80 text-xs font-semibold uppercase tracking-wider text-espresso/70">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3.5 whitespace-nowrap',
                    col.sortable && 'cursor-pointer select-none hover:text-espresso',
                    col.className
                  )}
                  onClick={() => handleSort(col)}
                >
                  <div className="inline-flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-espresso/40">
                        {sortKey === col.key ? (
                          sortDir === 'asc' ? (
                            <ArrowUp className="h-3.5 w-3.5 text-rose-dark" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5 text-rose-dark" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-champagne/40">
            {paginatedRows.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  'transition-colors hover:bg-ivory/60',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn('px-4 py-3.5 text-espresso', col.className)}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {computedTotalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-champagne/60 bg-ivory/40 px-4 py-3 text-xs text-espresso/70">
          <span>
            Page <strong>{safePage}</strong> of <strong>{computedTotalPages}</strong>{' '}
            ({resolvedTotal} total)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handlePageSelect(safePage - 1)}
              disabled={safePage <= 1}
              className="inline-flex items-center gap-1 rounded-sm border border-champagne px-2.5 py-1.5 font-medium text-espresso transition-colors hover:bg-white disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Prev
            </button>
            <button
              type="button"
              onClick={() => handlePageSelect(safePage + 1)}
              disabled={safePage >= computedTotalPages}
              className="inline-flex items-center gap-1 rounded-sm border border-champagne px-2.5 py-1.5 font-medium text-espresso transition-colors hover:bg-white disabled:pointer-events-none disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;

