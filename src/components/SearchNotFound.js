import PropTypes from 'prop-types'
import { Paper, Typography } from '@mui/material'

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
}

export default function SearchNotFound({ searchQuery = '', ...other }) {
  const isSearch = searchQuery.length > 0? true:false
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        Nada encontrado
      </Typography>
      {isSearch && 
        <>
          <Typography variant="body2" align="center">
            Não foram encontrados resultados para &nbsp; 
            <strong>&quot;{searchQuery}&quot;</strong>. 
          </Typography>
          <Typography variant="body2" align="center">
            Tente verificar se há erros de digitação ou usar palavras completas.
          </Typography>
        </>
      }
    </Paper>
  )
}
