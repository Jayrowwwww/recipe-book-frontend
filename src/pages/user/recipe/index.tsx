import { Link, useParams } from "react-router";
import { Section } from "@/components/ui/section";
import { RecipeDetails } from "@/components/features/recipe/recipe-details";

export default function RecipePage() {
  const { id } = useParams();

  // The page reads the URL; the feature fetches and displays that recipe.
  // Works for guests (public endpoint) and for the owner (edit/delete).
  return (
    <Section>
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-ink-950/60">
        <Link to="/" className="font-medium text-brand-600 hover:text-brand-700">Home</Link>
        <span aria-hidden>/</span>
        <span>Recipe</span>
      </nav>

      {id && <RecipeDetails key={id} id={id} />}
    </Section>
  );
}
