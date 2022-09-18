import PropTypes from 'prop-types'
import { NavLink as RouterLink, matchPath, useLocation } from 'react-router-dom'
import { alpha, useTheme, styled } from '@mui/material/styles'
import { Box, List, ListItemText, ListItemIcon, ListItemButton } from '@mui/material'
import { Roles } from 'src/layouts/dashboard/NavConfig'

const ListItemStyle = styled((props) => <ListItemButton disableGutters {...props} />)(({ theme }) => ({
  ...theme.typography.body2,
  height: 48,
  position: 'relative',
  textTransform: 'capitalize',
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  marginBottom: "12px"
}))

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

NavItem.propTypes = {
  item: PropTypes.object,
  active: PropTypes.func,
}

function NavItem({ item, active }) {
  const theme = useTheme()

  const isActiveRoot = active(item.path)

  const { title, path, icon, info } = item

  const activeRootStyle = {
    color: 'primary.main',
    fontWeight: 'fontWeightMedium',
    bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
  }

  const userData = JSON.parse(localStorage.getItem('user_data'))

  if(userData.role === Roles.ADM_GLOBAL){
    return (
      <ListItemStyle
        component={RouterLink}
        to={path}
        sx={{...(isActiveRoot && activeRootStyle)}}
      >
        <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
        <ListItemText disableTypography primary={title} />
        {info && info}
      </ListItemStyle>
    )
  }

  return ( 
    (item.role === userData.role || userData.role === Roles.ADM) && 
    item.role !== Roles.ADM_GLOBAL &&
    <ListItemStyle
      component={RouterLink}
      to={path}
      sx={{...(isActiveRoot && activeRootStyle)}}
    >
      <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
      <ListItemText disableTypography primary={title} />
      {info && info}
    </ListItemStyle>
  )
}

NavSection.propTypes = {
  navConfig: PropTypes.array,
}

export default function NavSection({ navConfig, ...other }) {
  const { pathname } = useLocation()

  const match = (path) => (path ? !!matchPath({ path, end: false }, pathname) : false)

  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {navConfig.map((item) =>
          <NavItem key={item.title} item={item} active={match} />
        )}
      </List>
    </Box>
  )
}
