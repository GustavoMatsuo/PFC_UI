import { useEffect, useState } from 'react'
import {
  Card,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination
} from '@mui/material'
import Label from '../../components/Label'
import Scrollbar from '../../components/Scrollbar'
import api from 'src/config/api'
import { TableHeadCustom } from 'src/components/TableHead'
import { TableToolbar } from '../../components/TableToolbar'
import { TableNotFound } from 'src/components/TableNotFound'
import { fCurrency } from 'src/utils/formatNumber'
import { sortFilter } from 'src/utils/sortFilter'
import { fDateTime } from 'src/utils/formatTime'

const TABLE_HEAD = [
  { id: 'produto', label: 'Produto', alignRight: false },
  { id: 'venda', label: 'Cod. Venda', alignRight: false },
  { id: 'qtd', label: 'Quantidade', alignRight: false },
  { id: 'data_saida', label: 'Data da saida', alignRight: false },
  { id: 'valor_unitario', label: 'Valor unitário', alignRight: false },
]

export default function Saida() {
  const [page, setPage] = useState(0)
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('data_saida')
  const [filterName, setFilterName] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [saidaList, setSaidaList] = useState({list:[], total:0})
  
  useEffect(() => {
    getSaidaList()
  }, [page, rowsPerPage])

  const getSaidaList = async() => {
    const { data } = await api.get('/saida', {
      params:{
        limit: rowsPerPage,
        skip: page * rowsPerPage
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

  const handleFilterByName = (event) => {
    setFilterName(event.target.value)
  }

  const filteredSaida = sortFilter(saidaList.list, order, orderBy, filterName, 'data_saida')

  const isSaidaNotFound = filteredSaida.length === 0

  return (
    <>
      <Card>
        <TableToolbar 
          placeholder='Pesquisar Saida...' 
          filterName={filterName} 
          onFilterName={handleFilterByName} 
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
                {filteredSaida.map((row) => {
                  const { id_saida, produto, venda, qtd, data_saida, valor_unitario } = row
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
    </>
  )
}