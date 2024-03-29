import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { useFormik, Form, FormikProvider } from 'formik'
import { Grid, Button, Typography } from '@mui/material'
import { fCurrency } from 'src/utils/formatNumber'
import api from 'src/config/api'
import { LoadingButton } from '@mui/lab'
import { useContext, useState } from 'react'
import { ModalCliente } from 'src/modals/modalCliente'
import { SnackBarContext } from 'src/context/Snackbar'

VendaForm.propTypes = {
  vendaList: PropTypes.array,
  subtotal: PropTypes.number,
  desconto: PropTypes.number,
  clearVenda: PropTypes.func
}

export function VendaForm({
  vendaList,
  subtotal,
  desconto,
  clearVenda
}) {
  const [cliente, setCliente] = useState(null)
  const [isOpenCliente, setIsOpenCliente] = useState(false)
  
  const { showSnack } = useContext(SnackBarContext)

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      cliente: cliente,
      vendaList: vendaList
    },
    onSubmit: async(values, actions) => {
      try {
        actions.setSubmitting(true)
       
        if(values.vendaList.length <= 0){
          return showSnack("Nenhum produto adicionado na venda", "warning")
        }

        if(!values.cliente) {
          return showSnack("Nenhum cliente selecionado na venda", "warning")
        }

        const saidaList = await values.vendaList.map(item => {
          return {
            produto: item.id_produto,
            qtd: item.qtd,
            desconto: item.desconto,
            valor_unitario: fCurrency(item.valor_unitario)
          }
        })
        const vendaFormatted = {
          cliente: values.cliente.id_cliente,
          saidas: saidaList
        }
        await api.post('/venda', vendaFormatted)
        handleClear()
        showSnack("Venda realizada com sucesso", "success")
      } catch(e) {
        showSnack("Falha ao realizar a venda", "error")
      } finally {
        actions.setSubmitting(false)
      }
    }
  })

  const handleClear = () => {
    clearVenda()
    setCliente(null)
    setFieldValue("cliente", null)
  }

  const { handleSubmit, isSubmitting, setFieldValue, values } = formik

  const Item = (title, value) => {
    return (
      <>
        <Typography style={{flexGrow: 1, fontWeight: 'bold'}}>{title}:</Typography>
        <Typography>R$ {value}</Typography>
      </>
    )
  }
  
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Button 
              fullWidth 
              size="large" 
              variant="text" 
              onClick={() => setIsOpenCliente(true)}
            >
              {values.cliente === null? "SELECIONE O CLIENTE":String(values.cliente.nome).toUpperCase()}
            </Button>
          </Grid>
          <Grid item xs={12} display='flex'>
            {Item('SubTotal', subtotal)}
          </Grid>
          <Grid item xs={12} display='flex'>
            {Item('Desconto', desconto)}
          </Grid>
          <Grid item xs={12} display='flex'>
            {Item('Total', fCurrency(subtotal - desconto))}
          </Grid>
          <Grid item xs={12}>
            <LoadingButton 
              fullWidth 
              size="large" 
              type="submit" 
              variant="contained" 
              loading={isSubmitting}
            >
              Finalizar
            </LoadingButton>
          </Grid>
        </Grid>
      </Form>
      <ModalCliente
        isOpen={isOpenCliente}
        handleClose={() => setIsOpenCliente(false)}
        setCliente={cliente => setCliente(cliente)}
      />
    </FormikProvider>
  )
}
