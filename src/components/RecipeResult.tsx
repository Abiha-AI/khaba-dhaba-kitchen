import { useState } from "react";
import type { RecipeOutput } from "@/types/recipe";
import { DifficultyBadge } from "./DifficultyBadge";

// Formats the recipe as clean plain text for the clipboard.
function formatRecipe(r: RecipeOutput): string {
  return [
    r.recipe_name,
    "",
    r.description,
    "",
    `Prep time: ${r.prep_time} | Difficulty: ${r.difficulty} | Serves: ${r.servings}`,
    "",
    "WHAT YOU HAVE",
    ...r.ingredients_used.map((i) => `- ${i}`),
    "",
    "WHAT YOU'LL NEED",
    ...r.missing_ingredients.map((i) => `- ${i}`),
    "",
    "HOW TO COOK",
    ...r.steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    "NUTRITION (per serving)",
    `Calories: ${r.nutrition_estimate.calories_per_serving}`,
    `Protein: ${r.nutrition_estimate.protein}`,
    `Carbs: ${r.nutrition_estimate.carbs}`,
    `Fats: ${r.nutrition_estimate.fats}`,
    "",
    `CHEF'S SECRET: ${r.chef_tip}`,
    `SERVE WITH: ${r.serving_suggestion}`,
  ].join("\n");
}

export function RecipeResult({
  recipe,
  onStartOver,
}: {
  recipe: RecipeOutput;
  onStartOver: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatRecipe(recipe));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.6fr_1fr]">
      {/* Main recipe card */}
      <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-warm">
        {/* Truck-art inspired border pattern (CSS only) */}
        <div className="truck-art h-3 w-full" />

        <div className="space-y-8 p-6 sm:p-8">
          <header className="space-y-3">
            <h1 className="font-heading text-3xl font-bold leading-tight text-heading sm:text-4xl">
              {recipe.recipe_name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-body">
              <DifficultyBadge difficulty={recipe.difficulty} />
              <span>{recipe.prep_time}</span>
              <span className="text-border">•</span>
              <span>Serves {recipe.servings}</span>
            </div>
            <p className="text-body">{recipe.description}</p>
          </header>

          {/* Two-column ingredient split */}
          <div className="grid gap-6 sm:grid-cols-2">
            <section>
              <h2 className="mb-3 font-heading text-lg font-semibold text-heading">
                What You Have
              </h2>
              <ul className="space-y-2 text-sm text-body">
                {recipe.ingredients_used.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-accent">◆</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="mb-3 font-heading text-lg font-semibold text-heading">
                What You'll Need
              </h2>
              <ul className="space-y-2 text-sm text-rust">
                {recipe.missing_ingredients.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span>+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Numbered steps on a vertical timeline */}
          <section>
            <h2 className="mb-4 font-heading text-lg font-semibold text-heading">How to Cook</h2>
            <ol className="space-y-6">
              {recipe.steps.map((step, i) => (
                <li key={i} className="relative flex gap-4 pb-1">
                  {i !== recipe.steps.length - 1 && (
                    <span className="absolute left-4 top-9 h-full w-0.5 bg-primary/40" />
                  )}
                  <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-card">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-sm leading-relaxed text-body">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <div className="flex flex-wrap gap-3 border-t border-border pt-6">
            <button
              onClick={handleCopy}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-card transition-colors hover:bg-primary-hover"
            >
              {copied ? "Copied!" : "Copy Recipe"}
            </button>
            <button
              onClick={onStartOver}
              className="rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-heading transition-colors hover:border-primary"
            >
              Start Over
            </button>
          </div>
        </div>
      </article>

      {/* Side panel */}
      <aside className="space-y-6">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-warm">
          <h2 className="mb-4 font-heading text-lg font-semibold text-heading">Nutrition</h2>
          <dl className="space-y-3 text-sm">
            {[
              ["Calories / serving", recipe.nutrition_estimate.calories_per_serving],
              ["Protein", recipe.nutrition_estimate.protein],
              ["Carbs", recipe.nutrition_estimate.carbs],
              ["Fats", recipe.nutrition_estimate.fats],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 border-b border-border pb-2 last:border-0">
                <dt className="text-body">{k}</dt>
                <dd className="font-semibold text-heading">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <blockquote className="rounded-3xl border-l-4 border-saffron bg-saffron/15 p-6">
          <h2 className="mb-2 font-heading text-lg font-semibold text-heading">Chef's Secret</h2>
          <p className="text-sm italic leading-relaxed text-body">{recipe.chef_tip}</p>
        </blockquote>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-warm">
          <h2 className="mb-2 font-heading text-lg font-semibold text-heading">Serve With</h2>
          <p className="text-sm leading-relaxed text-body">{recipe.serving_suggestion}</p>
        </div>
      </aside>
    </div>
  );
}
