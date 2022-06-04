import { Link as RouterLink } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import { Button, Typography, Container } from '@mui/material'

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0)
}))

export default function Page404() {
  return (
    <Container>
      <ContentStyle sx={{ textAlign: 'center', alignItems: 'center' }}>
        <Typography variant="h3" paragraph>
          Ops! Página não encontrada.
        </Typography>

        <Typography sx={{ color: 'text.secondary' }} mb={5}>
          Desculpe, mas não conseguimos encontrar a página que você está procurando.
        </Typography>

        <Button to="/dashboard/user" size="large" variant="contained" component={RouterLink}>
          Voltar
        </Button>
      </ContentStyle>
    </Container>
  )
}
