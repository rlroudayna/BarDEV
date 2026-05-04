import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import {
  Welcome,
  Login,
  SignUp,
  Dashboard,
  Users,
  Vehicules,
  LoisDeRoute,
  Calages,
  Cycles,
  Demandes,
  Planning,
  Validation,
  ValidationConducteur,
  ValidationCharge,
  Reporting,
  Profile,
  ForgotPassword,
  NotFound,
} from "./pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/app",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "users", element: <Users /> },
      { path: "vehicules", element: <Vehicules /> },
      { path: "lois-de-route", element: <LoisDeRoute /> },
      { path: "calages", element: <Calages /> },
      { path: "cycles", element: <Cycles /> },
      { path: "demandes", element: <Demandes /> },
      { path: "planning", element: <Planning /> },
      { path: "validation", element: <Validation /> },
      {
        path: "validation/conducteur/:id",
        element: <ValidationConducteur />,
      },
      {
        path: "validation/charge/:id",
        element: <ValidationCharge />,
      },
      { path: "reporting", element: <Reporting /> },
      { path: "profile", element: <Profile /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);