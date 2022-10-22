import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import { NavLink as RouterLink } from 'react-router-dom'
import img from '../assets/icon.png'

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
}

export default function Logo({ disabledLink = false, sx }) {
  const logo = (
    <Box 
      sx={{ 
        width: '2.5rem', 
        height: '2.5rem',
        ...sx 
      }}
    >
      <img src={img} alt="Logo" />
    </Box>
  )

  return <RouterLink to="/dashboard/home">{logo}</RouterLink>
}
