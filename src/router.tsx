import { createBrowserRouter } from 'react-router-dom';
import Root from './components/root';
import ErrorPage from './routes/error-page';
import Home from './routes/home/home';
import Projects from './routes/managements/project/projects';
import Edit from './routes/managements/project/edit';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: '/projects',
        element: <Projects />,
      },
      {
        path: '/projects/edit/:contractNumber',
        element: <Edit />,
      },
    ],
  },
]);

export default router;
