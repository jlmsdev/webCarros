import { createBrowserRouter } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { New } from './pages/Dashboard/New';
import { CarDetail } from './pages/Car';
import { Erro } from './pages/Erro';
import { Layout } from './components/Layout';
import { Private } from './routes/Private';


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },

      {
        path: '/car/:id',
        element: <CarDetail />
      },

      {
        path: '/dashboard',
        element: <Private><Dashboard /></Private>
      },

      {
        path: 'dashboard/new',
        element: <Private><New /></Private>
      },

      {
        path: '*',
        element: <Erro />
      }

    ]
  },

  {
    path: '/login',
    element: <Login />
  },

  {
    path: '/register',
    element: <Register />
  }
])


export { router };