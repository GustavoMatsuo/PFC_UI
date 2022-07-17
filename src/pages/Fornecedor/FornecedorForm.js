import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { useFormik, Form, FormikProvider } from 'formik'
import { TextField, Grid } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import api from '../../config/api'

FornecedorForm.propTypes = {
  isEdit: PropTypes.bool,
  selectedFornecedor: PropTypes.object,
  closeModal: PropTypes.func,
  getFornecedorList: PropTypes.func
}

export function FornecedorForm({
  isEdit,
  selectedFornecedor,
  closeModal,
  getFornecedorList
}) {
  const FornecedorSchema = Yup.object().shape({
    nome: Yup.string().required("Nome é obrigatório").min(3, "Nome esta muito curto"),
    email: Yup.string().email('Email deve ser um endereço de e-mail válido').required('Email é obrigatório'),
    cnpj: Yup.string().required("CNPJ é obrigatório").length(14, "CNPJ esta errado"),
    rua: Yup.string().required("Rua/Avenida é obrigatório").min(3, "Rua/Avenida esta muito curto"),
    numero: Yup.string().required("Número é obrigatório").min(1, "Número esta muito curto"),
    bairro: Yup.string().required("Bairro é obrigatório").min(1, "Bairro esta muito curto"),
    cep: Yup.string().required("CEP é obrigatório").length(7, "CEP esta errado"),
    cidade: Yup.string().required("Cidade é obrigatório").min(3, "Cidade esta muito curto"),
    uf: Yup.string().required("UF é obrigatório").length(2, "UF esta errado")
  })

  const formik = useFormik({
    initialValues: {
      id_fornecedor: isEdit? selectedFornecedor.id_fornecedor:null,
      nome: isEdit? selectedFornecedor.nome:"",
      email: isEdit? selectedFornecedor.email:"",
      cnpj: isEdit? selectedFornecedor.cnpj:"",
      status: isEdit? selectedFornecedor.status:null,
      id_endereco: isEdit? selectedFornecedor.endereco.id_endereco:null,
      rua: isEdit? selectedFornecedor.endereco.rua:"",
      numero: isEdit? selectedFornecedor.endereco.numero:"",
      bairro: isEdit? selectedFornecedor.endereco.bairro:"",
      cep: isEdit? selectedFornecedor.endereco.cep:"",
      cidade: isEdit? selectedFornecedor.endereco.cidade:"",
      uf: isEdit? selectedFornecedor.endereco.uf:""
    },
    validationSchema: FornecedorSchema,
    onSubmit: async(values, actions) => {
      try {
        const formatForm = {
          id_fornecedor: values.id_fornecedor,
          nome: values.nome,
          email: values.email,
          cnpj: values.cnpj,
          status: values.status,
          endereco: {
            ...(isEdit && {id_endereco: values.id_endereco}),
            rua: values.rua,
            numero: values.numero,
            bairro: values.bairro,
            cep: values.cep,
            cidade: values.cidade,
            uf: values.uf
          }
        }
        const reqType = isEdit? 'put':'post'
        await api[reqType]('/fornecedor', formatForm)
        // const { status } = await api[reqType]('/fornecedor', formatForm)
        // if(status == 201) {
          closeModal()
          getFornecedorList()
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
            <TextField
              fullWidth
              autoComplete="email"
              type="email"
              label="Email"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              autoComplete="cnpj"
              type="number"
              label="CNPJ"
              disabled={isEdit}
              {...getFieldProps('cnpj')}
              error={Boolean(touched.cnpj && errors.cnpj)}
              helperText={touched.cnpj && errors.cnpj}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              autoComplete="rua"
              type="text"
              label="Rua/Avenida"
              {...getFieldProps('rua')}
              error={Boolean(touched.rua && errors.rua)}
              helperText={touched.rua && errors.rua}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              autoComplete="numero"
              type="text"
              label="Número"
              {...getFieldProps('numero')}
              error={Boolean(touched.numero && errors.numero)}
              helperText={touched.numero && errors.numero}
            />
          </Grid>
          <Grid item xs={9}>
            <TextField
              fullWidth
              autoComplete="bairro"
              type="text"
              label="Bairro"
              {...getFieldProps('bairro')}
              error={Boolean(touched.bairro && errors.bairro)}
              helperText={touched.bairro && errors.bairro}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              autoComplete="cep"
              type="number"
              label="CEP"
              {...getFieldProps('cep')}
              error={Boolean(touched.cep && errors.cep)}
              helperText={touched.cep && errors.cep}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              autoComplete="cidade"
              type="text"
              label="Cidade"
              {...getFieldProps('cidade')}
              error={Boolean(touched.cidade && errors.cidade)}
              helperText={touched.cidade && errors.cidade}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              autoComplete="uf"
              type="text"
              label="UF"
              {...getFieldProps('uf')}
              error={Boolean(touched.uf && errors.uf)}
              helperText={touched.uf && errors.uf}
            />
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
