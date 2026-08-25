import { useState } from "react";
import type { RecipeOutput, RecipeRequest } from "@/types/recipe";
import { RecipeForm } from "./RecipeForm";
import { RecipeResult } from "./RecipeResult";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";

// Mock data stands in for the future API response (same RecipeOutput shape).
const MOCK_RECIPE: RecipeOutput = {
  recipe_name: "Dhaba-Style Chicken Karahi",
  description:
    "A bubbling karahi built on tomatoes, ginger and green chilies, finished the way roadside dhabas do it. Smoky, tangy and unapologetically bold.",
  prep_time: "45 minutes",
  difficulty: "Medium",
  servings: 4,
  ingredients_used: [
    "Chicken (bone-in, 1 kg)",
    "Tomatoes (4, roughly chopped)",
    "Onions (2, sliced)",
    "Green chilies (5, slit)",
    "Yogurt (1/2 cup)",
    "Garlic and ginger paste",
  ],
  missing_ingredients: [
    "Coriander seeds (crushed)",
    "Kasuri methi",
    "Fresh coriander for garnish",
    "Julienned ginger",
  ],
  steps: [
    "Heat oil in a karahi or heavy wok until shimmering, then sear the chicken on high heat until golden on all sides.",
    "Add garlic and ginger paste and fry for a minute until the raw smell disappears.",
    "Tip in the tomatoes with a pinch of salt, cover, and let them collapse into a thick masala for 10 minutes.",
    "Whisk the yogurt smooth and stir it in slowly on low heat so it doesn't split.",
    "Add crushed coriander seeds, red chili and slit green chilies. Bhunno on high heat until the oil separates.",
    "Crush kasuri methi between your palms over the karahi, scatter julienned ginger and coriander, and rest for 5 minutes before serving.",
  ],
  nutrition_estimate: {
    calories_per_serving: "520 kcal",
    protein: "42 g",
    carbs: "12 g",
    fats: "34 g",
  },
  chef_tip:
    "Never rush the bhunnai. When the oil pools at the edges of the karahi, that's the moment the masala is ready — not a minute before.",
  serving_suggestion:
    "Hot tandoori naan or roghni roti, a sharp onion-lemon salad, and a glass of salted lassi on the side.",
};

type View = "form" | "loading" | "result" | "error";

export function App() {
  const [view, setView] = useState<View>("form");
  const [recipe, setRecipe] = useState<RecipeOutput | null>(null);

  // Simulates the future API call so the loading state is visible.
  const handleSubmit = (req: RecipeRequest) => {
    setView("loading");
    setTimeout(() => {
      setRecipe({ ...MOCK_RECIPE, servings: req.servings });
      setView("result");
    }, 1600);
  };

  return (
    <main className="min-h-screen bg-background px-4 py-12 sm:py-16">
      {/* Hero */}
      {view !== "result" && (
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="font-heading text-5xl font-bold tracking-tight text-heading sm:text-6xl">
            Khaba Dhaba
          </h1>
          <div className="truck-art mx-auto mt-4 h-3 w-40 rounded-full" />
          <p className="mt-4 font-heading text-xl italic text-primary">Your personal dhaba chef.</p>
          <p className="mt-3 text-sm text-body">
            Tell me what's in your fridge and I'll work some magic.
          </p>
        </header>
      )}

      {view === "form" && <RecipeForm onSubmit={handleSubmit} />}
      {view === "loading" && <LoadingState />}
      {view === "error" && <ErrorState onRetry={() => setView("form")} />}
      {view === "result" && recipe && (
        <RecipeResult recipe={recipe} onStartOver={() => setView("form")} />
      )}
    </main>
  );
}
