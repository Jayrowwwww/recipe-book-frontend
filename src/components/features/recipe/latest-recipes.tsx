import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getPublicRecipesService, type Recipe } from "@/services/recipe-service";
import { Button } from "@/components/ui/button";
import { buttonClass } from "@/lib/button-class";
import { EmptyState } from "@/components/common/empty-state";
import { RecipeCardSkeleton } from "@/components/ui/skeleton";
import RecipeCard from "@/components/features/recipe/recipe-card";

// Public recipe grid for the landing page. Reads the guest endpoint
// (GET /recipes/v1/public-recipes) — no login, no cookies required.
export function LatestRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadRecipes() {
      setLoading(true);
      setError("");
      try {
        const result = await getPublicRecipesService();
        if (active) setRecipes(result);
      } catch {
        if (active) setError("Unable to load recipes right now.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadRecipes();
    return () => {
      active = false;
    };
  }, [attempt]);

  if (loading) {
    return (
      <div role="status" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <span className="sr-only">Loading recipes…</span>
        <RecipeCardSkeleton />
        <RecipeCardSkeleton />
        <RecipeCardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="flex flex-wrap items-center justify-between gap-3 border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700">
        <span>{error}</span>
        <Button variant="secondary" onClick={() => setAttempt((value) => value + 1)}>Try again</Button>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <EmptyState
        title="No recipes yet"
        message="Be the first to publish one — sign in, open My Recipes and add your favorite dish."
        action={<Link to="/auth/signup" className={buttonClass("primary")}>Create an account</Link>}
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} {...recipe} />
      ))}
    </div>
  );
}
