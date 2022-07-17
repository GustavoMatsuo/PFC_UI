import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useFormik, Form, FormikProvider } from 'formik'
import { Stack, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useNavigate } from 'react-router-dom'
import api from '../../config/api'

ForgetForm.propTypes = {
  toggleForm: PropTypes.func
}

export function ForgetForm({toggleForm}) {
  const navigate = useNavigate()

  const ForgetSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email deve ser um endereço de e-mail válido')
      .required('Digite o email para redefinir a senha')
  })

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: ForgetSchema,
    onSubmit: async(values, actions) => {
      try {
        await api.post('/usuario/reset', values)
        toggleForm()
      }catch(e) {

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
            autoComplete="email"
            type="email"
            label="Email"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />
        </Stack>
        <LoadingButton 
          sx={{ mb: 1, mt: 3 }} 
          fullWidth 
          size="large" 
          type="submit" 
          variant="contained" 
          loading={isSubmitting}
        >
          Enviar
        </LoadingButton>
      </Form>
    </FormikProvider>
  )
}
