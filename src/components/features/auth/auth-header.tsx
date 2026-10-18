// Shared branding for the login and signup pages.
export function AuthHeader() {
  return (
    <header className="mb-8 text-center">
      <p className="mb-4 text-xs font-semibold tracking-widest text-ember-300 uppercase">Your kitchen companion</p>
      <h1 className="font-display text-4xl font-semibold tracking-tight text-paper-50 sm:text-5xl">Recipe Book</h1>
      <p className="mt-3 text-sm text-paper-100/80">Keep your favorite meals in one place.</p>
    </header>
  );
}