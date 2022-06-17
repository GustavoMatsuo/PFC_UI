import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { useFormik, Form, FormikProvider } from 'formik'
import { TextField, Grid, FormControl, Select, MenuItem, FormHelperText, InputLabel, Button } from '@mui/material'
import api from '../../config/api'

ModalCategoriaForm.propTypes = {
  isEdit: PropTypes.bool,
  closeForm: PropTypes.func,
  selectedCategoria: PropTypes.object,
  getCategoriaList: PropTypes.func
}

export function ModalCategoriaForm({
  isEdit,
  closeForm,
  selectedCategoria,
  getCategoriaList
}) {
  const ModalCategoriaSchema = Yup.object().shape({
    nome: Yup.string().required("Nome é obrigatório").min(3, "Nome esta muito curto"),
    cor: Yup.string().required('Email é obrigatório')
  })

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id_categoria: isEdit? selectedCategoria.id_categoria:"",
      nome: isEdit? selectedCategoria.nome:"",
      cor: isEdit? selectedCategoria.cor:"",
      status: isEdit? selectedCategoria.status:null
    },
    validationSchema: ModalCategoriaSchema,
    onSubmit: async(values, actions) => {
      try {
        const reqType = isEdit? 'put':'post'
        await api[reqType]('/categoria', values)
        // const { status } = await api[reqType]('/categoria', values)
        // if(status == 201) {
          closeForm()
          getCategoriaList()
        // }
      }catch(e) {
        // const {  } = e.response
        console.log(e.response)
      }
    }
  })

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={9}>         
            <TextField
              fullWidth
              autoComplete="nome"
              type="text"
              label="Nome"
              {...getFieldProps('nome')}
              error={Boolean(touched.nome && errors.nome)}
              helperText={touched.nome && errors.nome}
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel error={Boolean(touched.cor && errors.cor)}>
                Cor
              </InputLabel>
              <Select
                label="Cor"
                {...getFieldProps('cor')}
                error={Boolean(touched.cor && errors.cor)}
              >
                <MenuItem value='F00'>Vermelho</MenuItem>
                <MenuItem value='0F0'>Verde</MenuItem>
                <MenuItem value='00F'>Azul</MenuItem>
              </Select>
              <FormHelperText error={Boolean(touched.cor && errors.cor)}>
                {touched.cor && errors.cor}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              {isEdit? 'Atualizar':'Cadastrar'}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth size="large" color='error' variant="contained" loading={isSubmitting} onClick={closeForm}>
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  )
}
