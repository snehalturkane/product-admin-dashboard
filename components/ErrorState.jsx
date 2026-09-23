export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-bad/30 bg-bad/5 py-16 text-center">
      <p className="font-medium text-bad">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90"
        >
          Retry
        </button>
      )}
    </div>
  );
}
