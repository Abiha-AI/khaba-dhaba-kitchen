// Loading state: animated karahi (pan) with rising steam.
export function LoadingState() {
  return (
    <div className="flex flex-col items-center gap-6 py-20">
      <div className="relative h-24 w-32">
        {/* steam */}
        <div className="absolute inset-x-0 top-0 flex justify-center gap-3">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-6 w-1.5 animate-steam rounded-full bg-accent/60"
              style={{ animationDelay: `${i * 0.35}s` }}
            />
          ))}
        </div>
        {/* karahi */}
        <div className="absolute bottom-2 left-1/2 h-12 w-24 -translate-x-1/2 animate-sizzle rounded-b-full border-4 border-primary bg-primary/15" />
        <div className="absolute bottom-7 left-0 h-1.5 w-6 rounded-full bg-primary" />
        <div className="absolute bottom-7 right-0 h-1.5 w-6 rounded-full bg-primary" />
      </div>
      <p className="font-heading text-xl text-heading">The chef is thinking...</p>
    </div>
  );
}
