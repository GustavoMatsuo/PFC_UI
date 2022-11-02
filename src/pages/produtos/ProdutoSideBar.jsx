import PropTypes from 'prop-types'
import {
  Box,
  Stack,
  Button,
  Drawer,
  Divider,
  Checkbox,
  FormGroup,
  IconButton,
  Typography,
  FormControlLabel,
} from '@mui/material'
import Iconify from 'src/components/Iconify'
import Scrollbar from 'src/components/Scrollbar'

ProdutoSideBar.propTypes = {
  isOpenFilter: PropTypes.bool,
  onCloseFilter: PropTypes.func,
  categoriaList: PropTypes.array,
  onChangeCategoria: PropTypes.func,
  categoriaSelected: PropTypes.array,
  onClear: PropTypes.func
}

export function ProdutoSideBar({ 
  isOpenFilter, 
  onCloseFilter,
  categoriaList,
  onChangeCategoria,
  categoriaSelected,
  onClear
}) {
  return (    
    <Drawer
      anchor="right"
      open={isOpenFilter}
      onClose={onCloseFilter}
      PaperProps={{
        sx: { 
          width: 280, 
          border: 'none', 
          overflow: 'hidden',
          borderTopLeftRadius: '16px',
          borderBottomLeftRadius: '16px'
        }
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 1 }}>
        <Typography variant="subtitle1" sx={{ ml: 1 }}>
          Categorias
        </Typography>
        <IconButton onClick={onCloseFilter}>
          <Iconify icon="eva:close-fill" width={20} height={20} />
        </IconButton>
      </Stack>
      
      <Divider/>
      
      <Scrollbar>
        <FormGroup sx={{p:3}}>
          {categoriaList && categoriaList.map(item => {
            const checked = categoriaSelected.some(cat => cat == item.id_categoria)
            return (
              <FormControlLabel
                checked={checked} 
                key={item.nome} 
                control={
                  <Checkbox 
                    onChange={() => onChangeCategoria(item.id_categoria)} 
                  />
                } 
                label={item.nome} 
              />
            )
          })}
        </FormGroup>
      </Scrollbar>

      <Box sx={{p: 2}}>
        <Button
          fullWidth
          size="large"
          color="inherit"
          variant="outlined"
          onClick={onClear}
        >
          Limpar
        </Button>
      </Box>
    </Drawer>
  )
}
