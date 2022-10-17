import { useEffect, useState, useRef } from 'react'
import { Grid, Typography } from '@mui/material'
import { VendaChart } from './VendaChart'
import { InformationTimeline } from './InformationTimeline'
import api from 'src/config/api'
import { fDateSimple } from 'src/utils/formatTime'
import { CardButton } from './CardButton'

export default function Dashboard() {
  const [contentHeight, setContentHeight] = useState(0)
  const [divHeight, setDivHeight] = useState(0)

  let contentRef = useRef(null)
  let divRef = useRef(null)

  useEffect(() => {
    if(contentRef.current !== null) {
      setDivHeight(divRef.current.offsetHeight)
      setContentHeight(contentRef.current.offsetHeight)
    }
  }, [contentRef.current, divRef.current])

  const userData = JSON.parse(localStorage.getItem('user_data'))

  const getInventario = async() => {
    const filename = `inventario_${fDateSimple(new Date())}.xlsx`
    await api.get('/estoque/inventario', {
      responseType: 'blob',
      headers: {
        'Content-Disposition': `attachment; filename=${filename}`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
    })
    .catch((error) => console.log(error))
  }

  const getDaily = async() => {
    const filename = `daily_${fDateSimple(new Date())}.xlsx`
    await api.get('/estoque/daily', {
      responseType: 'blob',
      headers: {
        'Content-Disposition': `attachment; filename=${filename}`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
    })
    .catch((error) => console.log(error))
  }

  return (
    <Grid container sx={{ height: '100%' }}>
      <Grid item xs={12} sm={12} md={8} sx={{ height: '100%' }}
        ref={el => { contentRef.current = el }}
      >
        <div ref={el => { divRef.current = el }}>
          <Typography variant="h2" align='left' color='grey.800'>
            Bem vindo de volta
          </Typography>
          <Typography variant="h3" align='left' color='grey.700' sx={{ mb: 3 }}>
            {userData && userData.nome? userData.nome:""}
          </Typography>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={12} md={4}>
              <CardButton
                title="Resumo do dia"
                subtitle="Gerar relatório diário."
                onClick={getDaily}
                btnText="Baixar"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <CardButton
                title="Inventário"
                subtitle="Gerar relatório de inventário."
                onClick={getInventario}
                btnText="Baixar"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <CardButton
                title="..."
                subtitle="..."
                onClick={() => {}}
                btnText="Baixar"
              />
            </Grid>
          </Grid>
        </div>
        <VendaChart height={(contentHeight - divHeight) - 103}/>
      </Grid>
      <Grid item xs={12} sm={12} md={4} sx={{ height: '100%' }}>
        <InformationTimeline/>
      </Grid>
    </Grid>
  )
}