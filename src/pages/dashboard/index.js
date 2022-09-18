import { useEffect, useState, useRef } from 'react'
import { Card, Grid, Typography } from '@mui/material'
import { VendaChart } from './VendaChart'
import { InformationTimeline } from './InformationTimeline'

export default function Dashboard() {
  const [divHeight, setDivHeight] = useState(0)

  let contentRef = useRef(null)

  useEffect(() => {
    if(contentRef.current != null) {
      setDivHeight(contentRef.current.offsetHeight)
    }
  }, [contentRef])

  const userData = JSON.parse(localStorage.getItem('user_data'))

  return (
    <Grid container sx={{ height: '100%'}}>
      <Grid 
        item xs={12} sm={12} md={8} 
        sx={{ height: '100%' }}
        ref={el => { contentRef.current = el }}
      >
        <div style={{ height: '20%', display: 'flex', justifyContent  : 'center', flexDirection: 'column' }}>
          <Typography variant="h2" align='left' color='grey.800'>
            Bem vindo de volta
          </Typography>
          <Typography variant="h3" align='left' color='grey.700'>
            {userData && userData.nome? userData.nome:""}
          </Typography>
        </div>
        <Grid container spacing={3} sx={{ height: '30%', mb: 3}}>
          <Grid item xs={12} sm={12} md={4} sx={{ height: "100%" }}>
            <Card style={{height: "100%", width: '100%'}}/>
          </Grid>
          <Grid item xs={12} sm={12} md={4} sx={{ height: "100%" }}>
            <Card style={{height: "100%", width: '100%'}}/>
          </Grid>
          <Grid item xs={12} sm={12} md={4} sx={{ height: "100%" }}>
            <Card style={{height: "100%", width: '100%'}}/>
          </Grid>
        </Grid>
        <VendaChart height={(divHeight / 2) - 77}/>
      </Grid>
      <Grid item xs={12} sm={12} md={4} sx={{ height: '100%' }}>
        <InformationTimeline/>
      </Grid>
    </Grid>
  )
}