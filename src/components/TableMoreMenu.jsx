import { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material'
import Iconify from './Iconify'

TableMoreMenu.propTypes = {
  status: PropTypes.bool,
  handleChangeStatus: PropTypes.func,
  handleEdit: PropTypes.func,
  hideStatus: PropTypes.bool,
  handleDelete: PropTypes.func,
  showDelete: PropTypes.bool
}

export function TableMoreMenu({
  status,
  handleChangeStatus,
  handleEdit,
  hideStatus,
  handleDelete,
  showDelete
}) {
  const ref = useRef(null)
  const [isOpen, setIsOpen] = useState(false)

  const onEdit = () => {
    handleEdit()
    setIsOpen(false)
  }

  const onChangeStatus = () => {
    handleChangeStatus()
    setIsOpen(false)
  }

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 120, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {!hideStatus && 
          <MenuItem sx={{ color: 'text.secondary' }} onClick={onChangeStatus}>
            <ListItemIcon>
              <Iconify icon={!status?"eva:checkmark-circle-2-outline":"eva:close-circle-outline"} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary={status? "Inativar":"Ativar"} primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        }
        <MenuItem sx={{ color: 'text.secondary' }} onClick={onEdit}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Editar" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        {showDelete && handleDelete && 
          <MenuItem sx={{ color: 'text.secondary' }} onClick={handleDelete}>
            <ListItemIcon>
              <Iconify icon="eva:trash-2-outline" width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="Deletar" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        }
      </Menu>
    </>
  )
}
