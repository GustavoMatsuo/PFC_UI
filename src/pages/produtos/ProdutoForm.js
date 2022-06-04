import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { useFormik, Form, FormikProvider } from 'formik'
import { TextField, Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import api from '../../config/api'

ProdutoForm.propTypes = {
  isEdit: PropTypes.bool,
  selectedProduto: PropTypes.object,
  closeModal: PropTypes.func,
  getProdutoList: PropTypes.func,
  fornecedorList: PropTypes.array,
  categoriaList: PropTypes.array
}

export function ProdutoForm({
  isEdit,
  selectedProduto,
  closeModal,
  getProdutoList,
  fornecedorList,
  categoriaList
}) {
  const ProdutoSchema = Yup.object().shape({
    nome: Yup.string().required("Nome é obrigatório").min(3, "Nome esta muito curto"),
    fornecedor: Yup.string().required('Fornecedor é obrigatório'),
    valorUnitario: Yup.string().required("Valor unitário é obrigatório"),
    qtdEstoque: Yup.string().required("Quantidade em estoque é obrigatório"),
    estoqueMinimo: Yup.string().required("Estoque minimo é obrigatório"),
    categoria: Yup.string().required("Categoria é obrigatório")
  })

  const formik = useFormik({
    initialValues: {
      id_produto: isEdit? selectedProduto.id_produto:"",
      nome: isEdit? selectedProduto.nome:"",
      fornecedor: isEdit? selectedProduto.fornecedor.id_fornecedor:"",
      valorUnitario: isEdit? selectedProduto.valorUnitario:null, 
      qtdEstoque: isEdit? selectedProduto.qtdEstoque:null,
      estoqueMinimo: isEdit? selectedProduto.estoqueMinimo:null,
      categoria: isEdit? selectedProduto.categoria.id_categoria:""
    },
    validationSchema: ProdutoSchema,
    onSubmit: async(values, actions) => {
      try {
        const reqType = isEdit? 'put':'post'
        await api[reqType]('/produto', values)
        // const { status } = await api[reqType]('/produto', values)
        // if(status == 201) {
          closeModal()
          getProdutoList()
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
          <Grid item xs={12}>         
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
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel error={Boolean(touched.fornecedor && errors.fornecedor)}>
                Fornecedor
              </InputLabel>
              <Select
                label="Fornecedor"
                {...getFieldProps('fornecedor')}
                error={Boolean(touched.fornecedor && errors.fornecedor)}
              >
                {fornecedorList.map(item => (
                  <MenuItem value={item.id_fornecedor}>{item.nome}</MenuItem>
                ))}
              </Select>
              <FormHelperText error={Boolean(touched.fornecedor && errors.fornecedor)}>
                {touched.fornecedor && errors.fornecedor}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              autoComplete="numero"
              type="number"
              label="Valor Unitário"
              {...getFieldProps('valorUnitario')}
              error={Boolean(touched.numero && errors.valorUnitario)}
              helperText={touched.valorUnitario && errors.valorUnitario}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              autoComplete="numero"
              type="number"
              label="Quantidade em estoque"
              {...getFieldProps('qtdEstoque')}
              error={Boolean(touched.qtdEstoque && errors.qtdEstoque)}
              helperText={touched.qtdEstoque && errors.qtdEstoque}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              autoComplete="numero"
              type="number"
              label="Estoque Minimo"
              {...getFieldProps('estoqueMinimo')}
              error={Boolean(touched.numero && errors.estoqueMinimo)}
              helperText={touched.estoqueMinimo && errors.estoqueMinimo}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel error={Boolean(touched.categoria && errors.categoria)}>
                Categoria
              </InputLabel>
              <Select
                label="Categoria"
                {...getFieldProps('categoria')}
                error={Boolean(touched.categoria && errors.categoria)}
              >
                {categoriaList.map(item => (
                  <MenuItem value={item.id_categoria}>{item.nome}</MenuItem>
                ))}
              </Select>
              <FormHelperText error={Boolean(touched.categoria && errors.categoria)}>
                {touched.categoria && errors.categoria}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>

        <LoadingButton sx={{ my: 2 }} fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          {isEdit? 'Atualizar':'Cadastrar'}
        </LoadingButton>
      </Form>
    </FormikProvider>
  )
}
