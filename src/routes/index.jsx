import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const Dashboard = lazy(() => import("@/pages/dashboard"));
const UserRegistration = lazy(() => import("../pages/auth/register"));
const UserLogin = lazy(() => import("../pages/auth/login"));

export const router = createBrowserRouter([
  {
    path: "/",
    // element: <MainLayout />,
    // errorElement: <ErrorPage />,
    children: [
      //   { path: "*", element: <NotFound /> },
      { index: true, element: <Dashboard /> },
      { path: "register", element: <UserRegistration /> },
      { path: "login", element: <UserLogin /> },
    ],
  },
]);
