import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import type { RecipeOutput, RecipeRequest } from "@/types/recipe";
import { generateRecipe, type RecipeErrorCode } from "@/lib/recipe.functions";
import { RecipeForm } from "./RecipeForm";
import { RecipeResult } from "./RecipeResult";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";

type View = "form" | "loading" | "result" | "error";

// Friendly, in-character messages per failure mode.
const ERROR_MESSAGES: Record<RecipeErrorCode, string> = {
  rate_limit: "The chef is a bit overwhelmed right now, try again in a moment",
  bad_shape: "The recipe came out a bit garbled. Let's try that again?",
  network: "Couldn't reach the kitchen — check your connection and try again.",
  server: "Oops, the stove got too hot. Try again?",
};

export function App() {
  const [view, setView] = useState<View>("form");
  const [recipe, setRecipe] = useState<RecipeOutput | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const askTheChef = useServerFn(generateRecipe);

  // Real call to the secure server function that talks to Gemini.
  const handleSubmit = async (req: RecipeRequest) => {
    setView("loading");
    try {
      const result = await askTheChef({ data: req });
      if (result.ok) {
        setRecipe(result.recipe);
        setView("result");
      } else {
        setErrorMessage(ERROR_MESSAGES[result.code]);
        setView("error");
      }
    } catch {
      setErrorMessage(ERROR_MESSAGES.network);
      setView("error");
    }
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
