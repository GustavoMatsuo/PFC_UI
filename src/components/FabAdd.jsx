import PropTypes from 'prop-types'
import { Fab, useTheme } from '@mui/material'
import Iconify from './Iconify'

FabAdd.propTypes = {
  addFunc: PropTypes.func
}

export function FabAdd({ addFunc }) {
  const theme = useTheme()

  return (
    <Fab 
      sx={{
        position: 'fixed', 
        bottom: theme.spacing(2), 
        right: theme.spacing(2),
        backgroundColor: '#2065D180',
        "&:hover": {
          backgroundColor: theme.palette.primary.main
        }
      }} 
      onClick={addFunc}
      size="medium" 
      color="secondary" 
      aria-label="add"
    >
      <Iconify
        icon="eva:plus-fill" 
        width={28}
        height={28} 
      />
   </Fab>
  )
}
