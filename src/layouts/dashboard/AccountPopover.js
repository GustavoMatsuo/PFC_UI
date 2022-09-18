import { useEffect, useRef, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton } from '@mui/material'
import MenuPopover from '../../components/MenuPopover'
import { ModalAnuncio } from 'src/modals/modalAnuncio'

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    linkTo: '/',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    linkTo: '#',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
    linkTo: '#',
  },
]

export default function AccountPopover() {
  const [account, setAccount] = useState({})
  const [open, setOpen] = useState(null)
  const [isOpenAnuncio, setIsOpenAnuncio] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    let newAccount = localStorage.getItem('user_data')
    newAccount = JSON.parse(newAccount)
    setAccount(newAccount)
  },[])

  const handleOpen = (event) => {
    setOpen(event.currentTarget)
  }

  const handleClose = () => {
    setOpen(null)
  }

  const handleLogout = () => {
    handleClose()
    localStorage.removeItem("token")
    localStorage.removeItem("user_data")
    navigate('/login', { replace: true })
  }

  const handleOpenAnuncio = () => {
    setIsOpenAnuncio(true)
    handleClose()
  }

  const anchorRef = useRef(null)

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {account.nome}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {account.email}
          </Typography>
        </Box>

        {/*
        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack> */}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleOpenAnuncio} sx={{ m: 1 }}>
          Gerenciar anúncio
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Sair
        </MenuItem>
      </MenuPopover>
     {isOpenAnuncio && <ModalAnuncio
        isOpen={isOpenAnuncio}
        handleClose={() => setIsOpenAnuncio(false)}
      />}
    </>
  )
}
