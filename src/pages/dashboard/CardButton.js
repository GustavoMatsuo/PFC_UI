import { Button, Card, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'

CardButton.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onClick: PropTypes.func,
  btnText: PropTypes.string
}

const CardWrapper = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: "100%",
  width: '100%',
  padding: theme.spacing(2),
}))

export function CardButton({
  title,
  subtitle,
  onClick,
  btnText
}) {
  return (
    <CardWrapper>
      <div>
        <Typography variant="h5" align='left'>
          {title}
        </Typography>
        <Typography variant="subtitle2" align='left'>
          {subtitle}
        </Typography>
      </div>
      <Button
        size="large" 
        color="primary" 
        variant="contained" 
        fullWidth
        onClick={onClick}
      >
        {btnText}
      </Button>
      <span/>
    </CardWrapper>
  )     
}