import { createBrowserRouter } from "react-router-dom";
import Root from "./components/root";
import ErrorPage from "./routes/error-page";
import Home from "./routes/home/home";
import Projects from "./routes/managements/project/projects";
import ProjectEdit from "./routes/managements/project/edit";
import ProjectDetails from "./routes/managements/project/details";
import ProjectRegister from "./routes/managements/project/register";
import Departments from "./routes/managements/department/departments";
import DepartmentEdit from "./routes/managements/department/edit";
import DepartmentRegister from "./routes/managements/department/register";
import Employees from "./routes/managements/employee/employees";
import EmployeeRegister from "./routes/managements/employee/register";
import EmployeeEdit from "./routes/managements/employee/edit";
import ProjectStatisticsList from "./routes/statistics/project/list";
import ProjectStatisticsAddEmployee from "./routes/statistics/project/add-employee";
import ByProjectStatistics from "./routes/statistics/project/by-project";
import ByEmployeeStatistics from "./routes/statistics/employee/by-employee";

const router = createBrowserRouter([
  {
    path: "/mms",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "statistics/projects",
        element: <ProjectStatisticsList />,
      },
      {
        path: "statistics/projects/:contractNumber",
        element: <ByProjectStatistics />,
      },
      {
        path: "statistics/projects/:contractNumber/employee",
        element: <ProjectStatisticsAddEmployee />,
      },
      {
        path: "statistics/employee",
        element: <ByEmployeeStatistics />,
      },
      {
        path: "departments",
        element: <Departments />,
      },
      {
        path: "departments/register",
        element: <DepartmentRegister />,
      },
      {
        path: "departments/edit/:departmentName",
        element: <DepartmentEdit />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "projects/register",
        element: <ProjectRegister />,
      },
      {
        path: "projects/edit/:contractNumber",
        element: <ProjectEdit />,
      },
      {
        path: "projects/details/:contractNumber",
        element: <ProjectDetails />,
      },
      {
        path: "employees",
        element: <Employees />,
      },
      {
        path: "employees/register",
        element: <EmployeeRegister />,
      },
      {
        path: "employees/edit/:employeeNumber",
        element: <EmployeeEdit />,
      },
    ],
  },
]);

export default router;
