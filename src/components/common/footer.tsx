import { Link } from "react-router";

// Site-wide footer: quick links and a short project note.
export function Footer() {
  return (
    <footer className="border-t border-ink-900/10 bg-ink-950 text-paper-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-lg font-semibold text-paper-50">Recipe Book</p>
          <p className="mt-2 max-w-xs text-sm text-paper-100/70">
            Discover recipes shared by our community, and publish your own from one tidy kitchen notebook.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="text-xs font-semibold tracking-widest text-ember-300 uppercase">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/" className="hover:text-paper-50">Home</Link></li>
            <li><Link to="/auth/login" className="hover:text-paper-50">Sign in</Link></li>
            <li><Link to="/auth/signup" className="hover:text-paper-50">Create account</Link></li>
          </ul>
        </nav>

        <div>
          <p className="text-xs font-semibold tracking-widest text-ember-300 uppercase">Built with</p>
          <p className="mt-3 text-sm text-paper-100/70">
            React + Vite + Tailwind CSS, Express + TypeScript, Drizzle ORM and PostgreSQL (Neon).
          </p>
        </div>
      </div>
      <div className="border-t border-paper-100/10 py-4 text-center text-xs text-paper-100/60">
        © {new Date().getFullYear()} Recipe Book System — school group project from BSIT 3A.
      </div>
    </footer>
  );
}
