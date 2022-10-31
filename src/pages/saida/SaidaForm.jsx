import PropTypes from 'prop-types'
import { useState, useContext } from 'react'
import { useFormik, Form, FormikProvider } from 'formik'
import { 
  TextField, 
  Grid,
} from '@mui/material'
import api from '../../config/api'
import { LoadingButton } from '@mui/lab'
import {
  MobileDatePicker, 
  LocalizationProvider, 
} from '@mui/x-date-pickers'
import ptBr from 'date-fns/locale/pt-BR'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { SnackBarContext } from 'src/context/Snackbar'
import { fDateEn, fDateSimple } from 'src/utils/formatTime'

SaidaForm.propTypes = {
  handleClose: PropTypes.func
}

let INITIAL_INICIO_DATE = new Date()
INITIAL_INICIO_DATE = INITIAL_INICIO_DATE.setDate(INITIAL_INICIO_DATE.getDate() - 14)
const INITIAL_FIM_DATE = new Date()

export function SaidaForm({
  handleClose
}) {
  const [inicioDate, setInicioDate] = useState(INITIAL_INICIO_DATE)
  const [fimDate, setFimDate] = useState(INITIAL_FIM_DATE)

  const { showSnack } = useContext(SnackBarContext)

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      inicio: inicioDate,
      fim: fimDate
    },
    onSubmit: async(values, actions) => {
      try {
        actions.setSubmitting(true)
        if(inicioDate !== null && fimDate !== null) {
          const inicio = fDateEn(inicioDate)
          const fim = fDateEn(fimDate)
          const filename = `saida_${fDateSimple(new Date())}.xlsx`

          const { data } = await api.get('/saida/relatorio', {
            responseType: 'blob',
            headers: {
              'Content-Disposition': `attachment; filename=${filename}`,
              'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
            params: {
              inicio,
              fim
            }
          }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()
          })
          .catch((error) => 
            showSnack("Falha ao gerar relatório de saida 22", "error")
          )
          handleClose()
        }
      } catch(e) {
        console.log(e)
      } finally {
        actions.setSubmitting(false)
      }
    }
  })

  const { errors, touched, isSubmitting, handleSubmit, setFieldValue, values } = formik

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBr}>
            <MobileDatePicker
              label="Data início"
              inputFormat="dd/MM/yyyy"
              value={inicioDate}
              maxDate={fimDate}
              onChange={value => setInicioDate(value)}
              renderInput={(params) => 
                <TextField 
                  fullWidth 
                  {...params} 
                  error={Boolean(touched.inicio && errors.inicio)}
                  helperText={touched.inicio && errors.inicio}
                />
              }           
            />

          </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>         
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBr}>
              <MobileDatePicker
                label="Data fim"
                inputFormat="dd/MM/yyyy"
                value={fimDate}
                minDate={inicioDate}
                onChange={value => setFimDate(value)}
                renderInput={(params) => 
                  <TextField 
                    fullWidth 
                    {...params} 
                    error={Boolean(touched.fim && errors.fim)}
                    helperText={touched.fim && errors.fim}
                  />
                }
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <LoadingButton 
              fullWidth 
              size="large" 
              type="submit" 
              variant="contained"
              loading={isSubmitting}
            >
              Baixar
            </LoadingButton>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  )
}
