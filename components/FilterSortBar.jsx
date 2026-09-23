import { SORT_OPTIONS } from "@/lib/utils";

export default function FilterSortBar({
  categories,
  category,
  onCategoryChange,
  sortBy,
  order,
  onSortChange,
  categoryDisabled,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="flex items-center gap-2 text-sm text-ink/70">
        Category
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          disabled={categoryDisabled}
          title={
            categoryDisabled
              ? "Category filtering is off while you're searching (the API can't do both at once)"
              : undefined
          }
          className="rounded-md border border-line bg-white px-2 py-1.5 text-sm text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm text-ink/70">
        Sort by
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value, order)}
          className="rounded-md border border-line bg-white px-2 py-1.5 text-sm text-ink"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      {sortBy && (
        <button
          type="button"
          onClick={() => onSortChange(sortBy, order === "asc" ? "desc" : "asc")}
          className="rounded-md border border-line px-2 py-1.5 text-sm text-ink hover:bg-paper"
        >
          {order === "asc" ? "Ascending ↑" : "Descending ↓"}
        </button>
      )}
    </div>
  );
}
