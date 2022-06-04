import PropTypes from 'prop-types'
import { Box, Card, Typography, Stack } from '@mui/material'
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
  const { nome, valorUnitario, status } = product

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

      <Stack spacing={2} sx={{ p: 2 }}>
        <Typography variant="subtitle1" noWrap>
          {nome}
        </Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2">
              R$&nbsp;{fCurrency(valorUnitario)}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  )
}
