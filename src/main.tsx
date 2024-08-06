import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./Style/Theme.ts";
import Home from "./routes/Home.tsx";
import "./index.css";
import Catalogo from "./routes/Catalogo.tsx";
import FaleConosco from "./routes/FaleConosco.tsx";
import QuemSomos from "./routes/QuemSomos copy.tsx";
import Abstratas from "./routes/Catalogos/Abstratas.tsx";
import AnimalPrint from "./components/QuemSomos/AnimalPrint.tsx";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        { path: "", element: <Home /> },
        { path: "catalogo", element: <Catalogo /> },
        { path: "catalogo/abstratas", element: <Abstratas /> },
        { path: "catalogo/animal-print", element: <AnimalPrint /> },
        { path: "fale-conosco", element: <FaleConosco /> },
        { path: "quemSomos", element: <QuemSomos /> },
      ],
    },
  ],
  { basename: "/projeto-atelier" },
);

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </React.StrictMode>,
  );
} else {
  console.error("Root container missing in index.html");
}
