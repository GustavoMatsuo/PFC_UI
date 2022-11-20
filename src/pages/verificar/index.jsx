import { styled } from '@mui/material/styles'
import { Typography, Card } from '@mui/material'
import useResponsive from '../../hooks/useResponsive'
import { useNavigate, useParams } from 'react-router-dom'
import AnimatedBackground from '../../components/animatedBackground'
import { useEffect } from 'react'
import { api_external } from '../../config/api'
import { VerificarForm } from './VerificarForm'

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

export default function Verificar() {
  let { token } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    validateToken()
  },[token])

  const validateToken = async() => {
    try {
      let config = {
        headers: {
          Authorization: token
        }
      }
      const res = await api_external.post("/usuario/auth", null, config)
    }catch(e) {
      navigate('/login', { replace: true })
    }
  }

  const mdUp = useResponsive('up', 'md')

  return (
    <>
      <RootStyle>
        {mdUp? (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 5, mb: 5 }}>
              Crie sua senha e aproveite toda facilidade do nosso sistema.
            </Typography>
          </SectionStyle>
        ): (<span/>)}
        <ContentStyle>
          <Card sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
              Crie sua senha
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 3 }}>
              Essa senha será usa para logar no sistema
            </Typography>
            <VerificarForm token={token}/>
          </Card>
        </ContentStyle>
        {!mdUp && (<span/>)}
      </RootStyle>
      <AnimatedBackground />
    </>
  )
}
