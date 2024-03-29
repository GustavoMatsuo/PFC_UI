import { Navigate } from 'react-router-dom'
import { Roles } from 'src/layouts/dashboard/NavConfig'

export const PrivateRoute = ({ component: Component, roles }) => {
  const userData = JSON.parse(localStorage.getItem('user_data'))

  // ADD LOGIN TEST

  if (roles && userData.role === Roles.ADM_GLOBAL) {
    return <Component />
  }

  if (
    roles && 
    roles !== Roles.ADM_GLOBAL && 
    (roles === userData.role || userData.role === Roles.ADM)
  ) {
    return <Component />
  }

  return <Navigate to="/dashboard/home" replace/>
}