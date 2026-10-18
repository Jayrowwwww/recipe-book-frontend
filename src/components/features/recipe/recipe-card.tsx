import { Link } from "react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buttonClass } from "@/lib/button-class";
import { Tag } from "@/components/ui/tag";
import RecipeMeta from "@/components/common/recipe-meta";

type RecipeCardProps = {
  id: string;
  image: string;
  name: string;
  description?: string;
  cuisine: string;
  mealType: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  cookTimeMinutes: number;
  tags: string[];
  // Omitted on the public landing page, where visitors cannot delete anything.
  onDelete?: (id: string) => void;
};

// Recipe summary card. The "View" control is a styled Link (never a
// <button> inside an <a>), so the whole card stays keyboard-friendly.
export default function RecipeCard({ id, image, name, description, cuisine, mealType, difficulty, cookTimeMinutes, tags, onDelete }: RecipeCardProps) {
  return (
    <Card className="group flex h-full flex-col transition-shadow hover:shadow-md hover:shadow-ink-950/10">
      <Link to={`/recipes/${id}`} className="block h-56 overflow-hidden bg-paper-200">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink-950">{name}</h3>
          {description && <p className="mt-1 line-clamp-2 text-sm text-ink-950/65">{description}</p>}
        </div>

        <RecipeMeta
          cuisine={cuisine}
          mealType={mealType}
          difficulty={difficulty}
          cookTimeMinutes={cookTimeMinutes}
        />

        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        <div className="mt-auto flex gap-2 pt-2">
          <Link to={`/recipes/${id}`} className={buttonClass("primary", "flex-1")}>
            View
          </Link>
          {onDelete && (
            <Button variant="danger" className="flex-1" onClick={() => onDelete(id)}>
              Delete
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
