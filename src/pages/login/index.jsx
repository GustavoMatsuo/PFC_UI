import { styled } from '@mui/material/styles'
import { Typography, Card, Button } from '@mui/material'
import { LoginForm } from './LoginForm'
import useResponsive from '../../hooks/useResponsive'
import AnimatedBackground from 'src/components/animatedBackground'
import { useState } from 'react'
import { ForgetForm } from './ForgetForm'

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
}))

const ButtonToggle = styled(Button)(({ theme }) => ({
  textTransform: 'none'
}))

export default function Login() {
  const [loginOrReset, setLoginOrReset] = useState(true)

  const mdUp = useResponsive('up', 'md')

  return (
    <>
      <RootStyle>
        {mdUp? (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 5, mb: 5 }}>
              Olá! Seja bem-vindo.
            </Typography>
          </SectionStyle>
        ): (<span/>)}
        <ContentStyle>
          <Card sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
              {loginOrReset? 'Entrar':'Recuperar senha'}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 3 }}>
              {loginOrReset? 'Coloque seus dados abaixo':'Digite seu email para redefinir a senha'}
            </Typography>
            {loginOrReset? 
              <LoginForm />
              :
              <ForgetForm
                toggleForm={() => setLoginOrReset(true)}
              />
            }
            <ButtonToggle
              fullWidth 
              size="large" 
              color="primary" 
              variant="text" 
              onClick={() => setLoginOrReset(!loginOrReset)}
            >
              {loginOrReset? 'Esqueceu a senha?':'Login'}
            </ButtonToggle>          
          </Card>
        </ContentStyle>
        {!mdUp && (<span/>)}
      </RootStyle>
      <AnimatedBackground />
    </>
  )
}
