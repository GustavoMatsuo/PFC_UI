import PropTypes from 'prop-types'
import { Box, Card, Typography } from '@mui/material'

import ReactApexChart from 'react-apexcharts'
import { BaseOptionChart } from '../../components/chart'
import { merge } from 'lodash'

CardProduto.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  sx: PropTypes.object,
}

const MOCK_CHART = {
  label: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  data: [
    {
      name: 'Entradas',
      type: 'area',
      fill: 'gradient',
      data: [80, 60, 22, 10, 29, 44]
    }
  ]
}

export function CardProduto({ 
  title,
  color = 'primary', 
  sx, 
  ...other 
}) {
  const mockChartOptions = merge(BaseOptionChart(), {
    fill: { type: MOCK_CHART.data.map((i) => i.fill) },
    labels: MOCK_CHART.label,
    yaxis: { show: false },
    xaxis: {
      type: 'category'
    },
    tooltip: {
      shared: true,
      intersect: false
    }
  })

  return (
    <Card
      sx={{...sx}}
      {...other}
    >
      <Box sx={{ padding: 2, pb: 0 }}>
        <Typography variant="h5" align='left'>
          Últimas entradas
        </Typography>
        <Typography variant="subtitle2" align='left' sx={{ opacity: 0.75 }}>
          Registro dos últimos 6 meses
        </Typography>
        <ReactApexChart 
          options={mockChartOptions}
          series={MOCK_CHART.data} 
          type="area" 
          height={200} 
        />
      </Box>
    </Card>
  );
}
