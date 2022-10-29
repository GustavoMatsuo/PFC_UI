import { useEffect, useRef, useState } from 'react'
import {
  Card,
  Typography,
  Grid,
  Autocomplete,
  TextField,
  List,
  ListItemText,
  IconButton,
  Avatar,
  ListItemAvatar,
  Tooltip,
  ListItemButton,
} from '@mui/material'
import api from 'src/config/api'
import Iconify from 'src/components/Iconify'
import { fCurrency } from 'src/utils/formatNumber'
import { VendaForm } from './VendaForm'
import { alpha, useTheme } from '@mui/material/styles'
import IMG_MOCK_PROD from '../../assets/images/barcode-amico.svg'
import IMG_MOCK from '../../assets/images/receipt-amico.svg'

export default function Venda() {
  const [produtoList, setProdutoList] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [vendaList, setVendaList] = useState([])
  const [valorTotal, setValorTotal] = useState(0)
  const [descontoTotal, setDescontoTotal] = useState(0)
  const [divHeight, setDivHeight] = useState(0)
  const [principalHeight, setPrincipalHeight] = useState(0)
  const [selectedProduto, setSelectedProduto] = useState(null)
  
  let produtoRef = useRef(null)
  let principalRef = useRef(null)

  useEffect(() => {
    getProdutoList()
  }, [])

  useEffect(() => {
    if(produtoRef.current != null) {
      setDivHeight(produtoRef.current.offsetHeight)
    }
    if(principalRef.current != null) {
      setPrincipalHeight(principalRef.current.offsetHeight)
    }  
  }, [produtoRef])

  const getProdutoList = async() => {
    const { data } = await api.get('/produto/simple')
    setProdutoList(data)
  }

  const minusProduto = () => {
    if(selectedProduto.qtd > 1) {
      let newSelectedProduto = selectedProduto
      newSelectedProduto.qtd = newSelectedProduto.qtd - 1
      setSelectedProduto(newSelectedProduto)
      handleAddProduto(newSelectedProduto)
    }
  }

  const plusProduto = () => {
    let newSelectedProduto = selectedProduto
    newSelectedProduto.qtd = newSelectedProduto.qtd + 1
    setSelectedProduto(newSelectedProduto)
    handleAddProduto(newSelectedProduto)
  }

  const removeProduto = () => {
    const newVendaList = vendaList.filter(item => {
      if(item.codigo !== selectedProduto.codigo) {
        return item
      }
    })
    setVendaList(newVendaList)
    setSelectedProduto(null)
    onChangeValorTotal(newVendaList)
  }

  const findProduto = (produto) => {
    let findProduto = null

    produtoList.map(item => {
      if(item.codigo === produto){
        findProduto = {
          ...item,
          qtd: 1
        }
      }
    })
    
    if(findProduto) {
      vendaList.map(item => {
        if(item.id_produto == findProduto.id_produto) {
          findProduto = {
            ...item,
            qtd: item.qtd + 1
          }
        }
      })

      setSelectedProduto(findProduto)
      handleAddProduto(findProduto)
      setSearchValue('')
    }
  }

  const handleAddProduto = (produtoToAdd) => {
    if(produtoToAdd) {
      let produtoFormatted = null
      const newVendaList = vendaList.filter(item => {
        if (item.id_produto === produtoToAdd.id_produto) {
          produtoFormatted = item
        }else {
          return item
        }
      })

      if(produtoFormatted) {
        produtoFormatted.qtd = produtoToAdd.qtd
      }else{
        produtoFormatted = produtoToAdd
      }
      
      const joinList = newVendaList
      joinList.unshift(produtoFormatted)

      setVendaList(joinList)
      onChangeValorTotal(joinList)
    }
  }

  const onChangeValorTotal = (newList) => {
    const valorTotal = newList.reduce(
      (prev, current) => prev + (current.valor_unitario * current.qtd), 0
    )
    const descontoTotal = newList.reduce(
      (prev, current) => prev + (current.desconto * current.qtd), 0
    )
    setValorTotal(valorTotal)
    setDescontoTotal(descontoTotal)
  }

  const clearVenda = () => {
    setVendaList([])
    setValorTotal(0)
    setDescontoTotal(0)
  }

  const theme = useTheme()

  return (
    <div style={{height: '100%'}}>
      <Grid container flexDirection='row' sx={{height: '100%'}}>
        <Grid item xs={12} md={8} xl={9} sx={{pr:3, height: '100%'}}>
          <Card sx={{p:2}} ref={el => principalRef.current = el}>
            <Typography variant="h4" noMargin sx={{pb: 2}}>
              Adicionar
            </Typography>
            <Autocomplete
              freeSolo
              fullWidth
              value={null}
              inputValue={searchValue}
              isOptionEqualToValue={(option, value) => option === value}
              onInputChange={(event, newValue) => setSearchValue(newValue)}
              onChange={(event, newValue) => findProduto(newValue)}
              options={produtoList}
              filterOptions={(options, params) => {
                if(searchValue.length > 0) {
                  let filtred = options.filter(item => {
                    if(item.id_produto === searchValue){
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
          <div 
            style={{
              paddingTop: '16px', 
              height: `calc(100% - ${principalHeight}px)`, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundImage: !(selectedProduto && selectedProduto.id_produto) && `url(${IMG_MOCK})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {selectedProduto && selectedProduto.id_produto &&
              <Card
                sx={{p: 2}}
                style={{
                  flexGrow: 1,
                  width: '45%',
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    display: 'flex', 
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Typography variant="h4" noMargin>
                    {selectedProduto.nome}
                  </Typography>
                  <Tooltip title="Remover da lista" placement="bottom" arrow>
                    <IconButton onClick={removeProduto}>
                      <Iconify 
                        sx={{color: theme.palette.error.main}}
                        icon="eva:close-fill" 
                        width={28}
                        height={28} 
                      />
                    </IconButton>
                  </Tooltip>
                </div>
                <div 
                  style={{
                    flexGrow: 1, 
                    width: '100%', 
                    backgroundImage: `url(${IMG_MOCK_PROD})`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
                <div 
                  style={{
                    width: '100%',
                    display: 'flex', 
                    flexDirection: 'row', 
                    justifyContent: 'center',
                    alignItems: 'center' 
                  }}
                >
                  <IconButton onClick={minusProduto}>
                    <Iconify 
                      sx={{color: theme.palette.primary.main}}
                      icon="eva:minus-circle-fill" 
                      width={36}
                      height={36} 
                    />
                  </IconButton>
                  <Typography
                    sx={{
                      pl: 2,
                      pr: 2,
                      textAlign: 'center'
                    }}
                  >
                    Quantidade: {selectedProduto.qtd}
                    <br/>
                    R$ {fCurrency((selectedProduto.valor_unitario - selectedProduto.desconto) * selectedProduto.qtd)}
                  </Typography>
                  <IconButton onClick={plusProduto}>
                    <Iconify 
                      sx={{color: theme.palette.primary.main}}
                      icon="eva:plus-circle-fill" 
                      width={36}
                      height={36} 
                    />
                  </IconButton>
                </div>                
              </Card>
            }
          </div>
        </Grid>
        <Grid item xs={12} md={4} xl={3} sx={{height: '100%', position: 'relative'}}>
          <Card 
            sx={{ 
              height: '100%', 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'flex-end'
            }}
          >
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
              {vendaList.map((item, index) =>{
                const actived = selectedProduto && item.id_produto === selectedProduto.id_produto 
                return (
                  <ListItemButton
                    key={index}
                    onClick={() => setSelectedProduto(item)}
                    dense
                    sx={{
                      borderRadius: 1,
                      color: actived? theme.palette.primary.main:theme.palette.text.main,
                      bgcolor: actived && alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: actived && theme.palette.primary.light
                        }}
                      >
                        <Iconify 
                          sx={{
                            color: theme.palette.primary,
                          }}
                          icon="eva:cube-outline" 
                          width={25}
                          height={25} 
                        />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={
                        <Typography variant='subtitle1'>
                          {item.nome}
                        </Typography>
                      }
                      secondary={
                        <Typography variant='body2'>
                          Valor: R$ {fCurrency((item.valor_unitario - item.desconto) * item.qtd)} ({item.qtd} UN X  R${item.valor_unitario - item.desconto})
                        </Typography>
                      }
                    />
                  </ListItemButton>
                )
              })}
            </List>
            <div ref={el => produtoRef.current = el} style={{borderTop: '1px dashed gray'}}>
              <VendaForm
                vendaList={vendaList}
                subtotal={valorTotal}
                desconto={descontoTotal}
                clearVenda={clearVenda}
              />
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}