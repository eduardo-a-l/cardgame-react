import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainMenuPage from "./pages/MainMenuPage.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainMenuPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
