import { Link } from "react-router";
import { useAuth } from "@/components/context/use-auth";
import { buttonClass } from "@/lib/button-class";
import { Section } from "@/components/ui/section";
import { LatestRecipes } from "@/components/features/recipe/latest-recipes";

// Public landing page at "/". Guests can browse every published recipe
// through the guest endpoints; signed-in users get quick links to their area.
export default function LandingPage() {
  const { user } = useAuth();

  return (
    <>
      {/* Hero — near-black surface with red/orange radial glows */}
      <section
        className="text-paper-50"
        style={{
          backgroundColor: "#131418",
          backgroundImage:
            "radial-gradient(110% 90% at 0% 0%, rgba(220,38,38,0.40) 0%, transparent 55%), radial-gradient(90% 80% at 100% 100%, rgba(249,115,22,0.32) 0%, transparent 50%)",
        }}
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-semibold tracking-widest text-ember-300 uppercase">
              A community kitchen notebook
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
              Recipes worth sharing, all in one place.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-paper-100/80">
              Browse dishes published by every cook in the book — or sign in and publish your own.
              Real accounts, real recipes, stored securely.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#latest" className={buttonClass("accent")}>
                Browse recipes
              </a>
              {user ? (
                <Link to="/user" className={buttonClass("secondary", "border-paper-100/30 bg-transparent text-paper-50 hover:bg-paper-100/10")}>
                  My Recipes
                </Link>
              ) : (
                <>
                  <Link to="/auth/signup" className={buttonClass("secondary", "border-paper-100/30 bg-transparent text-paper-50 hover:bg-paper-100/10")}>
                    Create account
                  </Link>
                  <Link to="/auth/login" className={buttonClass("tertiary", "text-paper-100/80 hover:text-paper-50")}>
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Image collage uses the same CDN photos as the seeded recipes. */}
          <div className="hidden gap-4 lg:grid lg:grid-cols-2" aria-hidden>
            <img
              src="https://cdn.dummyjson.com/recipe-images/1.webp"
              alt=""
              className="h-64 w-full border border-paper-100/10 object-cover shadow-lg"
            />
            <div className="gap-4">
              <img
                src="https://cdn.dummyjson.com/recipe-images/3.webp"
                alt=""
                className="h-28 w-full border border-paper-100/10 object-cover shadow-lg"
              />
              <img
                src="https://cdn.dummyjson.com/recipe-images/4.webp"
                alt=""
                className="mt-4 h-32 w-full border border-paper-100/10 object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Latest recipes from every user */}
      <Section id="latest" className="py-12 sm:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-ember-700 uppercase">Fresh from the kitchen</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink-950">
              Everyone&rsquo;s latest recipes
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-950/70">
              Every recipe published by our community, newest first. Open any card to read the full
              ingredients and steps — no account needed.
            </p>
          </div>
          {!user && (
            <Link to="/auth/signup" className={buttonClass("primary")}>Publish your first recipe</Link>
          )}
        </div>

        <LatestRecipes />
      </Section>

      {/* Closing call to action */}
      <section className="border-t border-ink-900/10 bg-paper-100">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink-950">Got a dish to share?</h2>
            <p className="mt-2 max-w-xl text-sm text-ink-950/70">
              Create an account to upload recipes, edit them any time, and keep your own collection.
            </p>
          </div>
          {user ? (
            <Link to="/user" className={buttonClass("primary")}>Open My Recipes</Link>
          ) : (
            <Link to="/auth/signup" className={buttonClass("accent")}>Get started free</Link>
          )}
        </div>
      </section>
    </>
  );
}
