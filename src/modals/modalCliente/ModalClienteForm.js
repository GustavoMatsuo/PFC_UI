import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { useFormik, Form, FormikProvider } from 'formik'
import { 
  TextField, 
  Grid, 
  FormControl, 
  Select,
  MenuItem, 
  InputLabel, 
} from '@mui/material'
import api from '../../config/api'
import { LoadingButton } from '@mui/lab'
import { useState } from 'react'

ModalClienteForm.propTypes = {
  handleClose: PropTypes.func,
  clienteList: PropTypes.array,
  setCliente: PropTypes.func,
}

export function ModalClienteForm({
  handleClose,
  clienteList,
  setCliente
}) {
  const [selectValue, setSelectValue] = useState("")

  const ModalClienteSchema = Yup.object().shape({
    nome: Yup.string().required("Nome é obrigatório").min(3, "Nome esta muito curto"),
    cpf: Yup.string().required('CPF é obrigatório'),
    cel: Yup.string().required('Celular é obrigatório')
  })

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id_cliente: "",
      nome: "",
      cpf: "",
      cel: ""
    },
    validationSchema: ModalClienteSchema,
    onSubmit: async(values, actions) => {
      try {
        if(values.id_cliente ==  "") {
          const {data} = await api.post('/cliente', values)
          setCliente(data.cliente)
        }else {
          setCliente(values)
        }
        handleClose()
      }catch(e) {
        console.log(e.response)
      }
    }
  })

  const { errors, touched, handleSubmit, getFieldProps, setFieldValue, resetForm, values } = formik

  const onSelectCliente = (idCliente) => {
    setSelectValue(idCliente)
    if(idCliente == "novo cliente" || idCliente.length < 5){
      resetForm()
    }else {
      const cliente = clienteList.find(item => item.id_cliente == idCliente)
      setFieldValue("id_cliente", cliente.id_cliente)
      setFieldValue("nome", cliente.nome)
      setFieldValue("cpf", cliente.cpf)
      setFieldValue("cel", cliente.cel)
    }
  }

  let valid = values.nome && values.cpf  && values.cel

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="cliente-select-label">
                Cliente
              </InputLabel>
              <Select
                labelId="cliente-select-label"
                label="Cliente"
                value={selectValue}
                onChange={value => onSelectCliente(value.target.value)}
              >
                <MenuItem value="novo cliente">Novo Cliente</MenuItem>
                {clienteList.map((item, index) => 
                  <MenuItem key={index} value={item.id_cliente}>{item.nome}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>         
            <TextField
              fullWidth
              type="text"
              label="Nome"
              disabled={values.id_cliente}
              {...getFieldProps('nome')}
              error={Boolean(touched.nome && errors.nome)}
              helperText={touched.nome && errors.nome}
            />
          </Grid>
          <Grid item xs={6}>         
            <TextField
              fullWidth
              type="number"
              label="cpf"
              {...getFieldProps('cpf')}
              error={Boolean(touched.cpf && errors.cpf)}
              helperText={touched.cpf && errors.cpf}
            />
          </Grid>
          <Grid item xs={6}>         
            <TextField
              fullWidth
              type="number"
              label="Celular"
              {...getFieldProps('cel')}
              error={Boolean(touched.cel && errors.cel)}
              helperText={touched.cel && errors.cel}
            />
          </Grid>
          <Grid item xs={12}>
            <LoadingButton 
              disabled={!valid} 
              fullWidth 
              size="large" 
              type="submit" 
              variant="contained"
            >
              Selecionar
            </LoadingButton>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  )
}
