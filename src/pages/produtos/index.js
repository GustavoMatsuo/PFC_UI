import { useState, useEffect } from 'react'
import { Grid } from '@mui/material'
import { ModalEdit } from 'src/components/ModalEdit'
import { ProdutoForm } from './ProdutoForm'
import { ProdutoCard } from './ProdutoCard'
import { ModalCategoria } from 'src/modals/modalCategoria'
import api from 'src/config/api'
import { FabAdd } from 'src/components/FabAdd'

export default function Produto() {
  // const [openFilter, setOpenFilter] = useState(false)
  const [produtoList, setProdutoList] = useState({list:[], total:0})
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedProduto, setSelectedProduto] = useState(null)
  const [fornecedorList, setFornecedorList] = useState([])
  const [categoriaList, setCategoriaList] = useState([])
  const [showCategoria, setShowCategoria] = useState(false)

  useEffect(() => {
    getProdutoList()
    getFornecedorNameList()
    getCategoriaNameList()
  }, [])

  const getProdutoList = async() => {
    const { data } = await api.get('/produto')
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

  // const handleOpenFilter = () => {
  //   setOpenFilter(true)
  // }

  // const handleCloseFilter = () => {
  //   setOpenFilter(false)
  // }

  const handleChangeStatus = async(id) => {
    await api.put('/produto/status', { id })
    getProdutoList()
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
            getProdutoList={getProdutoList}
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
    </>
  )
}
