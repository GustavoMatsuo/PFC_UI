import { styled } from '@mui/material/styles'
import { Container, Typography, Card } from '@mui/material'
import { LoginForm } from './LoginForm'
import useResponsive from '../../hooks/useResponsive'
import './AnimatedBackground.css'

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  width: '100vw',
  flexDirection: 'row',
  justifyContent: 'space-around'
}))

const ContentStyle = styled('div')(({ theme }) => ({
  width: 480,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}))

const SectionStyle = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

export default function Login() {
  const mdUp = useResponsive('up', 'md')

  return (
    <>
      <RootStyle>
        {mdUp? (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Olá! Seja bem-vindo.
            </Typography>
            {/* <img src="/static/illustrations/illustration_login.png" alt="login" /> */}
          </SectionStyle>
        ): (<span/>)}
        <ContentStyle>
          <Card sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
              Entrar
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 3 }}>Coloque seus dados abaixo</Typography>
            <LoginForm />
          </Card>
        </ContentStyle>
        {!mdUp && (<span/>)}
      </RootStyle>
      <div class='box'>
        <div class='wave -one'></div>
        <div class='wave -two'></div>
        <div class='wave -three'></div>
      </div>
    </>
  )
}
