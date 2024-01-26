import { createBrowserRouter } from 'react-router-dom';
import Root from './components/root';
import ErrorPage from './routes/error-page';
import Home from './routes/home/home';

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
    ],
  },
]);

export default router;
