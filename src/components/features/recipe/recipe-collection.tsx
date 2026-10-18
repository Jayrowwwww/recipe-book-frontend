import { useEffect, useState } from "react";
import { useAuth } from "@/components/context/use-auth";
import { deleteRecipeService, getRecipesService, type Recipe } from "@/services/recipe-service";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { RecipeCardSkeleton } from "@/components/ui/skeleton";
import RecipeCard from "@/components/features/recipe/recipe-card";
import RecipeForm from "@/components/features/recipe/recipe-form";
import { Navigate } from "react-router";

export function RecipeCollection() {
  const { user, ready } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  // Deletion asks for confirmation in a styled dialog instead of window.confirm.
  const [pendingDelete, setPendingDelete] = useState<Recipe | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(function fetchRecipes() {
    if (!ready || !user) {
      return;
    }

    let active = true;

    async function loadRecipes() {
      setLoading(true);
      try {
        const result = await getRecipesService();
        if (active) {
          setRecipes(result);
          setError("");
        }
      } catch {
        if (active) {
          setError("Unable to load recipes. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRecipes();

    // Ignore a response if the account changes or this feature is removed.
    function cleanup() {
      active = false;
    }

    return cleanup;
  }, [ready, user, attempt]);

  if (!ready) return null;

  if (!user) return <Navigate to="/auth/login" replace />;

  function openForm() {
    setOpen(true);
  }

  function closeForm() {
    setOpen(false);
  }

  function handleCreated(newRecipe: Recipe) {
    setRecipes(function addRecipe(currentRecipes) {
      return [newRecipe, ...currentRecipes];
    });
    closeForm();
  }

  // Card's Delete button only names the target; this dialog confirms it.
  function requestDelete(id: string) {
    const target = recipes.find((recipe) => recipe.id === id) ?? null;
    setDeleteError("");
    setPendingDelete(target);
  }

  function cancelDelete() {
    setPendingDelete(null);
    setDeleteError("");
  }

  async function confirmDelete() {
    if (!pendingDelete || deleting) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteRecipeService(pendingDelete.id);
      setRecipes((current) => current.filter((recipe) => recipe.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch {
      setDeleteError("Unable to delete this recipe. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  // The page supplies the header; this feature owns the collection and its dialogs.
  return (
    <>
      {/* Collection heading and primary action wrap on narrow screens. */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950">Your recipes</h2>
          <p className="mt-1 text-sm text-ink-950/60">
            {recipes.length} saved {recipes.length === 1 ? "recipe" : "recipes"} to inspire your next meal
          </p>
        </div>
        <Button onClick={openForm}>Add Recipe</Button>
      </div>

      {error && (
        <div role="alert" className="mb-4 flex flex-wrap items-center justify-between gap-3 border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700">
          <span>{error}</span>
          <Button variant="secondary" onClick={() => setAttempt((value) => value + 1)}>Try again</Button>
        </div>
      )}

      {loading ? (
        <div role="status" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <span className="sr-only">Loading your recipes…</span>
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
        </div>
      ) : !error && recipes.length === 0 ? (
        <EmptyState
          title="A fresh page for your favorites"
          message="Save a family classic or something new you want to try."
          action={<Button onClick={openForm}>Add your first recipe</Button>}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} onDelete={requestDelete} />
          ))}
        </div>
      )}

      {/* Add the saved recipe to local state so the list updates immediately. */}
      <Modal open={open} onClose={closeForm} title="Add Recipe">
        <RecipeForm onSuccess={handleCreated} />
      </Modal>

      {/* Confirmation dialog for a destructive action. */}
      <Modal open={pendingDelete !== null} onClose={cancelDelete} title="Delete recipe">
        <p className="text-sm text-ink-950/80">
          Delete <span className="font-semibold text-ink-950">“{pendingDelete?.name}”</span> from your collection?
          This action cannot be undone.
        </p>
        {deleteError && <p role="alert" className="mt-3 text-sm text-brand-700">{deleteError}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={cancelDelete} disabled={deleting}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
