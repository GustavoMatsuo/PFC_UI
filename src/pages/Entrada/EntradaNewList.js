import PropTypes from 'prop-types'
import {
  List,
  ListItem,
  IconButton,
  ListItemText,
  useTheme
} from '@mui/material'
import Iconify from 'src/components/Iconify'
import { fCurrency } from 'src/utils/formatNumber'

EntradaNewList.propTypes = {
  newEntradaList: PropTypes.array,
  handleEditEntrada: PropTypes.func,
  handleRemoveEntrada: PropTypes.func,
  enabledButtons: PropTypes.bool,
  maxHeight: PropTypes.string.isRequired
}

export function EntradaNewList({
  newEntradaList,
  handleEditEntrada,
  handleRemoveEntrada,
  enabledButtons,
  maxHeight
}) {
  const theme = useTheme()
  
  return (
    <List sx={{ width: '100%', maxWidth: '100%', maxHeight: maxHeight, overflow: 'auto' }}>
      {newEntradaList.map((item, index) =>
        <ListItem
          key={index}
          secondaryAction={enabledButtons &&
            <>
              <IconButton onClick={() => handleEditEntrada(item, index)}>
                <Iconify 
                  icon="eva:edit-fill" 
                  width={25}
                  height={25} 
                />
              </IconButton>
              <IconButton  onClick={() => handleRemoveEntrada(index)}>
                <Iconify 
                  sx={{color: theme.palette.error.main}}
                  icon="eva:close-fill" 
                  width={25}
                  height={25} 
                />
              </IconButton>
            </>
          }
        >
          <ListItemText 
            primary={item.produto_nome}
            secondary={`Quantidade: ${item.qtd} | Valor unitário: R$ ${fCurrency(item.valor_unitario)} | Total: R$ ${fCurrency(item.valor_unitario * item.qtd)}`}
          />
        </ListItem>
      )}
    </List>
  )
}