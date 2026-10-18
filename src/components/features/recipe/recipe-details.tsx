import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/components/context/use-auth";
import {
  deleteRecipeService,
  getPublicRecipeService,
  getRecipeService,
  type Recipe,
} from "@/services/recipe-service";

import RecipeMeta from "@/components/common/recipe-meta";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import RecipeForm from "@/components/features/recipe/recipe-form";

export function RecipeDetails({ id }: { id: string }) {
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  // Only the owner (matched by the authenticated endpoint) sees the controls.
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  const [open, setOpen] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!ready) return;

    let active = true;
    async function loadRecipe() {
      setLoading(true);
      setNotFound(false);
      setError("");

      // Signed-in users first ask the owner endpoint: a hit means this
      // recipe belongs to them and full edit/delete controls are allowed.
      if (user) {
        try {
          const owned = await getRecipeService(id);
          if (!active) return;
          setRecipe(owned);
          setIsOwner(true);
          setLoading(false);
          return;
        } catch {
          // Not theirs (or missing) — fall through to the public endpoint.
        }
      }

      // Everyone else reads the public, owner-free copy of the recipe.
      try {
        const shared = await getPublicRecipeService(id);
        if (!active) return;
        setRecipe(shared);
        setIsOwner(false);
      } catch (err) {
        if (!active) return;
        const status = (err as { response?: { status?: number } }).response?.status;
        if (status === 404 || status === 400) {
          setNotFound(true);
        } else {
          setError("Unable to load this recipe. Check your connection and try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadRecipe();

    function cleanup() {
      active = false;
    }

    return cleanup;
  }, [id, ready, user, attempt]);

  function openForm() {
    setOpen(true);
  }

  function closeForm() {
    setOpen(false);
  }

  function handleUpdated(updatedRecipe: Recipe) {
    setRecipe(updatedRecipe);
    closeForm();
  }

  async function confirmDelete() {
    if (!recipe || deleting) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteRecipeService(recipe.id);
      navigate("/user");
    } catch {
      setDeleteError("Unable to delete this recipe. Please try again.");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div role="status" className="mt-6 overflow-hidden border border-ink-900/10 bg-white shadow-sm">
        <span className="sr-only">Loading recipe…</span>
        <Skeleton className="h-64 sm:h-[440px]" />
        <div className="space-y-4 p-6 sm:p-10">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mt-6">
        <EmptyState
          title="Recipe not found"
          message="This recipe does not exist, or it is only visible to its owner."
          action={<Button variant="secondary" onClick={() => navigate(-1)}>Go back</Button>}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700">
        <span>{error}</span>
        <Button variant="secondary" onClick={() => setAttempt((value) => value + 1)}>Try again</Button>
      </div>
    );
  }

  if (!recipe) return null;

  // Keep recipe content and its action dialogs together in this feature.
  return (
    <>
      {/* Image, metadata, and cooking steps grouped in one detail card. */}
      <Card className="mt-6 shadow-lg shadow-ink-950/5">
        <div className="bg-paper-200">
          <img className="h-64 w-full object-cover sm:h-[440px]" src={recipe.image} alt={recipe.name} />
        </div>
        <div className="space-y-8 p-6 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">{recipe.name}</h1>
              {recipe.description && <p className="mt-3 text-base leading-7 text-ink-950/75">{recipe.description}</p>}
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <Button onClick={openForm}>Update</Button>
                <Button variant="danger" onClick={() => { setDeleteError(""); setConfirmingDelete(true); }}>
                  Delete
                </Button>
              </div>
            )}
          </div>

          <RecipeMeta cuisine={recipe.cuisine} mealType={recipe.mealType} difficulty={recipe.difficulty} cookTimeMinutes={recipe.cookTimeMinutes} />

          <div className="flex flex-wrap gap-2">{recipe.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>

          <div>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink-950">Ingredients</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-ink-950/75">
              {recipe.ingredients.map((ingredient, index) => <li key={`${ingredient}-${index}`}>{ingredient}</li>)}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink-950">Instructions</h2>
            <ol className="list-decimal space-y-3 pl-5 text-sm leading-7 text-ink-950/75">
              {recipe.instructions.map((instruction, index) => <li key={`${instruction}-${index}`}>{instruction}</li>)}
            </ol>
          </div>

          {!isOwner && !user && (
            <div className="border-l-4 border-ember-500 bg-paper-100 p-5 text-sm text-ink-950/75">
              Ready to share a recipe of your own?{" "}
              <Link to="/auth/signup" className="font-medium text-brand-600 underline underline-offset-2">Create an account</Link>{" "}
              to publish and manage your favorites.
            </div>
          )}
        </div>
      </Card>

      {/* The modal reuses the recipe form and updates this page after saving. */}
      <Modal open={open} onClose={closeForm} title="Update Recipe">
        <RecipeForm recipe={recipe} onSuccess={handleUpdated} />
      </Modal>

      {/* Confirmation dialog for a destructive action. */}
      <Modal open={confirmingDelete} onClose={() => setConfirmingDelete(false)} title="Delete recipe">
        <p className="text-sm text-ink-950/80">
          Delete <span className="font-semibold text-ink-950">“{recipe.name}”</span>? This action cannot be undone.
        </p>
        {deleteError && <p role="alert" className="mt-3 text-sm text-brand-700">{deleteError}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setConfirmingDelete(false)} disabled={deleting}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
