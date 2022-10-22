import { Suspense } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import { PrivateRoute } from './components/PrivateRoute'
import { Roles } from './layouts/dashboard/NavConfig'
import DashboardLayout from './layouts/dashboard'
import LogoOnlyLayout from './layouts/LogoOnlyLayout'

import Login from './pages/login'
import User from './pages/user'
import Produtos from './pages/produtos'
import Dashboard from './pages/dashboard'
import Page404 from './pages/page_404'
import Entrada from './pages/entrada'
import Venda from './pages/venda'
import Saida from './pages/saida'
import Loading from './pages/loading'
import Reset from './pages/reset'
import Gerenciamento from './pages/gerenciamento'
import Verificar from './pages/verificar'
import Fornecedor from './pages/fornecedor'

export default function Router() {
  const isLoggedIn = localStorage.getItem("token")
  return useRoutes([
    {
      path: '/dashboard',
      element: isLoggedIn? <DashboardLayout /> : <Navigate to="/auth" replace/>, 
      children: [
        { path: 'home', element: <PrivateRoute component={Dashboard} roles={Roles.EMP}/> },
        { path: 'usuario', element: <PrivateRoute component={User} roles={Roles.ADM}/> },
        { path: 'fornecedor', element: <PrivateRoute component={Fornecedor} roles={Roles.ADM}/> },
        { path: 'produto', element: <PrivateRoute component={Produtos} roles={Roles.ADM}/> },
        { path: 'entrada', element: <PrivateRoute component={Entrada} roles={Roles.ADM}/> },
        { path: 'saida', element: <PrivateRoute component={Saida} roles={Roles.EMP}/> },
        { path: 'venda', element: <PrivateRoute component={Venda} roles={Roles.EMP}/> },
        { path: 'gerenciamento', element: <PrivateRoute component={Gerenciamento} roles={Roles.ADM_GLOBAL}/> },
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
        { path: 'verificar/:token', element: <Verificar /> },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ])
}
