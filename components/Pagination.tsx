export default function Pagination({
  page,
  totalPages,
  onChange
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="text-xs uppercase tracking-widest2 text-stone hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-4 py-2 rounded-full border border-black/10 hover:border-gold/60"
      >
        ‹ Prev
      </button>

      <span className="text-xs text-stone">
        Page {page} of {totalPages}
      </span>

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="text-xs uppercase tracking-widest2 text-stone hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-4 py-2 rounded-full border border-black/10 hover:border-gold/60"
      >
        Next ›
      </button>
    </div>
  );
}
