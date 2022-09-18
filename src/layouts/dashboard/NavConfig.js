import Iconify from '../../components/Iconify'

export const Roles = {
  EMP: 'employee',
  ADM: 'admin',
  ADM_GLOBAL: "admin global"
}

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />

const navConfig = [
  {
    title: 'Home',
    path: '/dashboard/home',
    icon: getIcon('eva:pie-chart-2-fill'),
    role: Roles.EMP
  },
  {
    title: 'usuário',
    path: '/dashboard/usuario',
    icon: getIcon('eva:people-fill'),
    role: Roles.ADM
  },
  {
    title: 'fornecedor',
    path: '/dashboard/fornecedor',
    icon: getIcon('eva:car-fill'),
    role: Roles.ADM
  },
  {
    title: 'produto',
    path: '/dashboard/produto',
    icon: getIcon('eva:shopping-bag-fill'),
    role: Roles.ADM
  },
  {
    title: 'entrada',
    path: '/dashboard/entrada',
    icon: getIcon('eva:clipboard-fill'),
    role: Roles.ADM
  },
  {
    title: 'saida',
    path: '/dashboard/saida',
    icon: getIcon('eva:arrow-circle-up-fill'),
    role: Roles.EMP
  },
  {
    title: 'venda',
    path: '/dashboard/venda',
    icon: getIcon('eva:shopping-cart-fill'),
    role: Roles.EMP
  },
  {
    title: 'Gerenciamento',
    path: '/dashboard/gerenciamento',
    icon: getIcon('eva:options-2-fill'),
    role: Roles.ADM_GLOBAL
  }
]

export default navConfig
