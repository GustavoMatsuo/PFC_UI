import PropTypes from 'prop-types'
import { TableBody, TableRow, TableCell } from '@mui/material'
import SearchNotFound from './SearchNotFound'

TableNotFound.propTypes = {
  filterProps: PropTypes.string
}

export function TableNotFound({ filterProps }) {
  return (
    <TableBody>
      <TableRow>
        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
          <SearchNotFound searchQuery={filterProps} />
        </TableCell>
      </TableRow>
    </TableBody>
  )
}
