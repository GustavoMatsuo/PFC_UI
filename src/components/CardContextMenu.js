import { useState } from 'react'
import PropTypes from 'prop-types'
import { Menu, MenuItem, CardActionArea, ListItemIcon, ListItemText } from '@mui/material'
import Iconify from './Iconify'

CardContextMenu.propTypes = {
  status: PropTypes.bool,
  children: PropTypes.element,
  handleChangeStatus: PropTypes.func,
  handleEdit: PropTypes.func
}

export function CardContextMenu({
  status,
  children,
  handleChangeStatus,
  handleEdit
}) {
  const [xPos, setXPos] = useState(null)
  const [yPos, setYPos] = useState(null)

  const onEdit = () => {
    handleEdit()
    onCloseMenu()
  }

  const onChangeStatus = () => {
    handleChangeStatus()
    onCloseMenu()
  }

  const onOpenMenu = (event) => {
    event.preventDefault()
    const xPos = event.clientX + 2
    const yPos = event.clientY - 6

    setXPos(xPos)
    setYPos(yPos)
  }

  const onCloseMenu = () => {
    setXPos(null)
    setYPos(null)
  }

  const isOpen = (yPos != null && xPos != null)
  return (
    <>
      <CardActionArea onClick={onOpenMenu}>
        {children}
      </CardActionArea>

      <Menu
        open={isOpen}
        onClose={onCloseMenu}
        anchorReference="anchorPosition"
        anchorPosition={isOpen? { top: yPos, left: xPos }:undefined}
        PaperProps={{
          sx: { width: 120, maxWidth: '100%' },
        }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={onChangeStatus}>
          <ListItemIcon>
            <Iconify icon={!status?"eva:checkmark-circle-2-outline":"eva:close-circle-outline"} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary={status? "Inativar":"Ativar"} primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: 'text.secondary' }} onClick={onEdit}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Editar" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  )
}
