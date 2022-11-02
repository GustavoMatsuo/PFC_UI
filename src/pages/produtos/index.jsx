import { useState, useEffect, useContext, useCallback } from 'react'
import { 
  Grid, 
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { ModalEdit } from 'src/components/ModalEdit'
import { ProdutoForm } from './ProdutoForm'
import { ProdutoCard } from './ProdutoCard'
import { ModalCategoria } from 'src/modals/modalCategoria'
import api from 'src/config/api'
import { FabAdd } from 'src/components/FabAdd'
import { SnackBarContext } from 'src/context/Snackbar'
import Iconify from '../../components/Iconify'
import { debounce } from 'lodash'
import { ProdutoSideBar } from './ProdutoSideBar'

const SearchStyle = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  borderRadius: '8px',
  '& fieldset': {
    border: 'none'
  },
}))

export default function Produto() {
  const [produtoList, setProdutoList] = useState({list:[], total:0})
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedProduto, setSelectedProduto] = useState(null)
  const [fornecedorList, setFornecedorList] = useState([])
  const [categoriaList, setCategoriaList] = useState([])
  const [showCategoria, setShowCategoria] = useState(false)
  const [order, setOrder] = useState('asc')
  const [name, setName] = useState('')
  const [tags, setTags] = useState([])
  const [isOpenFilter, setIsOpenFilter] = useState(false)

  const { showSnack } = useContext(SnackBarContext)

  useEffect(() => {
    getProdutoList(name, order, tags)
    getFornecedorNameList()
    getCategoriaNameList()
  }, [])

  const getProdutoList = async(name, order, tags) => {
    let stringTag = ""
    tags.map((tag, index) => {
      if((index+1) === tags.length) {
        stringTag = `${stringTag}${tag}`
      } else {
        stringTag = `${stringTag}${tag};`
      }
    }) 
    const { data } = await api.get('/produto', {
      params: { name, order, tags:stringTag }
    })
    setProdutoList(data)
  }

  const getFornecedorNameList = async() => {
    const { data } = await api.get('/fornecedor/simple')
    setFornecedorList(data)
  }

  const getCategoriaNameList = async() => {
    const { data } = await api.get('/categoria/simple')
    setCategoriaList(data)
  }

  const handleRequestSort = () => {
    const isAsc = order === 'asc'? 'desc' : 'asc'
    setOrder(isAsc)
    getProdutoList(name, isAsc, tags)
  }

  const handleFilter = useCallback(
    debounce((name, order, tags) => {
      getProdutoList(name, order, tags)
    }, 500),
  [])

  const handleFilterByName = (value) => {
    setName(value)
    handleFilter(value, order, tags)
  }

  const handleChangeCategoria = (value) => {
    const exist = tags.some(item => item === value)
    let newTags = tags
    if(exist) {
      newTags = newTags.filter(tag => { if(tag !== value) return tag })
    } else {
      newTags.push(value)
    }
      
    setTags(newTags)
    getProdutoList(name, order, newTags)
  }

  const clearTags = () => {
    setTags([])
    getProdutoList(name, order, [])
    setIsOpenFilter(false)
  }

  const handleChangeStatus = async(id) => {
    await api.put('/produto/status', { id }).then(() => {
      showSnack("Status atualizado", "success")
    }).catch(e => {
      showSnack("Falha ao atualizar status", "error")
    })
    getProdutoList(name, order, tags)
  }

  const handleEdit = (produto) => {
    setSelectedProduto(produto)
    setIsEdit(true)
    setShowModal(true)
  } 

  const handleNew = () => {
    setIsEdit(false)
    setShowModal(true)
  }

  const openCategoria = () => {
    setShowCategoria(true)
  }

  const closeCategoria = () => {
    setShowCategoria(false)
    getCategoriaNameList()
  }

  return (
    <>
      <FabAdd addFunc={handleNew}/>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SearchStyle
            fullWidth
            onChange={value => handleFilterByName(value.nativeEvent.target.value)}
            type='text'
            placeholder="Filtro"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{marginRight: '8px'}}>
                  <IconButton onClick={handleRequestSort} edge="end"  sx={{marginRight: '4px'}}>
                    <Iconify icon={order === 'asc'? 'bi:sort-up':'bi:sort-down'}/>
                  </IconButton>
                  <IconButton onClick={() => setIsOpenFilter(true)} edge="end">
                    <Iconify icon='eva:options-2-outline'/>
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        {produtoList.list.map((product, index) => (
          <Grid key={index} item xs={12} sm={4} md={3} xl={2}>
            <ProdutoCard 
              product={product}
              onChangeStatus={() => handleChangeStatus(product.id_produto)}
              onEdit={() => handleEdit(product)}
            />
          </Grid>
        ))}
      </Grid>

      <ModalEdit
        isOpen={showModal}
        handleClose={() => setShowModal(false)}
        modalWidth='500px'
        title={isEdit? 'Atualizar produto':'Novo produto'}
        form={
          <ProdutoForm
            isEdit={isEdit}
            selectedProduto={selectedProduto}
            closeModal={() => setShowModal(false)}
            getProdutoList={() => getProdutoList(name, order, tags)}
            fornecedorList={fornecedorList}
            categoriaList={categoriaList}
            openCategoria={openCategoria}
          />
        }   
      />
      <ModalCategoria
        isOpen={showCategoria}
        handleClose={closeCategoria}
      />
      <ProdutoSideBar
        isOpenFilter={isOpenFilter}
        onCloseFilter={() => setIsOpenFilter(false)}
        categoriaList={categoriaList}
        onChangeCategoria={handleChangeCategoria}
        categoriaSelected={tags}
        onClear={clearTags}
      />
    </>
  )
}
