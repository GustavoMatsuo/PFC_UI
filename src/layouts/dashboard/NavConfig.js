import Iconify from '../../components/Iconify'

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill')
  },
  {
    title: 'usuário',
    path: '/dashboard/usuario',
    icon: getIcon('eva:people-fill')
  },
  {
    title: 'fornecedor',
    path: '/dashboard/fornecedor',
    icon: getIcon('eva:car-fill')
  },
  {
    title: 'produto',
    path: '/dashboard/produto',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: 'entrada',
    path: '/dashboard/entrada',
    icon: getIcon('eva:clipboard-fill'),
  },
  {
    title: 'saida',
    path: '/dashboard/saida',
    icon: getIcon('eva:arrow-circle-up-fill'),
  },
  {
    title: 'venda',
    path: '/dashboard/venda',
    icon: getIcon('eva:shopping-cart-fill'),
  }
]

export default navConfig
