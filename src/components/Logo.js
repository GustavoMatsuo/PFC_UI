import PropTypes from 'prop-types'
import { Box } from '@mui/material'

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
}

export default function Logo({ disabledLink = false, sx }) {
  const logo = (
    <Box sx={{ width: 40, height: 40, ...sx }}>
      <p></p>
    </Box>
  )

  // if (disabledLink) {
  //   return logo
  // }

  // return <RouterLink to="/">{logo}</RouterLink>
  return logo
}
