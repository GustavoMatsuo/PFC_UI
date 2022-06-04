import { styled } from '@mui/material/styles'
import { Container, Typography } from '@mui/material'
import { LoginForm } from './LoginForm'

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}))

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}))

export default function Login() {
  return (
    <RootStyle>
      <Container maxWidth="sm">
        <ContentStyle>
          <Typography variant="h4" gutterBottom>
            Entrar
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 3 }}>Coloque seus dados abaixo</Typography>
          <LoginForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  )
}
