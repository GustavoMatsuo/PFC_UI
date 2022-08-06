import { useEffect, useState, useCallback } from 'react'
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
  Grid,
  styled,
  Button,
  CircularProgress
} from '@mui/material'
import Label from '../../components/Label'
import Scrollbar from '../../components/Scrollbar'
import api from 'src/config/api'
import { TableHeadCustom } from 'src/components/TableHead'
import { TableToolbar } from '../../components/TableToolbar'
import { TableNotFound } from 'src/components/TableNotFound'
import { ModalEdit } from 'src/components/ModalEdit'
import { EntradaForm } from './EntradaForm'
import { fCurrency } from 'src/utils/formatNumber'
import { CardProduto } from './CardProduto'
import { fDateTime } from 'src/utils/formatTime'
import { EntradaStepper } from './EntradaStepper'
import Iconify from 'src/components/Iconify'
import { EntradaNewList } from './EntradaNewList'
import { debounce } from 'lodash'

const TABLE_HEAD = [
  { id: 'produto', label: 'Produto', alignRight: false },
  { id: 'qtd', label: 'Quantidade', alignRight: false },
  { id: 'data_entrada', label: 'Data da entrada', alignRight: false },
  { id: 'valor_unitario', label: 'Valor unitário', alignRight: false },
]

const ContentDiv = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}))

const ContentHeader = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(0, 1, 1, 1)
}))

export default function Entrada() {
  const [page, setPage] = useState(0)
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('data_entrada')
  const [filterName, setFilterName] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [entradaList, setEntradaList] = useState({list:[], total:0})
  const [produtoList, setProdutoList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newEntradaList, setNewEntradaList] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [selectedEntrada, setSelectedEntrada] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getEntradaList(
      rowsPerPage, 
      page, 
      filterName, 
      order, 
      orderBy
    )
  }, [page, rowsPerPage, order, orderBy])

  useEffect(() => {
    getProdutoListSimple()
  }, [])

  const getEntradaList = async(limit, page, name, order, orderBy) => {
    const { data } = await api.get('/entrada', {
      params:{
        limit,
        skip: page * limit,
        filterBy: name,
        order, 
        orderBy
      }
    })
    setEntradaList(data)
  }

  const getProdutoListSimple = async() => {
    const { data } = await api.get('/produto/simple')
    setProdutoList(data)
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

  const handleFilter = useCallback(
    debounce((limit, page, nome, order, orderBy) => {
      if(page === 0){
        getEntradaList(limit, page, nome, order, orderBy)
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

  const handleNew = () => {
    setIsEdit(false)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    getEntradaList(
      rowsPerPage, 
      page, 
      filterName, 
      order, 
      orderBy
    )
    setShowModal(false)
    setIsEdit(false)
    setNewEntradaList([])
  }

  const handleAddEntrada = (entrada) => {
    setNewEntradaList(prevState => (
      [...prevState, {
        produto: entrada.produto,
        produto_nome: entrada.produto_nome,
        qtd: entrada.qtd,
        valor_unitario: entrada.valor_unitario
      }]
    ))
    setIsEdit(false)
  }

  const handleUpdateEntrada = (editedEntrada) => {
    const editedEntradaList = newEntradaList.map((item, index) => {
      return selectedEntrada.position == index? editedEntrada:item
    })
    setNewEntradaList(editedEntradaList)
    setIsEdit(false)
  }

  const handleEditEntrada = (entrada, position) => {
    setSelectedEntrada({entrada, position})
    setIsEdit(true)
    setShowModal(true)
  }
  const cancelEdit = () => {
    setSelectedEntrada({})
    setIsEdit(false)
  }

  const handleRemoveEntrada = (position) => {
    const removedEntradaList = newEntradaList.filter((item, index) => {
      if(index !== position) {
        return item
      }
    })
    setNewEntradaList(removedEntradaList)
  }

  const saveEntrada = (entrada) => {
    return new Promise((resolve) => {
      resolve(api.post('/entrada', entrada))
    })
  }

  const handleFinalizarEntrada = async() => {
    setLoading(true)
    let count = 0
    while (count <= newEntradaList.length-1) {
      await saveEntrada(newEntradaList[count])
      count++
    }
    setLoading(false)
    getEntradaList(
      rowsPerPage, 
      page, 
      filterName, 
      order, 
      orderBy
    )
    handleCloseModal()
  }

  const isEntradaNotFound = entradaList.list.length === 0

  return (
    <div>
      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} sm={12} md={4}>
          <CardProduto title="Subtitulo"/>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <CardProduto title="Subtitulo"/>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <CardProduto title="Subtitulo"/>
        </Grid>
      </Grid>

      <Card>
        <TableToolbar 
          placeholder='Pesquisar Entrada...' 
          filterName={filterName} 
          onFilterName={handleFilterByName}
          buttonRight={handleNew}
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
                {entradaList.list.map((row) => {
                  const { id_entrada, nome_produto, qtd, data_entrada, valor_unitario } = row

                  return (
                    <TableRow
                      hover
                      key={id_entrada}
                      tabIndex={-1}
                    >
                      <TableCell component="th" scope="row">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="subtitle2" noWrap>{nome_produto}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">
                        <Label variant="ghost" color='success'>
                          {qtd}
                        </Label>
                      </TableCell>
                      <TableCell align="left">{fDateTime(data_entrada)}</TableCell>
                      <TableCell align="left">R$&nbsp;{fCurrency(valor_unitario)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>

              {isEntradaNotFound && <TableNotFound filterProps={filterName}/>}
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          rowsPerPageOptions={[1, 5, 10, 25]}
          component="div"
          labelRowsPerPage="Itens por página:"
          labelDisplayedRows={({ from, to, count }) =>`${from}–${to} de ${count !== -1 ? count : `mais que ${to}`}`}
          count={entradaList.total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, value) => setPage(value)}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
      <ModalEdit
        isOpen={showModal}
        handleClose={handleCloseModal}
        modalWidth='550px'
        title='Nova entrada'
        form={
          <EntradaStepper
            nextDisabled={newEntradaList.length > 0}
            loading={loading}
            stepComponents={[
              <ContentDiv>
                <EntradaForm
                  isEdit={isEdit}
                  cancelEdit={cancelEdit}
                  selectedEntrada={selectedEntrada.entrada}
                  produtoList={produtoList}
                  handleAddEntrada={handleAddEntrada} 
                  handleUpdateEntrada={handleUpdateEntrada}
                />
                {newEntradaList.length > 0 && 
                  <EntradaNewList
                    newEntradaList={newEntradaList}
                    handleEditEntrada={handleEditEntrada}
                    handleRemoveEntrada={handleRemoveEntrada}
                    enabledButtons={true}
                    maxHeight="290px"
                  />
                }
              </ContentDiv>,
              <ContentDiv>
                <ContentHeader>
                  <ContentDiv>
                    <Typography variant="h4" noMargin>
                      Conferência
                    </Typography>
                    <Typography variant="subtitle2" noMargin>
                      Verifique os itens na lista. Caso esteja tudo certo finalize na &#10004;.
                    </Typography>
                  </ContentDiv>
                </ContentHeader>
                <EntradaNewList
                  newEntradaList={newEntradaList}
                  handleEditEntrada={handleEditEntrada}
                  handleRemoveEntrada={handleRemoveEntrada}
                  enabledButtons={false}
                  maxHeight="60vh"
                />
                  <Button 
                    fullWidth 
                    size="small" 
                    color="success" 
                    onClick={handleFinalizarEntrada}
                    disabled={loading}
                  >
                    {loading?
                      <CircularProgress size="30px" color="success" />
                      :
                      <Iconify
                        icon="eva:checkmark-fill" 
                        width={30}
                        height={30} 
                      />
                    }
                  </Button>
              </ContentDiv>
            ]}
          />
        }   
      />
    </div>
  )
}