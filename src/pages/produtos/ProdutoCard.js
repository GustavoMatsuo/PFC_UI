import PropTypes from 'prop-types'
import { Box, Card, Typography, Stack, useTheme, Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles'
import { fCurrency } from '../../utils/formatNumber'
import { CardContextMenu } from 'src/components/CardContextMenu'

import IMG_MOCK from '../../assets/images/barcode.svg'
import Label from 'src/components/Label'

const ProductImgStyle = styled('img')({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  objectFit: 'cover',
  position: 'absolute',
})

ProdutoCard.propTypes = {
  product: PropTypes.object,
  onChangeStatus: PropTypes.func,
  onEdit: PropTypes.func
}

export function ProdutoCard({ 
  product,
  onChangeStatus,
  onEdit
}) {
  const theme = useTheme()

  const { nome, valor_unitario, status, estoque_minimo, estoque, categoria } = product

  const calcEstoque = estoque.qtd > estoque_minimo

  return (
    <Card>
      <CardContextMenu
        status={status}
        handleChangeStatus={onChangeStatus}
        handleEdit={onEdit}
        children={
          <Box sx={{ pt: '100%', position: 'relative'}}>
            <Label 
              sx={{
                position: 'absolute',
                top: 10,
                left: 10
              }}
              variant="ghost" 
              color={(!status && 'error') || 'success'
            }>
              {status? 'Ativo':'Inativo'}
            </Label>
            <ProductImgStyle alt={nome} src={IMG_MOCK} />
          </Box>
        }
      />

      <Stack spacing={1} sx={{ p: 2 }}>
        <Typography variant="subtitle1" noWrap>
          {nome}
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="flex-start">
          <Label variant="ghost">
            {categoria.nome}
          </Label>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Tooltip title={`Estoque mínimo: ${estoque_minimo}`} placement="bottom" arrow>
            <Typography 
              variant="subtitle2" 
              color={calcEstoque? 
                theme.palette.text
                :
                theme.palette.error.main
              }
            >
              Quantidade: {estoque.qtd}
            </Typography>
          </Tooltip>
          <Typography variant="subtitle2">
            R$&nbsp;{fCurrency(valor_unitario)}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  )
}
