import { useState } from "react";
import type { Diet, MealType, RecipeRequest } from "@/types/recipe";

const DIETS: Diet[] = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Ramadan-Friendly",
  "None",
];

const MEALS: MealType[] = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Dessert",
  "Iftar Special",
];

export function RecipeForm({ onSubmit }: { onSubmit: (req: RecipeRequest) => void }) {
  const [ingredients, setIngredients] = useState("");
  const [diets, setDiets] = useState<Diet[]>(["None"]);
  const [mealType, setMealType] = useState<MealType>("Dinner");
  const [minutes, setMinutes] = useState(45);
  const [servings, setServings] = useState(4);
  const [error, setError] = useState<string | null>(null);

  // "None" is exclusive with the other chips.
  const toggleDiet = (d: Diet) => {
    setDiets((prev) => {
      if (d === "None") return ["None"];
      const next = prev.filter((x) => x !== "None");
      return next.includes(d) ? next.filter((x) => x !== d) : [...next, d];
    });
  };

  // Frontend validation: ingredients required, time must be > 0.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) {
      setError("Tell me what's in your fridge and I'll work some magic.");
      return;
    }
    if (minutes <= 0) {
      setError("Give the chef at least a few minutes.");
      return;
    }
    setError(null);
    onSubmit({ ingredients: ingredients.trim(), diets, mealType, minutes, servings });
  };

  const field = "w-full rounded-xl border border-border bg-card px-4 py-3 text-body outline-none transition focus:border-primary";
  const label = "mb-2 block font-heading text-sm font-semibold text-heading";

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-2xl space-y-6 rounded-3xl border border-border bg-card p-6 shadow-warm sm:p-8"
    >
      <div>
        <label className={label} htmlFor="ingredients">
          What's in your Kitchen?
        </label>
        <textarea
          id="ingredients"
          rows={3}
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="eggs, tomatoes, onions, green chilies, yogurt, chicken..."
          className={`${field} resize-none placeholder:text-body/45`}
        />
      </div>

      <div>
        <span className={label}>Dietary Restrictions</span>
        <div className="flex flex-wrap gap-2">
          {DIETS.map((d) => {
            const active = diets.includes(d);
            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleDiet(d)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-primary bg-primary text-card"
                    : "border-border bg-background text-body hover:border-primary"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="meal">
            Meal Type
          </label>
          <select
            id="meal"
            value={mealType}
            onChange={(e) => setMealType(e.target.value as MealType)}
            className={field}
          >
            {MEALS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="servings">
            Servings
          </label>
          <input
            id="servings"
            type="number"
            min={1}
            max={20}
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
            className={field}
          />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="time">
          Time available — <span className="text-primary">{minutes} min</span>
        </label>
        <input
          id="time"
          type="range"
          min={10}
          max={120}
          step={5}
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
        />
        <div className="mt-1 flex justify-between text-xs text-body/70">
          <span>10 min</span>
          <span>120 min</span>
        </div>
      </div>

      {error && <p className="text-sm font-medium text-rust">{error}</p>}

      <button
        type="submit"
        className="w-full rounded-full bg-primary px-6 py-3.5 font-heading text-lg font-semibold text-card transition-colors hover:bg-primary-hover"
      >
        Cook It Up
      </button>
    </form>
  );
}
