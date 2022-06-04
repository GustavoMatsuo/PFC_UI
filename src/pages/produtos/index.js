import { useState, useEffect } from 'react'
import { Container, Grid } from '@mui/material'
import { PageHeaderList } from 'src/components/PageHeaderList'
import { ModalEdit } from 'src/components/ModalEdit'
import { ProdutoForm } from './ProdutoForm'
import { ProdutoCard } from './ProdutoCard'
import api from 'src/config/api'

export default function EcommerceShop() {
  // const [openFilter, setOpenFilter] = useState(false)
  const [produtoList, setProdutoList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedProduto, setSelectedProduto] = useState(null)
  const [fornecedorList, setFornecedorList] = useState([])
  const [categoriaList, setCategoriaList] = useState([])

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

  return (
    <Container>
      <PageHeaderList
        title='Produtos'
        buttonTitle='Novo produto'
        addButton={handleNew}
      />

      <Grid container spacing={3}>
        {produtoList.map((product, index) => (
          <Grid key={index} item xs={12} sm={6} md={3}>
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
          />
        }   
      />
    </Container>
  )
}
