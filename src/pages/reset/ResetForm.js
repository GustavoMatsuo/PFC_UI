import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik, Form, FormikProvider } from 'formik'
import { Stack, TextField, IconButton, InputAdornment, Alert } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Iconify from '../../components/Iconify'
import api from '../../config/api'

ResetForm.propTypes = {
  token: PropTypes.string
}

export function ResetForm({ token }) {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const ResetSchema = Yup.object().shape({
    senha: Yup.string().required('Senha é obrigatório').min(3, "Senha esta muito curta"),
    confirmSenha: Yup.string().required('Confirmar Senha é obrigatório')
      .oneOf([Yup.ref('senha'), null], 'As senhas devem ser iguais')
  })

  const formik = useFormik({
    initialValues: {
      senha: '',
      confirmSenha:''
    },
    validationSchema: ResetSchema,
    onSubmit: async(values, actions) => {
      try {
        let config = {
          headers: {
            Authorization: token
          }
        }
        await api.put('/usuario/newPassword', {senha: values.senha}, config)
        navigate('/login', { replace: true })
      }catch(e) {
        const { data, status } = e.response
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
          />
        </Stack>

        <LoadingButton sx={{ mb: 1, mt: 3 }} fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Confirmar
        </LoadingButton>
      </Form>
    </FormikProvider>
  )
}
