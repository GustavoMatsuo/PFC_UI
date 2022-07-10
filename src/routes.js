import { Navigate, useRoutes } from 'react-router-dom'
import DashboardLayout from './layouts/dashboard'
import LogoOnlyLayout from './layouts/LogoOnlyLayout'

import Login from './pages/login'
import User from './pages/user'
import Produtos from './pages/produtos'
import Dashboard from './pages/dashboard'
import Page404 from './pages/page_404'
import Fornecedor from './pages/Fornecedor'
import Entrada from './pages/Entrada'
import Venda from './pages/Venda'

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <Dashboard /> },
        { path: 'usuario', element: <User /> },
        { path: 'fornecedor', element: <Fornecedor /> },
        { path: 'produto', element: <Produtos /> },
        { path: 'entrada', element: <Entrada /> },
        { path: 'saida', element: <div/> },
        { path: 'venda', element: <Venda /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/login" /> },
        { path: 'login', element: <Login /> },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ])
}
