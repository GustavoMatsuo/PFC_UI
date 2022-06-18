import { BaseOptionChartStyle } from './components/chart/BaseOptionChart'
import Router from './routes'
import ThemeProvider from './theme'

export default function App() {
  return (
    <ThemeProvider>
      <BaseOptionChartStyle />
      <Router />
    </ThemeProvider>
  )
}
