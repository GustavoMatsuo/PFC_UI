import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import { 
  Toolbar, 
  OutlinedInput, 
  InputAdornment,
  Button 
} from '@mui/material'
import Iconify from './Iconify'

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}))

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 320,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: '65%', boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}))

TableToolbar.propTypes = {
  placeholder: PropTypes.string.isRequired,
  filterName: PropTypes.string.isRequired,
  onFilterName: PropTypes.func.isRequired,
  buttonRight: PropTypes.func,
  buttonRightLabel: PropTypes.string
}

export function TableToolbar({ placeholder, filterName, onFilterName, buttonRight, buttonRightLabel }) {
  return (
    <RootStyle>
      <SearchStyle
        value={filterName}
        onChange={onFilterName}
        placeholder={placeholder}
        startAdornment={
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
          </InputAdornment>
        }
      />
      {buttonRight && buttonRightLabel && 
        <Button
          size="large" 
          color="primary" 
          variant="contained" 
          onClick={buttonRight}
        >
          {buttonRightLabel}
        </Button>
      }
    </RootStyle>
  )
}
