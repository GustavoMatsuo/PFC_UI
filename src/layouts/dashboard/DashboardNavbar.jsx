import PropTypes from 'prop-types'
import { alpha, styled } from '@mui/material/styles'
import { Box, AppBar, Toolbar, IconButton, Typography } from '@mui/material'
import Iconify from '../../components/Iconify'
import AccountPopover from './AccountPopover'

const DRAWER_WIDTH = 280
const APPBAR_MOBILE = 64
// const APPBAR_DESKTOP = 92 

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}))

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    // minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 4),
  },
}))

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
}

const TitleNavBar = () => {
  let title = String(window.location.pathname).toLowerCase()
  title = title.replace('/dashboard', '').replaceAll('/', '')

  title = title === 'home'? '' : title.charAt(0).toUpperCase() + title.slice(1)

  return <Typography variant="h4" noMargin color='black'>{title}</Typography>
}

export default function DashboardNavbar({ onOpenSidebar }) {
  return (
    <RootStyle>
      <ToolbarStyle>
        <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary', display: { lg: 'none' } }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
        <TitleNavBar/>
        <Box sx={{ flexGrow: 1 }} />
        <AccountPopover />
      </ToolbarStyle>
    </RootStyle>
  )
}
