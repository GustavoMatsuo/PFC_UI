import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { useFormik, Form, FormikProvider } from 'formik'
import { 
  TextField, 
  Grid,
  Button, 
  Typography
} from '@mui/material'
import api from '../../config/api'
import { useContext, useState } from 'react'
import { SnackBarContext } from 'src/context/Snackbar'
import { ModalCustom } from 'src/components/ModalCustom'

ModalAnuncioForm.propTypes = {
  closeForm: PropTypes.func,
  getAnuncioList: PropTypes.func
}

export function ModalAnuncioForm({
  closeForm,
  getAnuncioList
}) {
  const [confirm, setConfirm] = useState(false)

  const { showSnack } = useContext(SnackBarContext)

  const ModalAnuncioSchema = Yup.object().shape({
    titulo: Yup.string().required("Titulo é obrigatório").min(3, "Titulo esta muito curto"),
    texto: Yup.string().required('Texto é obrigatório')
  })

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      titulo: "",
      texto: "",
    },
    validationSchema: ModalAnuncioSchema,
    onSubmit: async(values, actions) => {
      try {
        setConfirm(true)        
      }catch(e) {
        showSnack("Falha ao criar anúncio", "error")      
      }
    }
  })

  const { errors, touched, values, handleSubmit, getFieldProps, resetForm } = formik

  const handleSubmitAfterConfirm = async() => {
    await api.post('/anuncio', values)
    setConfirm(false)
    handleClose()
    getAnuncioList()
    showSnack("Anúncio criado com sucesso", "success")
  }

  const handleClose = () => {
    closeForm()
    resetForm()
  }
  
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>         
            <TextField
              fullWidth
              type="text"
              label="Titulo"
              {...getFieldProps('titulo')}
              error={Boolean(touched.titulo && errors.titulo)}
              helperText={touched.titulo && errors.titulo}
            />
          </Grid>
          <Grid item xs={12}>         
            <TextField
              fullWidth
              type="text"
              label="Texto"
              multiline
              maxRows={4}
              rows={4}
              {...getFieldProps('texto')}
              error={Boolean(touched.texto && errors.texto)}
              helperText={touched.texto && errors.texto}
            />
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth size="large" type="submit" variant="contained">
              Cadastrar
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth size="large" color='error' variant="contained" onClick={handleClose}>
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </Form>
      <ModalCustom
        isOpen={confirm}
        handleClose={() => setConfirm(false)}
        modalWidth='360px'
        content={
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h5'>
                Atencão! 
              </Typography>
              </Grid>     
              <Grid item xs={12}>
                <Typography>
                  Não é possivel editar nem remover o Anúncio após a criação  
                </Typography>  
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth size="large" onClick={handleSubmitAfterConfirm} variant="contained">
                  COMPREENDO, CADASTRAR ANÚNCIO
                </Button>
              </Grid>
          </Grid>
        }
      />
    </FormikProvider>
  )
}
