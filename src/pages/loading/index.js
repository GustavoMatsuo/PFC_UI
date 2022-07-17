import { styled } from '@mui/material/styles'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './loading.css'

const LoaderContainer = styled('div')(({ theme }) => ({
  height: '100vh',
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}))

export default function Loading() {
  useEffect(() => {
    verifyAuth()
  }, [])

  const navigate = useNavigate()

  const verifyAuth = () => {
    const isLoggedIn = localStorage.getItem("token")
    setTimeout(() => { 
      if(isLoggedIn){
        navigate('/dashboard/home', { replace: true })
      }else{
        navigate('/login', { replace: true })
      }
    }, 800)
  }

  return (
    <LoaderContainer>
      <div class="spinner">
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
      </div>
    </LoaderContainer>
  )
}