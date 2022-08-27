import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Card, Typography, Box } from '@mui/material'
import { 
  Timeline,
  TimelineDot,
  TimelineItem,
  TimelineContent,
  TimelineSeparator,
  TimelineConnector 
} from '@mui/lab'
import { fDateSimple } from '../../utils/formatTime'

// InformationTimeline.propTypes = {
// }

const MOCK_LIST = [
  { 
    tipo: 'primary',
    titulo: "Titulo 1",
    data: '12/08/2022',
    texto: "Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend"
  },
  { 
    tipo: 'error',
    titulo: "Titulo",
    data: '12/08/2022',
    texto: "Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend"
  },
  { 
    tipo: 'primary',
    titulo: "Titulo",
    data: '12/08/2022',
    texto: "Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend"
  },
  { 
    tipo: 'primary',
    titulo: "Titulo",
    data: '12/08/2022',
    texto: "Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend"
  },
  { 
    tipo: 'primary',
    titulo: "Titulo",
    data: '12/08/2022',
    texto: "Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend"
  },
  { 
    tipo: 'primary',
    titulo: "Titulo",
    data: '12/08/2022',
    texto: "Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend"
  },
  { 
    tipo: 'primary',
    titulo: "Titulo ultimo",
    data: '12/08/2022',
    texto: "Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend Texto para moco no frontend"
  }
]

export function InformationTimeline() {
  const [divHeight, setDivHeight] = useState(0)

  let produtoRef = useRef(null)

  useEffect(() => {
    if(produtoRef.current != null) {
      setDivHeight(produtoRef.current.offsetHeight)
    }
  }, [produtoRef])

  return (
    <Card  sx={{height: '100%', ml: 3, p: 3, position: 'relative'}} >
      <div ref={el => { produtoRef.current = el }}>
        <Typography variant="h5" align='left'>
          Informações
        </Typography>
        <Typography 
          variant="subtitle2" 
          align='left'
          sx={{ 
            borderBottom: '1px dashed gray', 
            pb: 1.5, 
            opacity: 0.75
          }}
        >
          Informações uteis
        </Typography>
      </div>
      <Box
        sx={{
          '& .MuiTimelineItem-missingOppositeContent:before': {
            display: 'none',
          },
          overflowX: 'auto',
          position: 'absolute',
          top: `${divHeight+36}px`, 
          left: '24px',
          right: '24px',
          bottom: '24px'
        }}
      >
        <Timeline sx={{p: 0, m: 0}}>
          {MOCK_LIST.map(item => {
            const { tipo, titulo, data, texto } = item
            return (
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color={tipo || 'primary'} />
                  <TimelineConnector />
                </TimelineSeparator>
          
                <TimelineContent>
                  <Typography variant="subtitle2">{titulo} ({fDateSimple(data)})</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {texto}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            )
          })}
        </Timeline>
      </Box>
    </Card>
  )
}