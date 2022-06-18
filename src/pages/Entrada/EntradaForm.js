import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { useFormik, Form, FormikProvider } from 'formik'
import { TextField, Grid, Autocomplete, Button } from '@mui/material'

EntradaForm.propTypes = {
  isEdit: PropTypes.bool,
  cancelEdit: PropTypes.func,
  selectedEntrada: PropTypes.object,
  produtoList: PropTypes.array,
  handleAddEntrada: PropTypes.func,
  handleUpdateEntrada: PropTypes.func,
}

export function EntradaForm({
  isEdit,
  cancelEdit,
  selectedEntrada,
  produtoList,
  handleAddEntrada,
  handleUpdateEntrada
}) {
  const EntradaSchema = Yup.object().shape({
    produto: Yup.object()
      .typeError('Produto é obrigatório')
      .shape({
        id_produto: Yup.string().required("Produto é obrigatório"),
        nome: Yup.string().required("Produto é obrigatório"),
      }),
    qtd: Yup.number()
      .typeError('Quantidade deve ser um número')
      .required("Quantidade é obrigatório"),
    valor_unitario: Yup.number()
      .typeError('Valor Unitário deve ser um número')
      .required("Valor Unitário é obrigatório"),
  })

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      produto: isEdit? selectedEntrada.produto:null,
      qtd: isEdit? selectedEntrada.qtd:'',
      valor_unitario: isEdit? selectedEntrada.valor_unitario:''
    },
    validationSchema: EntradaSchema,
    onSubmit: async(values, actions) => {
      try {
        const produto_nome = produtoList.find(item => item.id_produto == values.produto.id_produto)
        if(produto_nome && produto_nome.nome){
          isEdit? 
            handleUpdateEntrada({...values, produto_nome: produto_nome.nome})
            :
            handleAddEntrada({...values, produto_nome: produto_nome.nome})
        }
        clearForm()
      } catch(e) {
        // const {  } = e.response
        console.log(e.response)
      }
    }
  })

  const { errors, touched, values, handleSubmit, getFieldProps, setFieldValue, resetForm } = formik

  const clearForm = () => {
    cancelEdit()
    resetForm({ values: { produto: null, valor_unitario: '', qtd: ''}})
  }
  
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              isOptionEqualToValue={(option, value) => option == value}
              value={values.produto}
              onChange={(event, newValue) => setFieldValue("produto", newValue)}
              options={produtoList}
              getOptionLabel={(option) => option.nome}
              renderInput={(params) =>
                <TextField
                  {...params}
                  fullWidth
                  label="Produto"
                  error={Boolean(touched.produto && errors.produto)}
                  helperText={touched.produto && errors.produto}
                />
              }
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Quantidade"
              {...getFieldProps('qtd')}
              error={Boolean(touched.qtd && errors.qtd)}
              helperText={touched.qtd && errors.qtd}
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Valor Unitário"
              {...getFieldProps('valor_unitario')}
              error={Boolean(touched.valor_unitario && errors.valor_unitario)}
              helperText={touched.valor_unitario && errors.valor_unitario}
            />
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth size="large" type="submit" variant="contained">
              {isEdit? 'Atualizar':'Adicionar'}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth size="large" color="error" variant="contained" onClick={clearForm}>
            {isEdit? 'Cancelar':'Limpar'}
            </Button>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  )
}
