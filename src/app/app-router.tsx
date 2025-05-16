import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router";
import { NotFound } from "./not-found";
import RegisterPage from "./routes/auth/register";
import LoginPage from "./routes/auth/login";
import Dashboard from "./routes/dashboard/dashboard";
import { ProtectedRoute } from "./../components/ProtectedRoute";
import DepositSummary from "@/app/routes/dashboard/AllDeposit.tsx";
import PurchaseSummary from "@/app/routes/dashboard/AllPurchase.tsx";
import PendingPurchases from "@/app/routes/dashboard/PendingPurchases.tsx";
import TransactionDetails from "@/app/routes/dashboard/TransactionDetails.tsx";
import SearchTransaction from "@/app/routes/dashboard/SearchTransaction.tsx";
import ValidateMcd from "@/app/routes/dashboard/Validate-Mcd.tsx";
import AllUsers from "@/app/routes/dashboard/AllUsersPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
    {
        path: "*",
        Component: NotFound,
    },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/dashboard",
      Component: () => (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
      ),

  },
    {
    path: "/alldeposit",
      Component: () => (
          <ProtectedRoute>
            <DepositSummary />
          </ProtectedRoute>
      ),

  },
  {
    path: "/allpurchase",
      Component: () => (
          <ProtectedRoute>
            <PurchaseSummary />
          </ProtectedRoute>
      ),

  },
    {
    path: "/allpending",
      Component: () => (
          <ProtectedRoute>
            <PendingPurchases />
          </ProtectedRoute>
      ),

  },
    {
    path: "/transaction/:id",
      Component: () => (
          <ProtectedRoute>
            <TransactionDetails />
          </ProtectedRoute>
      ),

  },
    {
    path: "/search-tran",
      Component: () => (
          <ProtectedRoute>
            <SearchTransaction />
          </ProtectedRoute>
      ),

  },
    {
    path: "/recheck",
      Component: () => (
          <ProtectedRoute>
            <ValidateMcd />
          </ProtectedRoute>
      ),

  },
    {
    path: "/allusers",
      Component: () => (
          <ProtectedRoute>
            <AllUsers />
          </ProtectedRoute>
      ),

  },

]);
export function AppRouter() {
  return <RouterProvider router={router} />;
}
