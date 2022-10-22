import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { useContext, useState } from 'react'
import { useFormik, Form, FormikProvider } from 'formik'
import { Stack, TextField, IconButton, InputAdornment, Select, MenuItem, InputLabel, FormControl, FormHelperText } from '@mui/material'
import { LoadingButton } from '@mui/lab'
// import Iconify from '../../components/Iconify'
import api from '../../config/api'
import { SnackBarContext } from 'src/context/Snackbar'
import { v4 as uuidv4 } from 'uuid'

UserForm.propTypes = {
  isEdit: PropTypes.bool,
  selectedUser: PropTypes.object,
  closeModal: PropTypes.func,
  getUserList: PropTypes.func
}

export function UserForm({
  isEdit,
  selectedUser,
  closeModal,
  getUserList
}) {
  // const [showPassword, setShowPassword] = useState(false)
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { showSnack } = useContext(SnackBarContext)

  const UserSchema = Yup.object().shape({
    nome: Yup.string().required("Nome é obrigatório").min(3, "Nome esta muito curto"),
    email: Yup.string().email('Email deve ser um endereço de e-mail válido')
      .required('Email é obrigatório'),
    cargo: Yup.string().required('Cargo é obrigatório'),
    // senha: Yup.string().required('Senha é obrigatório').min(3, "Senha esta muito curta"),
    // confirmSenha: Yup.string().required('Confirmar Senha é obrigatório')
    //   .oneOf([Yup.ref('senha'), null], 'As senhas devem ser iguais')
  })

  const UserSchemaEdit = Yup.object().shape({
    nome: Yup.string().required("Nome é obrigatório").min(3, "Nome esta muito curto"),
    email: Yup.string().email('Email deve ser um endereço de e-mail válido')
      .required('Email é obrigatório'),
    cargo: Yup.string().required('Cargo é obrigatório'),
    // senha: Yup.string().min(3, "Senha esta muito curta"),
    // confirmSenha: Yup.string()
    //   .oneOf([Yup.ref('senha'), null], 'As senhas devem ser iguais')
  })

  const formik = useFormik({
    initialValues: {
      id_usuario: isEdit? selectedUser.id_usuario:null,
      status: isEdit? selectedUser.status:null,
      nome: isEdit? selectedUser.nome:'',
      email: isEdit? selectedUser.email:'',
      cargo: isEdit? selectedUser.cargo:'',
      senha: uuidv4()
      // confirmSenha: ,
    },
    validationSchema: isEdit? UserSchemaEdit:UserSchema,
    onSubmit: async(values, actions) => {
      try {
        const reqType = isEdit? 'put':'post'
        await api[reqType]('/usuario', values)
        closeModal()
        getUserList()
        const msg = isEdit? "Usuário atualizado com sucesso":"Usuário criado com sucesso"
        showSnack(msg, "success")
      }catch(e) {
        const msg = isEdit? "Falha ao atualizar usuário":"Falha ao criar usuário"
        showSnack(msg, "error")
      }
    },
  })

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="nome"
            type="text"
            label="Nome"
            {...getFieldProps('nome')}
            error={Boolean(touched.nome && errors.nome)}
            helperText={touched.nome && errors.nome}
          />
          <TextField
            fullWidth
            autoComplete="email"
            type="email"
            label="Email"
            disabled={isEdit}
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />
          <FormControl fullWidth>
            <InputLabel error={Boolean(touched.cargo && errors.cargo)}>
              Cargo
            </InputLabel>
            <Select
              label="Cargo"
              {...getFieldProps('cargo')}
              error={Boolean(touched.cargo && errors.cargo)}
            >
              <MenuItem value='employee'>Funcionário</MenuItem>
              <MenuItem value='admin'>Administrador</MenuItem>
            </Select>
            <FormHelperText error={Boolean(touched.cargo && errors.cargo)}>
              {touched.cargo && errors.cargo}
            </FormHelperText>
          </FormControl>
          {/* <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Senha"
            {...getFieldProps('senha')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.senha && errors.senha)}
            helperText={touched.senha && errors.senha}
          />
          <TextField
            fullWidth
            autoComplete="current-password"
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirmar Senha"
            {...getFieldProps('confirmSenha')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.confirmSenha && errors.confirmSenha)}
            helperText={touched.confirmSenha && errors.confirmSenha}
          /> */}
        </Stack>

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
