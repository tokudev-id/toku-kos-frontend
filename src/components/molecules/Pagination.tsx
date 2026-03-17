import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, total, limit, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  // if (total <= limit) return null;

  return (
    <div className="card p-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <p className="text-sm text-text-secondary">
        Menampilkan <span className="font-semibold text-text-primary">{start}</span>–<span className="font-semibold text-text-primary">{end}</span> dari <span className="font-semibold text-text-primary">{total}</span> hasil
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="btn-secondary px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-medium min-w-16 text-center">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="btn-secondary px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
