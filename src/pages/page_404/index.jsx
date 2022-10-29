import { Link as RouterLink } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import { Button, Typography, Container } from '@mui/material'
import IMG_MOCK from '../../assets/images/crash-amico.svg'

const ContentStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(12, 0),
  textAlign: 'center', 
}))

export default function Page404() {
  return (
    <Container>
      <ContentStyle>
        <div 
          style={{
            height: '50vh',
            width: '100%',
            backgroundImage: `url(${IMG_MOCK})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <Typography variant="h3" paragraph>
          Ops! Página não encontrada.
        </Typography>

        <Typography sx={{ color: 'text.secondary' }} mb={3}>
          Desculpe, mas não conseguimos encontrar a página que você está procurando.
        </Typography>

        <Button to="/dashboard/home" size="large" variant="contained" component={RouterLink}>
          Voltar para home
        </Button>
      </ContentStyle>
    </Container>
  )
}
