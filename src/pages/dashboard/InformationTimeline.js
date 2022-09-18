import { useState, useRef, useEffect } from 'react'
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
import api from 'src/config/api'

export function InformationTimeline() {
  const [divHeight, setDivHeight] = useState(0)
  const [anuncioList, setAnuncioList] = useState([])

  let produtoRef = useRef(null)

  useEffect(() => {
    if(produtoRef.current != null) {
      setDivHeight(produtoRef.current.offsetHeight)
    }
  }, [produtoRef])

  useEffect(() => {
    getAnuncioList()
  }, [])

  const getAnuncioList = async() => {
    const { data } = await api.get('/anuncio/simple')
    setAnuncioList(data)
  }

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
          {anuncioList.map(item => {
            const { titulo, data, texto } = item
            return (
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color='primary'/>
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