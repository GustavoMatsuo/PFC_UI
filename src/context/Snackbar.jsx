import {
  createContext,
  useMemo,
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
    setTimeout(closeSnackBar, 6000)
  }

  const closeSnackBar = () => {
    setSnackBar({
      type: "",
      message: ""
    })
    setIsOpen(false)
  }

  const contextValue = useMemo(() => ({
    isOpen,
    snackBar,
    showSnack,
  }), [isOpen, snackBar])

  return (
    <SnackBarContext.Provider value={contextValue}>
      <Snackbar
        open={contextValue.isOpen}
        sx={{ minWidth: '240px'}}
        anchorOrigin={{ vertical:'bottom', horizontal:'center' }}
      >
        <Alert 
          onClose={closeSnackBar} 
          severity={contextValue.snackBar.type} 
          sx={{ width: '100%' }}
        >
          {contextValue.snackBar.message}
        </Alert>
      </Snackbar>
      {children}
    </SnackBarContext.Provider>
  )
}