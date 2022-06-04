import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Container, 
  Grid, 
  Typography, 
  List, 
  ListItem,
  ListItemText, 
  Avatar,
  ListItemAvatar,
  Divider,
  Grow,
  Paper
} from '@mui/material'
import { PageHeaderList } from 'src/components/PageHeaderList'
import { ModalCustom } from 'src/components/ModalCustom'
import { TableMoreMenu } from 'src/components/TableMoreMenu'
import { ModalCategoriaForm } from './ModalCategoriaForm'
import Label from '../../components/Label'
import Iconify from 'src/components/Iconify'
import api from 'src/config/api'

ModalCategoria.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
}

const TIME = 1000 

export default function ModalCategoria({ isOpen, handleClose }) {
  const [categoriaList, setCategoriaList] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [hideForm, setHideForm] = useState(false)
  const [selectedCategoria, setSelectedCategoria] = useState(null)


  useEffect(() => {
    getCategoriaList()
  }, [])

  const getCategoriaList = async() => {
    const { data } = await api.get('/categoria/list')
    setCategoriaList(data)
  }

  const handleChangeStatus = async(id) => {
    await api.put('/categoria/status', { id })
    getCategoriaList()
  }

  const handleEdit = (categoria) => {
    setSelectedCategoria(categoria)
    setIsEdit(true)
    openForm()
  } 

  const handleNew = () => {
    setSelectedCategoria(null)
    setIsEdit(false)
    openForm()
  }

  const openForm = () => {
    setHideForm(true)
    setTimeout(() => setIsFormOpen(true), 5)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setTimeout(() => setHideForm(false), TIME)
  }

  return (
    <Container>
      <ModalCustom
        isOpen={isOpen}
        handleClose={handleClose}
        modalWidth='500px'
        content={
          <Grid>
          <PageHeaderList
            title='Categoria'
            buttonTitle='Nova categoria'
            addButton={handleNew}
          />
            <Grow
              in={isFormOpen}
              timeout={TIME}
              style={{ display: `${hideForm? 'block':'none'}`}}
            >
              <Paper elevation={0}>
                <ModalCategoriaForm
                  isEdit={isEdit}
                  closeForm={closeForm}
                  selectedCategoria={selectedCategoria}
                  getCategoriaList={getCategoriaList}
                />
              </Paper>
            </Grow>
            <List
              sx={{
                overflow: 'auto',
                width: '100%',
                maxHeight: '60vh',
              }}
            >
              {categoriaList.map((item, index) => {
                const { nome, cor, status } = item
                return (
                  <>
                    {index !== 0 && <Divider />}
                    <ListItem key={index} disableGutters>
                      <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: `#${cor}` }}>
                          <Iconify 
                            icon="eva:pricetags-outline" 
                            width={24} 
                            height={24} 
                          />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <>
                            <Typography
                              component="span"
                              variant="subtitle1"
                            >
                              {nome} &nbsp; 
                            </Typography>
                            <Label variant="ghost" color={(!status && 'error') || 'success'}>
                              {status? 'Ativo':'Inativo'}
                            </Label>
                          </>
                        }
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              Descrição - &nbsp; 
                            </Typography>
                            {"posibiliade de uma breve descrição na categoria ..."}
                          </>
                        }
                      />
                      <TableMoreMenu
                        status={item.status}
                        handleChangeStatus={() => handleChangeStatus(item.id_categoria)}
                        handleEdit={() => handleEdit(item)}
                      />
                    </ListItem>
                  </>
                )
              })}
            </List>
          </Grid>
        }   
      />  
    </Container>
  )
}
