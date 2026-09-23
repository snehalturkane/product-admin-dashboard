import { PAGE_SIZES, formatRange } from "@/lib/utils";

// Builds a compact list of page numbers with "..." gaps, e.g.
// [1, "...", 4, 5, 6, "...", 20]
function buildPageList(current, total) {
  const pages = [];
  const windowSize = 1;
  for (let p = 1; p <= total; p++) {
    const isEdge = p === 1 || p === total;
    const isNearCurrent = Math.abs(p - current) <= windowSize;
    if (isEdge || isNearCurrent) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }
  return pages;
}

export default function Pagination({ page, limit, total, onPageChange, onLimitChange }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const pages = buildPageList(page, totalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-line pt-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-ink/70">{formatRange(page, limit, total)}</p>

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-ink/70">
          Rows per page
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="rounded-md border border-line bg-white px-2 py-1 text-sm text-ink"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <nav className="flex items-center gap-1" aria-label="Pagination">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="rounded-md border border-line px-2 py-1 text-sm disabled:opacity-40"
          >
            Previous
          </button>

          {pages.map((p, idx) =>
            p === "..." ? (
              <span key={`gap-${idx}`} className="px-1 text-sm text-ink/40">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={p === page ? "page" : undefined}
                className={`min-w-[2rem] rounded-md border px-2 py-1 text-sm ${
                  p === page
                    ? "border-accent bg-accent text-white"
                    : "border-line text-ink hover:bg-paper"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="rounded-md border border-line px-2 py-1 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}
