# Khaba Dhaba — Your Personal Dhaba Chef

Khaba Dhaba is a Pakistani recipe assistant. Tell it what's in your fridge, pick your
dietary restrictions, meal type, time and servings, and a warm desi recipe comes back:
ingredients you have, what you still need, step-by-step method, nutrition estimate,
a chef's secret and a serving suggestion.

## Tech stack

- TanStack Start (React 19, file-based routing, SSR)
- TypeScript
- Tailwind CSS v4
- Vite 7
- Google Gemini (`gemini-3.6-flash`) called from a secure server function

## How it works

The recipe generation runs entirely server-side in `src/lib/recipe.functions.ts`
(`generateRecipe`). It builds the system prompt, calls Gemini with
`responseMimeType: "application/json"` plus a response schema matching
`RecipeOutput` in `src/types/recipe.ts`, then validates the parsed shape before
returning it. Malformed output, rate limits and network failures are turned into
distinct error codes the UI maps to friendly messages.

## Run locally

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

The app runs on http://localhost:8080.

## Environment variables

Copy `.env.example` to `.env` and fill in:

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Backend project URL |
| `SUPABASE_ANON_KEY` | Public (publishable) backend key |

## Gemini API key

`GEMINI_API_KEY` must **never** live in `.env`, in the frontend, or in the repo.
Add it via **Lovable Cloud (Supabase) → Secrets**. It is injected as a server-side
environment variable and is read only inside the `generateRecipe` server handler.
