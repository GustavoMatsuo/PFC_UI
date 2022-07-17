import { Suspense } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import DashboardLayout from './layouts/dashboard'
import LogoOnlyLayout from './layouts/LogoOnlyLayout'

import Login from './pages/login'
import User from './pages/user'
import Produtos from './pages/produtos'
import Dashboard from './pages/dashboard'
import Page404 from './pages/page_404'
import Fornecedor from './pages/fornecedor'
import Entrada from './pages/entrada'
import Venda from './pages/venda'
import Saida from './pages/saida'
import Loading from './pages/loading'
import Reset from './pages/reset'

export default function Router() {
  const isLoggedIn = localStorage.getItem("token")
  return useRoutes([
    {
      path: '/dashboard',
      element: isLoggedIn? <DashboardLayout /> : <Navigate to="/auth" replace/>, 
      children: [
        { path: 'home', element: <Dashboard /> },
        { path: 'usuario', element: <User /> },
        { path: 'fornecedor', element: <Fornecedor /> },
        { path: 'produto', element: <Produtos /> },
        { path: 'entrada', element: <Entrada /> },
        { path: 'saida', element: <Saida/> },
        { path: 'venda', element: <Venda /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '/auth',element: <Loading/> },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/login" /> },
        { path: 'login', element: <Login /> },
        { path: 'reset/:token', element: <Reset /> },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ])
}
