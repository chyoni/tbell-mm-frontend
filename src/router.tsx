import { createBrowserRouter } from "react-router-dom";
import Root from "./components/root";
import ErrorPage from "./routes/error-page";
import Home from "./routes/home/home";
import Projects from "./routes/managements/projects";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/projects",
        element: <Projects />,
      },
    ],
  },
]);

export default router;
