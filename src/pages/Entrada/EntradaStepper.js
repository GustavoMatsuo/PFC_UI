import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  styled,
  Stepper,
  Step,
  StepLabel,
  Button
} from '@mui/material'

const ContentDiv = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}))

EntradaStepper.propTypes = {
  stepComponents: PropTypes.array,
  nextDisabled: PropTypes.bool,
  loading: PropTypes.bool
}

export function EntradaStepper({
  stepComponents,
  nextDisabled,
  loading
}) {
  const [activeStep, setActiveStep] = useState(0)

  const stepsLabel = [
    'Adicionar produtos',
    'Finalizar entrada'
  ]

  const actioStep = () => {
    const newStep = activeStep === 0? 1:0
    setActiveStep(newStep)
  }

  return (
    <ContentDiv>
      <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
        {stepsLabel.map((label) => (
          <Step key={label}>
            <StepLabel sx={{ color: 'red' }}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {stepComponents[activeStep]}
      {nextDisabled && <Button 
        fullWidth 
        size="large" 
        color="inherit" 
        variant="contained"
        sx={{mt: 1}}
        onClick={actioStep}
        disabled={loading}
      >
        {activeStep === 0? 'Continuar':'Voltar'}
      </Button>}
    </ContentDiv>
  )
}