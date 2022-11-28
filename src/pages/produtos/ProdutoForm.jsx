import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { useFormik, Form, FormikProvider } from 'formik'
import { 
  TextField, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText, 
  Button, 
  Tooltip,
  InputAdornment
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Iconify from 'src/components/Iconify'
import api from '../../config/api'
import { SnackBarContext } from 'src/context/Snackbar'
import { useContext } from 'react'

ProdutoForm.propTypes = {
  isEdit: PropTypes.bool,
  selectedProduto: PropTypes.object,
  closeModal: PropTypes.func,
  getProdutoList: PropTypes.func,
  fornecedorList: PropTypes.array,
  categoriaList: PropTypes.array,
  openCategoria: PropTypes.func
}

export function ProdutoForm({
  isEdit,
  selectedProduto,
  closeModal,
  getProdutoList,
  fornecedorList,
  categoriaList,
  openCategoria
}) {
  const { showSnack } = useContext(SnackBarContext)

  const ProdutoSchema = Yup.object().shape({
    nome:
      Yup.string()
      .required("Nome é obrigatório")
      .min(3, "Nome esta muito curto"),
    codigo: 
      Yup.string()
      .required("Código de barras é obrigatório")
      .min(5, "Código de barras esta muito curto"),
    fornecedor: Yup.string().required('Fornecedor é obrigatório'),
    valor_unitario: 
      Yup.number()
      .typeError("Valor unitário precisa ser um numero")
      .required("Valor unitário é obrigatório"),
    estoque_minimo: 
      Yup.number()
      .typeError("Estoque minimo precisa ser um numero")
      .required("Estoque minimo é obrigatório"),
    categoria: 
      Yup.string()
      .required("Categoria é obrigatório"),
  })

  const formik = useFormik({
    initialValues: {
      id_produto: isEdit? selectedProduto.id_produto:"",
      nome: isEdit? selectedProduto.nome:"",
      codigo: isEdit? selectedProduto.codigo:"",
      fornecedor: isEdit? selectedProduto.fornecedor.id_fornecedor:"",
      valor_unitario: isEdit? selectedProduto.valor_unitario:undefined, 
      desconto: isEdit? selectedProduto.desconto:undefined, 
      estoque_minimo: isEdit? selectedProduto.estoque_minimo:undefined,
      categoria: isEdit? selectedProduto.categoria.id_categoria:""
    },
    validationSchema: ProdutoSchema,
    onSubmit: async(values, actions) => {
      try {
        const reqType = isEdit? 'put':'post'
        await api[reqType]('/produto', values)
        closeModal()
        getProdutoList()
        const msg = isEdit? "Produto atualizado com sucesso":"Produto criado com sucesso"
        showSnack(msg, "success")
      }catch(e) {
        const msg = isEdit? "Falha ao atualizar produto":"Falha ao criar produto"
        showSnack(msg, "error")
      }
    }
  })

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps, values } = formik

  const descontoMsg = 
    !!values.desconto &&
    values.desconto.length > 0 && 
    values.desconto != 0 &&
    !Number.parseFloat(values.desconto)? "Desconto precisa ser um numero" 
    :
    Number.parseFloat(values.desconto) > Number.parseFloat(values.valor_unitario)? 
      "Não é possivel dar desconto maior que o total":""

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>         
            <TextField
              fullWidth
              type="text"
              label="Nome"
              {...getFieldProps('nome')}
              error={Boolean(touched.nome && errors.nome)}
              helperText={touched.nome && errors.nome}
            />
          </Grid>
          <Grid item xs={12}>         
            <TextField
              fullWidth
              type="text"
              onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
              label="Código de barras"
              {...getFieldProps('codigo')}
              error={Boolean(touched.codigo && errors.codigo)}
              helperText={touched.codigo && errors.codigo}
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
                  <MenuItem key={item.id_fornecedor} value={item.id_fornecedor} disabled={!item.status}>
                    {item.nome}
                  </MenuItem>
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
              label="Valor Unitário"
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}  
              {...getFieldProps('valor_unitario')}
              error={Boolean(touched.valor_unitario && errors.valor_unitario)}
              helperText={touched.valor_unitario && errors.valor_unitario}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Estoque Minimo"
              {...getFieldProps('estoque_minimo')}
              error={Boolean(touched.estoque_minimo && errors.estoque_minimo)}
              helperText={touched.estoque_minimo && errors.estoque_minimo}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Desconto (R$) (Opcional)"
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
              {...getFieldProps('desconto')}
              error={Boolean(touched.desconto && errors.desconto) || descontoMsg.length > 0}
              helperText={(touched.desconto && errors.desconto) || descontoMsg}
            />
          </Grid>
          <Grid item xs={10}>
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
                  <MenuItem key={item.id_categoria} value={item.id_categoria}>
                    {item.nome}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error={Boolean(touched.categoria && errors.categoria)}>
                {touched.categoria && errors.categoria}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <Tooltip placement="top" title="Gerenciar categoria">
              <Button 
                sx={{ height: '53.2px' }}
                fullWidth size="large" 
                variant="outlined" 
                onClick={openCategoria}
              >
                <Iconify
                  icon="eva:pricetags-outline" 
                  width={32} 
                  height={32} 
                />
              </Button>
            </Tooltip>
          </Grid>
        </Grid>

        <LoadingButton 
          sx={{ mt: 2 }} 
          fullWidth 
          size="large" 
          type="submit" 
          variant="contained"
          loading={isSubmitting}
        >
          {isEdit? 'Atualizar':'Cadastrar'}
        </LoadingButton>
      </Form>
    </FormikProvider>
  )
}
