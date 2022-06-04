import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useFormik, Form, FormikProvider } from 'formik'
import { Stack, TextField, IconButton, InputAdornment, Select, MenuItem, InputLabel, FormControl, FormHelperText } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Iconify from '../../components/Iconify'
import api from '../../config/api'

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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const UserSchema = Yup.object().shape({
    name: Yup.string().required("Nome é obrigatório").min(3, "Nome esta muito curto"),
    email: Yup.string().email('Email deve ser um endereço de e-mail válido').required('Email é obrigatório'),
    role: Yup.string().required('Cargo é obrigatório'),
    password: Yup.string().required('Senha é obrigatório').min(3, "Senha esta muito curta"),
    confirmPassword: Yup.string().required('Confirmar Senha é obrigatório')
      .oneOf([Yup.ref('password'), null], 'As senhas devem ser iguais')
  })

  const formik = useFormik({
    initialValues: {
      id: isEdit? selectedUser.id:null,
      status: isEdit? selectedUser.status:null,
      name: isEdit? selectedUser.name:'',
      email: isEdit? selectedUser.email:'',
      role: isEdit? selectedUser.role:'',
      password: isEdit? selectedUser.password:'',
      confirmPassword: isEdit? selectedUser.password:'',
    },
    validationSchema: UserSchema,
    onSubmit: async(values, actions) => {
      try {
        const reqType = isEdit? 'put':'post'
        await api[reqType]('/users', values)
        // const { status } = await api[reqType]('/users', values)
        // if(status == 201) {
          closeModal()
          getUserList()
        // }
      }catch(e) {
        // const {  } = e.response
        console.log(e.response)
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
            autoComplete="name"
            type="text"
            label="Nome"
            {...getFieldProps('name')}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
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
            <InputLabel error={Boolean(touched.role && errors.role)}>
              Cargo
            </InputLabel>
            <Select
              label="Cargo"
              {...getFieldProps('role')}
              error={Boolean(touched.role && errors.role)}
            >
              <MenuItem value='employee'>Funcionário</MenuItem>
              <MenuItem value='admin'>Administrador</MenuItem>
            </Select>
            <FormHelperText error={Boolean(touched.role && errors.role)}>
              {touched.role && errors.role}
            </FormHelperText>
          </FormControl>
          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Senha"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
          <TextField
            fullWidth
            autoComplete="current-password"
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirmar Senha"
            {...getFieldProps('confirmPassword')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            helperText={touched.confirmPassword && errors.confirmPassword}
          />
        </Stack>

        <LoadingButton sx={{ my: 2 }} fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          {isEdit? 'Atualizar':'Cadastrar'}
        </LoadingButton>
      </Form>
    </FormikProvider>
  )
}
