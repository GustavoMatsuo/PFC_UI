import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Container, 
  Grid,
} from '@mui/material'
import { PageHeaderList } from 'src/components/PageHeaderList'
import { ModalCustom } from 'src/components/ModalCustom'
import { ModalClienteForm } from './ModalClienteForm'
import api from 'src/config/api'

ModalCliente.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  setCliente: PropTypes.func,
}

export function ModalCliente({ isOpen, handleClose, setCliente }) {
  const [clienteList, setClienteList] = useState([])

  useEffect(() => {
    getClienteList()
  },[])

  const getClienteList = async() => {
    const { data } = await api.get('/cliente/list')
    setClienteList(data)
  }

  return (
    <Container>
      <ModalCustom
        isOpen={isOpen}
        handleClose={handleClose}
        modalWidth='550px'
        content={
          <Grid>
            <PageHeaderList title='Cliente'/>
            <ModalClienteForm
              handleClose={handleClose}
              clienteList={clienteList}
              setCliente={setCliente} 
            />
          </Grid>
        }   
      />  
    </Container>
  )
}
