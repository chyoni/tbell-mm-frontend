import { createBrowserRouter } from "react-router-dom";
import Root from "./components/root";
import ErrorPage from "./routes/error-page";
import Home from "./routes/home/home";
import Projects from "./routes/managements/project/projects";
import ProjectEdit from "./routes/managements/project/edit";
import ProjectDetails from "./routes/managements/project/details";
import ProjectRegister from "./routes/managements/project/register";
import Departments from "./routes/managements/department/departments";

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
      {
        path: "/projects/register",
        element: <ProjectRegister />,
      },
      {
        path: "/departments",
        element: <Departments />,
      },
      {
        path: "/projects/edit/:contractNumber",
        element: <ProjectEdit />,
      },
      {
        path: "/projects/details/:contractNumber",
        element: <ProjectDetails />,
      },
    ],
  },
]);

export default router;
