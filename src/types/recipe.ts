// Shape the real API will return later. UI is built against this today.
export interface RecipeOutput {
  recipe_name: string;
  description: string; // 1-2 warm sentences
  prep_time: string; // e.g. "45 minutes"
  difficulty: "Easy" | "Medium" | "Hard";
  servings: number;
  ingredients_used: string[];
  missing_ingredients: string[];
  steps: string[];
  nutrition_estimate: {
    calories_per_serving: string;
    protein: string;
    carbs: string;
    fats: string;
  };
  chef_tip: string;
  serving_suggestion: string;
}

export type Diet =
  | "Vegetarian"
  | "Vegan"
  | "Gluten-Free"
  | "Dairy-Free"
  | "Keto"
  | "Ramadan-Friendly"
  | "None";

export type MealType =
  | "Breakfast"
  | "Lunch"
  | "Dinner"
  | "Snack"
  | "Dessert"
  | "Iftar Special";

export interface RecipeRequest {
  ingredients: string;
  diets: Diet[];
  mealType: MealType;
  minutes: number;
  servings: number;
}
