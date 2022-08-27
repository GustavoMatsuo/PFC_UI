import { BaseOptionChartStyle } from './components/chart/BaseOptionChart'
import { SnackBarContext, SnackBarProvider } from './context/Snackbar'
import Router from './routes'
import ThemeProvider from './theme'

export default function App() {
  return (
    <ThemeProvider>
      <SnackBarProvider>
        <BaseOptionChartStyle />
        <Router />
      </SnackBarProvider>
    </ThemeProvider>
  )
}
