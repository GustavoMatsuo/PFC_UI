import {
  createContext,
  useState
} from "react"
import { Alert, Snackbar } from "@mui/material"

export const SnackBarContext = createContext()

export const SnackBarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [snackBar, setSnackBar] = useState({
    type: "",
    message: ""
  })

  const showSnack = (message="", type="") => {
    let validType = "info"
    if(
      type === "primary" || 
      type === "success" || 
      type === "error" || 
      type === "warning" || 
      type === "info"
    ){
      validType = type
    }

    setSnackBar({
      type: validType,
      message
    })
    setIsOpen(true)
  }

  const closeSnackBar = () => {
    setSnackBar({
      type: "",
      message: ""
    })
    setIsOpen(false)
  }

  return (
    <SnackBarContext.Provider value={{ showSnack }}>
      <Snackbar
        open={isOpen}
        autoHideDuration={6000}
        onClose={closeSnackBar}
        message={snackBar.message}
        sx={{ minWidth: '240px'}}
      >
        <Alert onClose={closeSnackBar} severity={snackBar.type} sx={{ width: '100%' }}>
          {snackBar.message}
        </Alert>
      </Snackbar>
      {children}
    </SnackBarContext.Provider>
  )
}