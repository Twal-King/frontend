import { cn } from '../../../utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(
          'px-3 py-1.5 text-sm rounded-xl transition-colors',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'text-secondary hover:text-primary hover:bg-hover'
        )}
        aria-label="Previous page"
      >
        ◀
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            'min-w-[36px] px-2 py-1.5 text-sm rounded-xl transition-colors',
            page === currentPage
              ? 'bg-accent text-white'
              : 'text-secondary hover:text-primary hover:bg-hover'
          )}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(
          'px-3 py-1.5 text-sm rounded-xl transition-colors',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'text-secondary hover:text-primary hover:bg-hover'
        )}
        aria-label="Next page"
      >
        ▶
      </button>
    </nav>
  );
}
