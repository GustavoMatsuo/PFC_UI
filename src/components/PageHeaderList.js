import PropTypes from 'prop-types'
import { Stack, Typography, Button } from '@mui/material'
import Iconify from './Iconify'

PageHeaderList.propTypes = {
  title: PropTypes.string,
  buttonTitle: PropTypes.string,
  addButton: PropTypes.func
}

export function PageHeaderList({
  title,
  buttonTitle,
  addButton,
}) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h4" noMargin>
        {title}
      </Typography>
      <Button variant="contained" onClick={addButton} startIcon={<Iconify icon="eva:plus-fill" />}>
        {buttonTitle}
      </Button>
    </Stack>
  )
}
