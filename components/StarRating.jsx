export default function StarRating({ value = 0 }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <span aria-hidden="true" className="text-accent">
        ★
      </span>
      <span className="text-ink/80">{value.toFixed(2)}</span>
    </span>
  );
}
