export const PAGE_SIZES = [10, 20, 50];
export const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "title", label: "Title" },
  { value: "price", label: "Price" },
  { value: "rating", label: "Rating" },
];

// Turns "?page=abc" or "?page=-3" into a safe positive integer, defaulting to 1.
export function parsePage(value) {
  const n = parseInt(value, 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return n;
}

// Only ever allow the three page sizes the UI offers.
export function parseLimit(value) {
  const n = parseInt(value, 10);
  return PAGE_SIZES.includes(n) ? n : 10;
}

export function parseOrder(value) {
  return value === "desc" ? "desc" : "asc";
}

// DummyJSON prices come in USD. We convert to INR at an approximate rate and
// format with Indian digit grouping (₹1,23,456 style) via Intl.
const USD_TO_INR_RATE = 83;

export function formatPrice(price) {
  if (typeof price !== "number") return "-";
  const inr = Math.round(price * USD_TO_INR_RATE);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(inr);
}

export function formatRange(page, limit, total) {
  if (total === 0) return "Showing 0 results";
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  return `Showing ${start}-${end} of ${total}`;
}