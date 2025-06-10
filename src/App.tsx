import { createTheme, ThemeProvider } from '@mui/material'
import '@fontsource/inter/700.css'
import '@fontsource/inter/400.css'
import './styles/App.css'
import { appTheme } from './styles/Theme'
import Signup from './Signup'

const App = () => {
  const theme = () => createTheme(appTheme)

  return (
    <ThemeProvider theme={theme}>
      <Signup />
    </ThemeProvider>
  )
}

export default App
