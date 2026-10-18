import "@/styles/global.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import LandingPage from "@/pages/home";
import HomePage from "@/pages/user/home";
import RecipePage from "@/pages/user/recipe";
import NotFoundPage from "@/pages/not-found";
import AdminPage from "@/pages/admin/home";
import AuthLayout from "@/pages/auth/layout";
import LoginPage from "@/pages/auth/login";
import SignupPage from "@/pages/auth/signup";
import { AuthProvider } from "@/components/context/auth-context";
import { ProtectedRoute } from "@/components/context/protected-route";
import { AppLayout } from "@/components/common/app-layout";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/*
          AppLayout gives every non-auth page the shared Navbar + Footer.
          Auth pages stay outside it because they have their own design.
        */}
        <Route element={<AppLayout />}>
          {/* Public pages — guests need no account to browse. */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/recipes/:id" element={<RecipePage />} />
          {/* Legacy path kept so old links keep working. */}
          <Route path="/recipe/:id" element={<RecipePage />} />

          {/* User Panel Pages */}
          <Route element={<ProtectedRoute role="USER" />}>
            <Route path="/user" element={<HomePage />} />
          </Route>

          {/* Admin Pages */}
          <Route element={<ProtectedRoute role="ADMIN" />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          {/* Unknown URLs get a real 404 page. */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Auth pages */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>,
);
