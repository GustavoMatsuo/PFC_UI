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
import { UserListToolbar } from './UserListToolbar'
import { TableNotFound } from 'src/components/TableNotFound' 
import { TableMoreMenu } from 'src/components/TableMoreMenu'
import { UserForm } from './UserForm'
import { ModalEdit } from 'src/components/ModalEdit'
import api from 'src/config/api'
import { sortFilter } from 'src/utils/sortFilter'
import { FabAdd } from 'src/components/FabAdd'

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

  useEffect(() => {
    getUserList()
  },[page, rowsPerPage])

  const getUserList = async() => {
    const { data } = await api.get('/usuario', {
      params:{
        limit: rowsPerPage,
        skip: page
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

  const handleFilterByName = (event) => {
    setFilterName(event.target.value)
  }

  const handleChangeStatus = async(id) => {
    await api.put('/usuario/status', { id })
    getUserList()
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

  const filteredUsers = sortFilter(userList.list, order, orderBy, filterName, 'nome')

  const isUserNotFound = filteredUsers.length === 0

  return (
    <>
      <FabAdd addFunc={handleNewUser}/>
      <Card>
        <UserListToolbar filterName={filterName} onFilterName={handleFilterByName} />

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
                {filteredUsers.map((row) => {
                  const { id_usuario, nome, email, cargo, status } = row

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
                        <Label variant="ghost" color={(!status && 'error') || 'success'}>
                          {status? 'Ativo':'Inativo'}
                        </Label>
                      </TableCell>

                      <TableCell align="right">
                        <TableMoreMenu
                          status={status}
                          handleChangeStatus={() => handleChangeStatus(id_usuario)}
                          handleEdit={() => handleEditUser(row)}
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
            getUserList={getUserList}
          />
        }   
      />
    </>
  )
}
