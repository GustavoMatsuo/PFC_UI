import { Typography, Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Logo from 'src/components/Logo'

export default function LogoOnlyLayout() {
  return (
    <>
      <Box 
        sx={{ 
          px: 2.5, py: 3,
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'flex-start',
        }}
      >
        <Logo />
        <Typography 
          variant='h3'
          sx={{ ml: 1, pb: .5 }}
        >
          TAG
        </Typography>
      </Box>
      <Outlet />
    </>
  )
}
