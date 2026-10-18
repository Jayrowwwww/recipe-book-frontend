import { useAuth } from "@/components/context/use-auth";
import { PageHeader } from "@/components/common/page-header";
import { RecipeCollection } from "@/components/features/recipe/recipe-collection";
import { Section } from "@/components/ui/section";

// Authenticated user area ("/user"): the signed-in cook's own collection.
// Sign out lives in the shared Navbar, so the page only owns its content.
export default function HomePage() {
  const { user } = useAuth();

  return (
    <Section>
      <PageHeader
        eyebrow="Your kitchen companion"
        title="My Recipes"
        description={`Welcome back, ${user?.name}. Manage the recipes you have published here.`}
      />

      <RecipeCollection />
    </Section>
  );
}
