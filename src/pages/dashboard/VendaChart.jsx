import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Box, Card, Typography } from '@mui/material'
import ReactApexChart from 'react-apexcharts'
import { BaseOptionChart } from '../../components/chart'
import { merge } from 'lodash'
import api from 'src/config/api'
import { fDateChartMonth } from 'src/utils/formatTime'

VendaChart.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  sx: PropTypes.object,
}

const INITIAL_DATA = {
  label: [],
  data: [
    {
      name: 'Vendas',
      type: 'area',
      fill: 'gradient',
      data: []
    }
  ]
}

export function VendaChart({ 
  title,
  color = 'primary', 
  height,
  sx, 
  ...other 
}) {
  const [vendasChartData, setVendasChartData] = useState(INITIAL_DATA)

  const mockChartOptions = merge(BaseOptionChart(), {
    fill: { type: vendasChartData.data.map((i) => i.fill) },
    labels: vendasChartData.label,
    yaxis: { show: false },
    xaxis: {
      type: 'category'
    },
    tooltip: {
      shared: true,
      intersect: false
    }
  })

  useEffect(() => {
    getVendasChart()
  }, [])

  const getVendasChart = async() => {
    const { data } = await api.get('/venda/chart')

    let newData = vendasChartData.data
    newData[0].data = data.data
    let newLabel = data.label.map(item => fDateChartMonth(item))

    setVendasChartData({
      data: newData,
      label: newLabel
    })
  }

  return (
    <Card sx={{...sx}} {...other}>
      <Box sx={{ padding: 2, pb: 0 }}>
        <Typography variant="h5" align='left'>
          Vendas
        </Typography>
        <Typography variant="subtitle2" align='left' sx={{ opacity: 0.75 }}>
          Registro dos últimos 6 meses
        </Typography>
        <ReactApexChart 
          options={mockChartOptions}
          series={vendasChartData.data} 
          type="area" 
          height={height} 
        />
      </Box>
    </Card>
  )
}
