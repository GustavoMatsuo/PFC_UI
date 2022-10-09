import { useState } from 'react'
import { 
  Grid
} from '@mui/material'
import { UsuarioTable } from './UsuarioTable'
import { EmpresaTable } from './EmpresaTable'

export default function Gerenciamento() {
  const [selectedEmpresa, setSelectedEmpresa] = useState('')

  return (
    <Grid container spacing={3} sx={{ height: '100%' }}>
      <Grid item xs={12} sm={12} md={6} sx={{ height: "100%" }}>
        <EmpresaTable 
          selectedEmpresa={selectedEmpresa}
          handleSelected={setSelectedEmpresa}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} sx={{ height: "100%" }}>
        <UsuarioTable empresaId={selectedEmpresa}/> 
      </Grid>
    </Grid>
  )
}