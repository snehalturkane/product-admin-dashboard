export default function EmptyState({
  title = "Nothing here yet",
  message = "Try changing your search or filters.",
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line bg-white py-16 text-center">
      <p className="font-medium text-ink">{title}</p>
      <p className="text-sm text-ink/60">{message}</p>
    </div>
  );
}
