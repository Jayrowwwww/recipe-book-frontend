import { useState, type SubmitEvent } from "react";
import { createRecipeService, updateRecipeService, type Recipe, type RecipeInput } from "@/services/recipe-service";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

type RecipeFormProps = {
  // No recipe = create mode. Passing a recipe = edit mode.
  recipe?: Recipe;
  onSuccess: (recipe: Recipe) => void;
};

type FormErrors = {
  name?: string;
  description?: string;
  image?: string;
  cuisine?: string;
  cookTimeMinutes?: string;
  mealType?: string;
  tags?: string;
  ingredients?: string;
  instructions?: string;
};

const messages: FormErrors = {
  name: "Name is required",
  description: "Keep the description under 500 characters",
  image: "Image URL is required",
  cuisine: "Cuisine is required",
  cookTimeMinutes: "Cook time is required",
  mealType: "Meal type is required (one item per line)",
  tags: "Tags are required (one item per line)",
  ingredients: "Ingredients are required (one per line)",
  instructions: "Instructions are required (one per line)",
};

// Shared form for adding and editing a recipe. Both flows call the same
// endpoints with the same payload shape, so one component keeps the
// validation and field layout identical everywhere.
export default function RecipeForm({ recipe, onSuccess }: RecipeFormProps) {
  const editing = Boolean(recipe);

  const [name, setName] = useState(recipe?.name ?? "");
  const [description, setDescription] = useState(recipe?.description ?? "");
  const [image, setImage] = useState(recipe?.image ?? "");
  const [cuisine, setCuisine] = useState(recipe?.cuisine ?? "");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(recipe?.difficulty ?? "Easy");
  const [cookTimeMinutes, setCookTimeMinutes] = useState(recipe ? String(recipe.cookTimeMinutes) : "");
  const [mealType, setMealType] = useState(recipe?.mealType.join("\n") ?? "");
  const [tags, setTags] = useState(recipe?.tags.join("\n") ?? "");
  const [ingredients, setIngredients] = useState(recipe?.ingredients.join("\n") ?? "");
  const [instructions, setInstructions] = useState(recipe?.instructions.join("\n") ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [busy, setBusy] = useState(false);

  // Show an error if empty; clear it once the field has a value.
  const checkField = (field: keyof FormErrors, value: string) => {
    setErrors((current) => ({
      ...current,
      [field]: value.trim() === "" ? messages[field] : undefined,
    }));
  };

  const lines = (value: string) => value.split("\n").filter((item) => item.trim() !== "");

  const handleSave = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return; // block double submits while a request is in flight
    setSubmitError("");

    const newErrors: FormErrors = {};
    const required = { name, image, cuisine, cookTimeMinutes, mealType, tags, ingredients, instructions };
    for (const [field, value] of Object.entries(required)) {
      if (value.trim() === "") {
        newErrors[field as keyof FormErrors] = messages[field as keyof FormErrors];
      }
    }
    if (description.trim().length > 500) {
      newErrors.description = messages.description;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload: RecipeInput = {
      name: name.trim(),
      description: description.trim() === "" ? undefined : description.trim(),
      image: image.trim(),
      cuisine: cuisine.trim(),
      difficulty,
      cookTimeMinutes: Number(cookTimeMinutes),
      mealType: lines(mealType),
      tags: lines(tags),
      ingredients: lines(ingredients),
      instructions: lines(instructions),
    };

    setBusy(true);
    try {
      const saved = recipe
        ? await updateRecipeService(recipe.id, payload)
        : await createRecipeService(payload);
      onSuccess(saved);
    } catch (error) {
      setSubmitError(typeof error === "object" && error !== null && "response" in error
        ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message
            || (editing ? "Unable to update recipe." : "Unable to create recipe."))
        : "Unable to connect to the API.");
    } finally {
      setBusy(false);
    }
  };

  // One column on phones, two on larger screens; separate row and column gaps.
  return (
    <form onSubmit={handleSave} className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Label htmlFor="recipe-name" error={errors.name}>Name</Label>
        <Input id="recipe-name" type="text" value={name} onChange={(e) => { setName(e.target.value); checkField("name", e.target.value); }} onBlur={() => checkField("name", name)} error={errors.name} />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="recipe-description" error={errors.description}>Description (optional)</Label>
        <Textarea
          id="recipe-description" value={description} rows={2}
          onChange={(e) => { setDescription(e.target.value); checkField("description", e.target.value); }}
          onBlur={() => checkField("description", description)}
          placeholder="A short summary of the dish" error={errors.description} />
        <p className="mt-1 text-xs text-ink-950/50">{description.length}/500</p>
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="recipe-image" error={errors.image}>Image URL</Label>
        <Input id="recipe-image" type="url" value={image} onChange={(e) => { setImage(e.target.value); checkField("image", e.target.value); }} onBlur={() => checkField("image", image)} placeholder="https://example.com/image.jpg" error={errors.image} />
        {image.trim() !== "" && (
          <img src={image} alt="" className="mt-2 h-24 w-full max-w-xs border border-ink-900/10 object-cover" />
        )}
      </div>

      <div>
        <Label htmlFor="recipe-cuisine" error={errors.cuisine}>Cuisine</Label>
        <Input id="recipe-cuisine" type="text" value={cuisine} onChange={(e) => { setCuisine(e.target.value); checkField("cuisine", e.target.value); }} onBlur={() => checkField("cuisine", cuisine)} error={errors.cuisine} />
      </div>

      <div>
        <Label htmlFor="recipe-difficulty">Difficulty</Label>
        <Select id="recipe-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value as "Easy" | "Medium" | "Hard")}>
          <option>Easy</option><option>Medium</option><option>Hard</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="recipe-cook-time" error={errors.cookTimeMinutes}>Cook Time (minutes)</Label>
        <Input id="recipe-cook-time" type="number" min="0" value={cookTimeMinutes} onChange={(e) => { setCookTimeMinutes(e.target.value); checkField("cookTimeMinutes", e.target.value); }} onBlur={() => checkField("cookTimeMinutes", cookTimeMinutes)} error={errors.cookTimeMinutes} />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="recipe-meal-type" error={errors.mealType}>Meal Type (one per line)</Label>
        <Textarea
          id="recipe-meal-type" value={mealType} onChange={(e) => { setMealType(e.target.value); checkField("mealType", e.target.value); }} onBlur={() => checkField("mealType", mealType)}
          rows={3} placeholder={"Breakfast\nLunch\nDinner"} error={errors.mealType} />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="recipe-tags" error={errors.tags}>Tags (one per line)</Label>
        <Textarea
          id="recipe-tags" value={tags} onChange={(e) => { setTags(e.target.value); checkField("tags", e.target.value); }} onBlur={() => checkField("tags", tags)}
          rows={3} placeholder={"Italian\nPizza"} error={errors.tags} />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="recipe-ingredients" error={errors.ingredients}>Ingredients (one per line)</Label>
        <Textarea
          id="recipe-ingredients" value={ingredients} onChange={(e) => { setIngredients(e.target.value); checkField("ingredients", e.target.value); }} onBlur={() => checkField("ingredients", ingredients)}
          rows={4} error={errors.ingredients} />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="recipe-instructions" error={errors.instructions}>Instructions (one per line)</Label>
        <Textarea
          id="recipe-instructions" value={instructions} onChange={(e) => { setInstructions(e.target.value); checkField("instructions", e.target.value); }} onBlur={() => checkField("instructions", instructions)}
          rows={4} error={errors.instructions} />
      </div>

      {submitError && <p role="alert" className="text-sm text-brand-700 sm:col-span-2">{submitError}</p>}
      <Button type="submit" disabled={busy} className="w-full sm:col-span-2">
        {busy ? (editing ? "Saving…" : "Adding…") : (editing ? "Save Changes" : "Add Recipe")}
      </Button>
    </form>
  );
}
