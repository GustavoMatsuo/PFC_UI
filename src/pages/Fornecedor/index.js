import { useEffect, useState } from 'react'
import {
  Card,
  Table,
  Stack,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material'
import Label from '../../components/Label'
import Scrollbar from '../../components/Scrollbar'
import { TableHeadCustom } from 'src/components/TableHead'
import { FornecedorListToolbar } from './FornecedorListToolbar'
import { TableNotFound } from 'src/components/TableNotFound'
import { TableMoreMenu } from 'src/components/TableMoreMenu'
import { ModalEdit } from 'src/components/ModalEdit'
import { FornecedorForm } from './FornecedorForm'
import { fCNPJ } from 'src/utils/formatNumber'
import api from 'src/config/api'
import { sortFilter } from 'src/utils/sortFilter'
import { FabAdd } from 'src/components/FabAdd'

const TABLE_HEAD = [
  { id: 'nome', label: 'Nome', alignRight: false },
  { id: 'cnpj', label: 'CNPJ', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' }
]

export default function Fornecedor() {
  const [page, setPage] = useState(0)
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('nome')
  const [filterName, setFilterName] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [fornecedorList, setFornecedorList] = useState({list:[], total:0})

  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedFornecedor, setselectedFornecedor] = useState(null)

  useEffect(() => {
    getFornecedorList()
  }, [page, rowsPerPage])

  const getFornecedorList = async() => {
    const { data } = await api.get('/fornecedor', {
      params:{
        limit: rowsPerPage,
        skip: page * rowsPerPage
      }
    })
    setFornecedorList(data)
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangeRowsPerPage = async(event) => {
    setRowsPerPage(parseInt(event.target.value))
    await setPage(0)
  }

  const handleFilterByName = (event) => {
    setFilterName(event.target.value)
  }

  const handleChangeStatus = async(id) => {
    await api.put('/fornecedor/status', { id })
    getFornecedorList()
  }

  const handleEdit = (fornecedor) => {
    setselectedFornecedor(fornecedor)
    setIsEdit(true)
    setShowModal(true)
  } 

  const handleNew = () => {
    setIsEdit(false)
    setShowModal(true)
  }

  const filteredFornecedor = sortFilter(fornecedorList.list, order, orderBy, filterName, 'nome')

  const isFornecedorNotFound = filteredFornecedor.length === 0

  return (
    <>
      <FabAdd addFunc={handleNew}/>
      <Card>
        <FornecedorListToolbar filterName={filterName} onFilterName={handleFilterByName} />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {filteredFornecedor.map(row => {
                  const { id_fornecedor, nome, email, cnpj, status } = row

                  return (
                    <TableRow
                      hover
                      key={id_fornecedor}
                      tabIndex={-1}
                    >
                      <TableCell component="th" scope="row">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar alt={nome} />
                          <Typography variant="subtitle2" noWrap>
                            {nome}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{fCNPJ(cnpj)}</TableCell>
                      <TableCell align="left">{email}</TableCell>
                      <TableCell align="left">
                        <Label variant="ghost" color={(!status && 'error') || 'success'}>
                          {status? 'Ativo':'Inativo'}
                        </Label>
                      </TableCell>

                      <TableCell align="right">
                        <TableMoreMenu
                          status={status}
                          handleChangeStatus={() => handleChangeStatus(id_fornecedor)}
                          handleEdit={() => handleEdit(row)}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>

              {isFornecedorNotFound && <TableNotFound filterProps={filterName}/>}
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={[1, 5, 10, 25]}
          component="div"
          labelRowsPerPage="Itens por p??gina:"
          labelDisplayedRows={({ from, to, count }) =>`${from}???${to} de ${count !== -1 ? count : `mais que ${to}`}`}
          count={fornecedorList.total}
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
        title={isEdit? 'Atualizar fornecedor':'Novo fornecedor'}
        form={
          <FornecedorForm
            isEdit={isEdit}
            selectedFornecedor={selectedFornecedor}
            closeModal={() => setShowModal(false)}
            getFornecedorList={getFornecedorList}
          />
        }   
      />
    </>
  )
}