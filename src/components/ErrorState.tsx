// Error state with a retry affordance and a friendly, situation-specific message.
export function ErrorState({
  onRetry,
  message,
}: {
  onRetry: () => void;
  message?: string;
}) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
      <p className="font-heading text-xl text-heading">
        {message ?? "Oops, the stove got too hot. Try again?"}
      </p>
      <button
        onClick={onRetry}
        className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-card transition-colors hover:bg-primary-hover"
      >
        Try again
      </button>
    </div>
  );
}
