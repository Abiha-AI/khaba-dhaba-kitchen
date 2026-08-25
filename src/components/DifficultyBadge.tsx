import type { RecipeOutput } from "@/types/recipe";

// Difficulty maps to its own semantic token: saffron / tandoori / maroon.
const styles: Record<RecipeOutput["difficulty"], string> = {
  Easy: "bg-saffron text-card",
  Medium: "bg-primary text-card",
  Hard: "bg-maroon text-card",
};

export function DifficultyBadge({ difficulty }: { difficulty: RecipeOutput["difficulty"] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${styles[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}
