import { useCallback, useContext, useEffect, useState } from 'react'
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
import { debounce } from 'lodash'
import Label from '../../components/Label'
import Scrollbar from '../../components/Scrollbar'
import { TableHeadCustom } from 'src/components/TableHead'
import { TableNotFound } from 'src/components/TableNotFound' 
import { TableMoreMenu } from 'src/components/TableMoreMenu'
import { UserForm } from './UserForm'
import { ModalEdit } from 'src/components/ModalEdit'
import api from 'src/config/api'
import { TableToolbar } from 'src/components/TableToolbar'
import { SnackBarContext } from 'src/context/Snackbar'

const TABLE_HEAD = [
  { id: 'nome', label: 'Nome', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'cargo', label: 'Cargo', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' }
]

export default function User() {
  const [page, setPage] = useState(0)
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('nome')
  const [filterName, setFilterName] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [userList, setUserList] = useState({list:[], total:0})
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const { showSnack } = useContext(SnackBarContext)

  useEffect(() => {
    getUserList(
      rowsPerPage, 
      page, 
      filterName, 
      order, 
      orderBy
    )
  }, [page, rowsPerPage, order, orderBy])

  const getUserList = async(limit, page, name, order, orderBy) => {
    const { data } = await api.get('/usuario', {
      params:{
        limit,
        skip: page * limit,
        filterBy: name,
        order, 
        orderBy
      }
    })
    setUserList(data)
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangeRowsPerPage = async(event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    await setPage(0)
  }

  const handleFilter = useCallback(
    debounce((limit, page, nome, order, orderBy) => {
      if(page === 0){
        getUserList(limit, page, nome, order, orderBy)
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

  const handleChangeStatus = async(id) => {
    await api.put('/usuario/status', { id }).then(() => {
      showSnack("Status atualizado", "success")
    }).catch(e => {
      showSnack("Falha ao atualizar status", "error")
    })
    getUserList(
      rowsPerPage, 
      page, 
      filterName, 
      order, 
      orderBy
    )
  }

  const handleDelete = async(id) => {
    await api.delete('/usuario', { 
      params: { id }
    }).then(() => {
      showSnack("Usuário deletado", "success")
    }).catch(e => {
      showSnack("Falha ao deletar usuário", "error")
    })
    getUserList(
      rowsPerPage, 
      page, 
      filterName, 
      order, 
      orderBy
    )
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setIsEdit(true)
    setShowModal(true)
  } 

  const handleNewUser = () => {
    setIsEdit(false)
    setShowModal(true)
  }

  const userData = JSON.parse(localStorage.getItem('user_data'))

  const isUserNotFound = userList.list.length === 0

  return (
    <>
      <Card>
        <TableToolbar 
          placeholder='Pesquisar Usuário...' 
          filterName={filterName} 
          onFilterName={handleFilterByName}
          buttonRight={handleNewUser}
          buttonRightLabel="Adicionar"
        />
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
                {userList.list.map((row) => {
                  const { id_usuario, nome, email, cargo, status, verificado } = row

                  return (
                    <TableRow
                      hover
                      key={id_usuario}
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
                      <TableCell align="left">{email}</TableCell>
                      <TableCell align="left">{cargo}</TableCell>
                      <TableCell align="left">
                        <Label variant="ghost" color={((!status || !verificado) && 'error') || 'success'}>
                          {verificado? (status? 'Ativo':'Inativo') : 'Não verificado'}
                        </Label>
                      </TableCell>

                      <TableCell align="right">
                        <TableMoreMenu
                          status={status}
                          handleChangeStatus={() => handleChangeStatus(id_usuario)}
                          handleEdit={() => handleEditUser(row)}
                          hideStatus={email === userData.email}
                          handleDelete={() => handleDelete(id_usuario)}
                          showDelete={!verificado}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>

              {isUserNotFound && <TableNotFound filterProps={filterName}/>}
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={[1, 5, 10, 25]}
          component="div"
          labelRowsPerPage="Itens por página:"
          labelDisplayedRows={({ from, to, count }) =>`${from}–${to} de ${count !== -1 ? count : `mais que ${to}`}`}
          count={userList.total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, value) => setPage(value)}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <ModalEdit
        isOpen={showModal}
        handleClose={() => setShowModal(false)}
        modalWidth='500px'
        title={isEdit? 'Atualizar usuário':'Novo usuário'}
        form={
          <UserForm
            isEdit={isEdit}
            selectedUser={selectedUser}
            closeModal={() => setShowModal(false)}
            getUserList={() => 
              getUserList(rowsPerPage, page, filterName, order, orderBy)
            }
          />
        }   
      />
    </>
  )
}
