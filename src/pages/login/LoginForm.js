import * as Yup from 'yup'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik, Form, FormikProvider } from 'formik'
import { Stack, TextField, IconButton, InputAdornment, Alert } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Iconify from '../../components/Iconify'
import api from '../../config/api'

export function LoginForm() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [userDisabled, setUserDisabled] = useState(false)

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email deve ser um endereço de e-mail válido').required('Email é obrigatório'),
    senha: Yup.string().required('Senha é obrigatório')
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      senha: ''
    },
    validationSchema: LoginSchema,
    onSubmit: async(values, actions) => {
      try {
        setUserDisabled(false)
        const { status, data } = await api.post("/usuario/login", values)
        if(status === 200) {
          localStorage.setItem('token', data.token)
          navigate('/auth', { replace: true })
        }
      }catch(e) {
        const { data, status } = e.response
        if(status === 401) {
          actions.setFieldError('email', data.msg)
          actions.setFieldError('senha', data.msg)
        }else {
          setUserDisabled(true)
        }
      }
    },
  })

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik

  const handleShowPassword = () => {
    setShowPassword((show) => !show)
  }

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {userDisabled && <Alert severity="warning">O usuário que você tentou fazer login está DESATIVADO</Alert>}
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Senha"
            {...getFieldProps('senha')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.senha && errors.senha)}
            helperText={touched.senha && errors.senha}
          />
        </Stack>

        <LoadingButton sx={{ mb: 1, mt: 3 }} fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Entrar
        </LoadingButton>
      </Form>
    </FormikProvider>
  )
}
