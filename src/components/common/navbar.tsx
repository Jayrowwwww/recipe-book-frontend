import { useState } from "react";
import { Link, NavLink } from "react-router";
import { useAuth } from "@/components/context/use-auth";
import { Button } from "@/components/ui/button";
import { buttonClass } from "@/lib/button-class";
import { cn } from "@/lib/cn";

function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    "px-3 py-2 text-sm font-medium transition-colors",
    // Active page = solid ink chip; hover = warm paper tint.
    isActive ? "bg-ink-950 text-paper-50" : "text-ink-700 hover:bg-paper-100 hover:text-ink-950",
  );
}

function mobileNavLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    "block px-3 py-2.5 text-base font-medium transition-colors",
    isActive ? "bg-ink-950 text-paper-50" : "text-ink-700 hover:bg-paper-100 hover:text-ink-950",
  );
}

// Shared top navigation: brand, route links, and session actions.
// Rendered by AppLayout on every public and protected page.
// Links that look like buttons use buttonClass() instead of <Button>,
// so no <button> is ever nested inside an <a>.
export function Navbar() {
  const { user, ready, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    try {
      setError("");
      setMenuOpen(false);
      await logout();
    } catch {
      setError("Unable to sign out. Please try again.");
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/10 bg-paper-50/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8" aria-label="Main">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
          <span
            className="grid h-9 w-9 place-items-center bg-[linear-gradient(135deg,#dc2626,#f97316)] font-display text-lg font-bold text-white"
            aria-hidden
          >
            R
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink-950">Recipe Book 2026</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          {user?.role === "USER" && (
            <NavLink to="/user" className={navLinkClass}>
              My Recipes
            </NavLink>
          )}
          {user?.role === "ADMIN" && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </div>

        {/* Desktop session actions (hidden until the session check finishes) */}
        <div className="hidden items-center gap-2 md:flex">
          {ready &&
            (user ? (
              <>
                <span className="max-w-40 truncate px-2 text-sm text-ink-950/70" title={user.email}>
                  {user.name}
                </span>
                <Button variant="secondary" onClick={handleLogout}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className={buttonClass("tertiary")}>
                  Sign in
                </Link>
                <Link to="/auth/signup" className={buttonClass("primary")}>
                  Create account
                </Link>
              </>
            ))}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="border border-ink-900/20 p-2 text-ink-900 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            {menuOpen ? (
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div id="mobile-menu" className="space-y-1 border-t border-ink-900/10 px-4 py-3 md:hidden">
          <NavLink to="/" className={mobileNavLinkClass} end onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          {user?.role === "USER" && (
            <NavLink to="/user" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
              My Recipes
            </NavLink>
          )}
          {user?.role === "ADMIN" && (
            <NavLink to="/admin" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
              Admin
            </NavLink>
          )}
          <div className="flex flex-col gap-2 pt-2">
            {ready &&
              (user ? (
                <>
                  <span className="truncate px-3 text-sm text-ink-950/70">{user.name}</span>
                  <Button variant="secondary" onClick={handleLogout}>
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth/login" className={buttonClass("secondary", "w-full")} onClick={() => setMenuOpen(false)}>
                    Sign in
                  </Link>
                  <Link to="/auth/signup" className={buttonClass("primary", "w-full")} onClick={() => setMenuOpen(false)}>
                    Create account
                  </Link>
                </>
              ))}
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="border-t border-brand-200 bg-brand-50 px-4 py-2 text-center text-sm text-brand-700">
          {error}
        </p>
      )}
    </header>
  );
}
