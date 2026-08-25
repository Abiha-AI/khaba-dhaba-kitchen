import { createServerFn } from "@tanstack/react-start";
import type { RecipeOutput, RecipeRequest } from "@/types/recipe";

// Error codes the frontend maps to friendly messages.
export type RecipeErrorCode = "rate_limit" | "bad_shape" | "server" | "network";

export class RecipeError extends Error {
  code: RecipeErrorCode;
  constructor(code: RecipeErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

const SYSTEM_PROMPT =
  "You are a loving Pakistani home cook who has been cooking for 30 years. Given the user's ingredients, restrictions, meal type, time, and servings, suggest ONE authentic Pakistani recipe. Prioritize desi ingredients and cooking methods. You must ONLY return valid JSON matching the schema. Do not use markdown code blocks. If ingredients are insufficient, suggest desi substitutions (e.g., if no ghee, use oil; if no chicken, use lentils). Keep the tone warm, encouraging, and slightly motherly.";

// Mirrors RecipeOutput in src/types/recipe.ts.
const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    recipe_name: { type: "string" },
    description: { type: "string" },
    prep_time: { type: "string" },
    difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
    servings: { type: "integer" },
    ingredients_used: { type: "array", items: { type: "string" } },
    missing_ingredients: { type: "array", items: { type: "string" } },
    steps: { type: "array", items: { type: "string" } },
    nutrition_estimate: {
      type: "object",
      properties: {
        calories_per_serving: { type: "string" },
        protein: { type: "string" },
        carbs: { type: "string" },
        fats: { type: "string" },
      },
      required: ["calories_per_serving", "protein", "carbs", "fats"],
    },
    chef_tip: { type: "string" },
    serving_suggestion: { type: "string" },
  },
  required: [
    "recipe_name",
    "description",
    "prep_time",
    "difficulty",
    "servings",
    "ingredients_used",
    "missing_ingredients",
    "steps",
    "nutrition_estimate",
    "chef_tip",
    "serving_suggestion",
  ],
} as const;

// Runtime shape validation — never pass malformed model output to the UI.
function isRecipeOutput(value: unknown): value is RecipeOutput {
  if (typeof value !== "object" || value === null) return false;
  const r = value as Record<string, unknown>;
  const strings = ["recipe_name", "description", "prep_time", "chef_tip", "serving_suggestion"];
  if (!strings.every((k) => typeof r[k] === "string" && (r[k] as string).length > 0)) return false;
  if (!["Easy", "Medium", "Hard"].includes(r["difficulty"] as string)) return false;
  if (typeof r["servings"] !== "number") return false;
  const arrays = ["ingredients_used", "missing_ingredients", "steps"];
  if (
    !arrays.every(
      (k) => Array.isArray(r[k]) && (r[k] as unknown[]).every((i) => typeof i === "string"),
    )
  )
    return false;
  if (!Array.isArray(r["steps"]) || (r["steps"] as unknown[]).length === 0) return false;
  const n = r["nutrition_estimate"];
  if (typeof n !== "object" || n === null) return false;
  const nn = n as Record<string, unknown>;
  return ["calories_per_serving", "protein", "carbs", "fats"].every(
    (k) => typeof nn[k] === "string",
  );
}

function validateRequest(input: RecipeRequest): RecipeRequest {
  if (!input?.ingredients?.trim()) throw new RecipeError("server", "Ingredients are required.");
  if (!(input.minutes > 0)) throw new RecipeError("server", "Time must be greater than zero.");
  return input;
}

export const generateRecipe = createServerFn({ method: "POST" })
  .inputValidator(validateRequest)
  .handler(async ({ data }): Promise<RecipeOutput> => {
    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey) throw new RecipeError("server", "The kitchen is missing its key.");

    const userPrompt = [
      `Ingredients available: ${data.ingredients}`,
      `Dietary restrictions: ${data.diets.join(", ") || "None"}`,
      `Meal type: ${data.mealType}`,
      `Time available: ${data.minutes} minutes`,
      `Servings: ${data.servings}`,
    ].join("\n");

    let response: Response;
    try {
      response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: RESPONSE_SCHEMA,
              temperature: 0.9,
            },
          }),
        },
      );
    } catch {
      throw new RecipeError("network", "Could not reach the kitchen.");
    }

    if (response.status === 429) {
      throw new RecipeError("rate_limit", "The chef is overwhelmed.");
    }
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      // Quota errors sometimes arrive as 400/403 with RESOURCE_EXHAUSTED.
      if (detail.includes("RESOURCE_EXHAUSTED") || detail.toLowerCase().includes("quota")) {
        throw new RecipeError("rate_limit", "The chef is overwhelmed.");
      }
      console.error("Gemini error", response.status, detail.slice(0, 500));
      throw new RecipeError("server", "The stove refused to cooperate.");
    }

    const payload = (await response.json().catch(() => null)) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    } | null;
    const text = payload?.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";

    let parsed: unknown;
    try {
      // Strip stray markdown fences defensively before parsing.
      parsed = JSON.parse(text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim());
    } catch {
      throw new RecipeError("bad_shape", "The recipe came out garbled.");
    }

    if (!isRecipeOutput(parsed)) {
      throw new RecipeError("bad_shape", "The recipe came out garbled.");
    }
    return parsed;
  });
