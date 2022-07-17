import { useEffect, useRef, useState } from 'react'
import {
  Card,
  Typography,
  Grid,
  Autocomplete,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Avatar,
  ListItemAvatar
} from '@mui/material'
import { useTheme } from '@emotion/react'
import api from 'src/config/api'
import Iconify from 'src/components/Iconify'
import { fCurrency } from 'src/utils/formatNumber'
import { VendaForm } from './VendaForm'

export default function Venda() {
  const [produtoList, setProdutoList] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [vendaList, setVendaList] = useState([])
  const [valorTotal, setValorTotal] = useState(0)
  const [divHeight, setDivHeight] = useState(0)

  let produtoRef = useRef(null)

  useEffect(() => {
    getProdutoList()
  }, [])

  useEffect(() => {
    if(produtoRef.current != null) {
      setDivHeight(produtoRef.current.offsetHeight)
    }
  }, [produtoRef])

  const getProdutoList = async() => {
    const { data } = await api.get('/produto/simple')
    setProdutoList(data)
  }

  const handleAddProduto = (produto) => {
    let findProduto = null
    //FUTURE
    // if(produto && produto.codigo){
    //   findProduto = produtoList.find(item => {
    //     if(item.codigo == produto.codigo){
    //       return item
    //     }
    //   })
    // }else
    if(produto && produto.length > 5) {
      findProduto = produtoList.find(item => {
        if(item.codigo == produto){
          return item
        }
      })
    }

    if(findProduto) {
      let produtoFormatted = null
      const newVendaList = vendaList.filter(item => {
        if (item.id_produto === findProduto.id_produto) {
          produtoFormatted = item
        }else {
          return item
        }
      })

      if(produtoFormatted) {
        produtoFormatted.qtd = produtoFormatted.qtd + 1
      }else{
        produtoFormatted = {
          ...findProduto,
          qtd: 1,
        }
      }
      
      const joinList = [...newVendaList, produtoFormatted]

      setVendaList(joinList)
      onChangeValorTotal(joinList)
    }
    setSearchValue('')
  }

  const handleRemoveProduto = (produto) => {
    const newVendaList = vendaList.filter(item => {
      if(item.codigo !== produto.codigo) {
        return item
      }
    })
    setVendaList(newVendaList)
    onChangeValorTotal(newVendaList)
  }

  const onChangeValorTotal = (newList) => {
    const valorTotal = newList.reduce(
      (prev, current) => prev + (current.valor_unitario * current.qtd), 0
    )
    setValorTotal(valorTotal)
  }

  const clearVenda = () => {
    setVendaList([])
    setValorTotal(0)
  }

  const theme = useTheme()

  return (
    <div style={{height: '100%'}}>
      <Grid container flexDirection='row' sx={{height: '100%'}}>
        <Grid item xs={12} md={8} xl={9} sx={{pr:3, height: '100%'}}>
          <Card sx={{p:2}}>
            <Typography variant="h4" noMargin sx={{pb: 2}}>
              Produto
            </Typography>
            <Autocomplete
              freeSolo
              fullWidth
              value={null}
              inputValue={searchValue}
              isOptionEqualToValue={(option, value) => option == value}
              onInputChange={(event, newValue) => setSearchValue(newValue)}
              onChange={(event, newValue) => handleAddProduto(newValue)}
              options={produtoList}
              filterOptions={(options, params) => {
                if(searchValue.length > 0) {
                  let filtred = options.filter(item => {
                    if(item.id_produto == searchValue){
                      return item
                    }
                  })
                  return filtred
                }else {
                  return []
                }
              }}
              getOptionLabel={(option) => option.nome || ""}
              renderInput={(params) =>
                <TextField
                  {...params}
                  fullWidth
                  label="Insira o código de barras"
                />
              }
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={4} xl={3} sx={{height: '100%', position: 'relative'}}>
          <Card sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
            <List 
              sx={{ 
                overflow: 'auto',
                position: 'absolute', 
                top: '16px', 
                left:'16px',
                right: '16px',
                bottom: `${divHeight+16}px`
              }}
            >
              {vendaList.map((item, index) =>
                <ListItem
                  dense
                  key={index}
                  secondaryAction={
                    <IconButton  onClick={() => handleRemoveProduto(item)}>
                      <Iconify 
                        sx={{color: theme.palette.error.main}}
                        icon="eva:close-circle-outline" 
                        width={25}
                        height={25} 
                      />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <Iconify 
                        sx={{color: theme.palette.primary}}
                        icon="eva:cube-outline" 
                        width={25}
                        height={25} 
                      />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={`${item.qtd} x ${item.nome}`}
                    secondary={`Total: R$ ${fCurrency(item.valor_unitario * item.qtd)}`}
                  />
                </ListItem>
              )}
            </List>
            <div ref={el => { produtoRef.current = el }} style={{borderTop: '1px dashed gray'}}>
              <VendaForm
                vendaList={vendaList}
                subtotal={valorTotal}
                desconto={0}
                clearVenda={clearVenda}
              />
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}