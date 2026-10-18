import { Outlet } from "react-router";
import { Navbar } from "@/components/common/navbar";
import { Footer } from "@/components/common/footer";

// Shared shell for every non-auth page: sticky navbar, page content, footer.
// Auth pages stay outside this layout because they have their own design.
export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-paper-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
