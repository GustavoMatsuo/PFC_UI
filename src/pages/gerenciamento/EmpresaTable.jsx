import { useCallback, useContext, useEffect, useState } from 'react'
import { 
  Avatar, 
  Card, 
  Stack, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TablePagination, 
  TableRow, 
  Typography 
} from '@mui/material'
import { TableHeadCustom } from 'src/components/TableHead'
import Label from 'src/components/Label'
import { TableMoreMenu } from 'src/components/TableMoreMenu'
import { TableNotFound } from 'src/components/TableNotFound'
import Scrollbar from '../../components/Scrollbar'
import { fCNPJ } from 'src/utils/formatNumber'
import { TableToolbar } from 'src/components/TableToolbar'
import api from 'src/config/api'
import { useTheme } from '@mui/material'
import PropTypes from 'prop-types'
import { ModalEdit } from 'src/components/ModalEdit'
import { SnackBarContext } from 'src/context/Snackbar'
import { EmpresaForm } from './EmpresaFormAdm'
import { debounce } from 'lodash'

const TABLE_HEAD = [
  { id: 'nome', label: 'Nome', alignRight: false },
  { id: 'cnpj', label: 'CNPJ', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' }
]

EmpresaTable.propTypes = {
  selectedEmpresa: PropTypes.string,
  handleSelected: PropTypes.func
}

export function EmpresaTable({
  selectedEmpresa,
  handleSelected
}) {
  const [page, setPage] = useState(0)
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('nome')
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [filterName, setFilterName] = useState('')
  const [empresaList, setEmpresaList] = useState({list:[], total:0})
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editIdEmpresa, setEditIdEmpresa] = useState(null)

  const { showSnack } = useContext(SnackBarContext)

  useEffect(() => {
    getEmpresaList(
      rowsPerPage, 
      page, 
      filterName, 
      order, 
      orderBy
    )
  }, [page, rowsPerPage, order, orderBy])

  const getEmpresaList = async(limit, page, name, order, orderBy) => {
    const { data } = await api.get('/empresa', {
      params:{
        limit,
        skip: page * limit,
        filterBy: name,
        order, 
        orderBy
      }
    })
    setEmpresaList(data)
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangeStatus = async(id) => {
    await api.put('/empresa/status', { id }).then(() => {
      showSnack("Status atualizado", "success")
    }).catch(e => {
      showSnack("Falha ao atualizar status", "error")
    })
    getEmpresaList(
      rowsPerPage, 
      page, 
      filterName, 
      order, 
      orderBy
    )
  }

  const handleEdit = (empresa) => {
    setEditIdEmpresa(empresa)
    setIsEdit(true)
    setShowModal(true)
  }

  const handleNew = () => {
    setIsEdit(false)
    setShowModal(true)
  }
  
  const handleFilter = useCallback(
    debounce((limit, page, nome, order, orderBy) => {
      if(page === 0){
        getEmpresaList(limit, page, nome, order, orderBy)
      } else {
        setPage(0)
      }
    }, 500),
  [])

  const handleFilterByName = (event) => {
    setFilterName(event.target.value)
    handleFilter(
      rowsPerPage, 
      page, 
      event.target.value,
      order, 
      orderBy
    )
  }

  const handleChangeRowsPerPage = async(event) => {
    setRowsPerPage(parseInt(event.target.value))
    await setPage(0)
  }

  const handleSelectEmpresa = (idEmpresa) => {
    handleSelected(idEmpresa)
  }

  const theme = useTheme()

  const isEmpresaNotFound = empresaList.list.length === 0

  return (
    <>
      <Card>       
        <TableToolbar
          placeholder='Pesquisar Empresa...' 
          filterName={filterName} 
          onFilterName={handleFilterByName}
          buttonRight={handleNew}
          buttonRightLabel="Adicionar"
        />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 300 }}>
            <Table>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {empresaList.list.map(row => {
                  const { id_empresa, nome, email, cnpj, status } = row
                  return (
                    <TableRow
                      hover
                      sx={{
                        cursor: 'pointer', 
                        backgroundColor: selectedEmpresa === id_empresa? theme.palette.grey[300] : null
                      }}
                      key={id_empresa}
                      tabIndex={-1}
                    >
                      <TableCell onClick={() => handleSelectEmpresa(id_empresa)}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar alt={nome} />
                          <Typography variant="subtitle2" noWrap>
                            {nome}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell onClick={() => handleSelectEmpresa(id_empresa)} align="left">{fCNPJ(cnpj)}</TableCell>
                      <TableCell onClick={() => handleSelectEmpresa(id_empresa)} align="left">{email}</TableCell>
                      <TableCell onClick={() => handleSelectEmpresa(id_empresa)} align="left">
                        <Label variant="ghost" color={(!status && 'error') || 'success'}>
                          {status? 'Ativo':'Inativo'}
                        </Label>
                      </TableCell>

                      <TableCell align="right" sx={{}}>
                        <TableMoreMenu
                          status={status}
                          handleChangeStatus={() => handleChangeStatus(id_empresa)}
                          handleEdit={() => handleEdit(row)}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
              {isEmpresaNotFound && <TableNotFound filterProps={filterName}/>}
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          rowsPerPageOptions={[1, 5, 10, 25]}
          component="div"
          labelRowsPerPage="Itens por página:"
          labelDisplayedRows={({ from, to, count }) =>`${from}–${to} de ${count !== -1 ? count : `mais que ${to}`}`}
          count={empresaList.total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, value) => setPage(value)}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
      <ModalEdit
        isOpen={showModal}
        handleClose={() => setShowModal(false)}
        modalWidth='700px'
        title={isEdit? 'Atualizar empresa':'Nova empresa'}
        form={
          <EmpresaForm
            isEdit={isEdit}
            selectedEmpresa={editIdEmpresa}
            closeModal={() => setShowModal(false)}
            getEmpresaList={() => 
              getEmpresaList(rowsPerPage, page, filterName,  order,  orderBy)
            }
          />
        }   
      />
    </>
  )
}

//component="th" scope="row"