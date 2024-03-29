import { useEffect, useState, useCallback } from 'react'
import {
  Card,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  Grid
} from '@mui/material'
import Label from '../../components/Label'
import Scrollbar from '../../components/Scrollbar'
import api from 'src/config/api'
import { TableHeadCustom } from 'src/components/TableHead'
import { TableToolbar } from '../../components/TableToolbar'
import { TableNotFound } from 'src/components/TableNotFound'
import { fCurrency } from 'src/utils/formatNumber'
import { fDateTime } from 'src/utils/formatTime'
import { debounce } from 'lodash'
import { ModalCustom } from 'src/components/ModalCustom'
import { SaidaForm } from './SaidaForm'
import { PageHeaderList } from 'src/components/PageHeaderList'

const TABLE_HEAD = [
  { id: 'produto', label: 'Produto', alignRight: false },
  { id: 'venda', label: 'Cod. Venda', alignRight: false },
  { id: 'qtd', label: 'Quantidade', alignRight: false },
  { id: 'data_saida', label: 'Data da saida', alignRight: false },
  { id: 'valor_unitario', label: 'Valor unitário', alignRight: false },
  { id: 'desconto', label: 'Desconto', alignRight: false },
]

export default function Saida() {
  const [page, setPage] = useState(0)
  const [order, setOrder] = useState('desc')
  const [orderBy, setOrderBy] = useState('data_saida')
  const [filterName, setFilterName] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [saidaList, setSaidaList] = useState({list:[], total:0})
  const [openModal, setOpenModal] = useState(false)
  
  useEffect(() => {
    getSaidaList(
      rowsPerPage, 
      page, 
      filterName, 
      order, 
      orderBy
    )
  }, [page, rowsPerPage, order, orderBy])

  const getSaidaList = async(limit, page, name, order, orderBy) => {
    const { data } = await api.get('/saida', {
      params:{
        limit,
        skip: page * limit,
        filterBy: name,
        order, 
        orderBy
      }
    })
    setSaidaList(data)
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
        getSaidaList(limit, page, nome, order, orderBy)
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

  const handleClose = () => {
    setOpenModal(false)
  }

  const isSaidaNotFound = saidaList.list.length === 0

  return (
    <>
      <Card>
        <TableToolbar 
          placeholder='Pesquisar Saida...' 
          filterName={filterName} 
          onFilterName={handleFilterByName}
          buttonRightLabel='Baixar lista'
          buttonRight={() => setOpenModal(true)}
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
                {saidaList.list.map((row) => {
                  const { id_saida, produto, venda, qtd, data_saida, valor_unitario, desconto } = row
                  const CodVenda = venda? String(venda.id_venda).substring(0, 5):'-'
                  return (
                    <TableRow
                      hover
                      key={id_saida}
                      tabIndex={-1}
                    >
                      <TableCell component="th" scope="row">
                        {produto? produto.nome:'-'}
                      </TableCell>
                      <TableCell align="left">
                        {CodVenda}
                      </TableCell>
                      <TableCell align="left">
                        <Label variant="ghost" color='error'>
                          {qtd}
                        </Label>
                      </TableCell>
                      <TableCell align="left">{fDateTime(data_saida)}</TableCell>
                      <TableCell align="left">R$&nbsp;{fCurrency(valor_unitario)}</TableCell>
                      <TableCell align="left">R$&nbsp;{fCurrency(desconto)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>

              {isSaidaNotFound && <TableNotFound filterProps={filterName}/>}
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          rowsPerPageOptions={[1, 5, 10, 25]}
          component="div"
          labelRowsPerPage="Itens por página:"
          labelDisplayedRows={({ from, to, count }) =>`${from}–${to} de ${count !== -1 ? count : `mais que ${to}`}`}
          count={saidaList.total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, value) => setPage(value)}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
      <ModalCustom
        isOpen={openModal}
        handleClose={handleClose}
        modalWidth='550px'
        content={
          <Grid>
            <PageHeaderList title='Saida'/>
            <SaidaForm handleClose={handleClose} />
          </Grid>
        }   
      />  
    </>
  )
}