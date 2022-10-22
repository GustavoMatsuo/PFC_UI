import PropTypes from 'prop-types'
import { useState, useEffect, Fragment } from 'react'
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
  useTheme
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

const TIME = 500 

export function ModalCategoria({ isOpen, handleClose }) {
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

  const handleCloseCategoria = () => {
    closeForm()
    handleClose()
  }

  const handleEdit = (categoria) => {
    setIsEdit(true)
    setSelectedCategoria(categoria)
    openForm()
  } 

  const handleNew = () => {
    setIsEdit(false)
    setSelectedCategoria({})
    openForm()
  }

  const openForm = () => {
    setHideForm(true)
    setTimeout(() => setIsFormOpen(true), 5)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setTimeout(() => setIsEdit(true), (TIME - 100))
    setTimeout(() => setHideForm(false), TIME)
  }

  const theme = useTheme()

  return (
    <Container>
      <ModalCustom
        isOpen={isOpen}
        handleClose={handleCloseCategoria}
        modalWidth='550px'
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
              style={{ 
                display: `${hideForm? 'block':'none'}`, 
                paddingBottom: theme.spacing(2)
              }}
            >
              <div>
                <ModalCategoriaForm
                  isEdit={isEdit}
                  closeForm={closeForm}
                  selectedCategoria={selectedCategoria}
                  getCategoriaList={getCategoriaList}
                />
              </div>
            </Grow>
            <List
              sx={{
                overflow: 'auto',
                width: '100%',
                maxHeight: '50vh',
              }}
            >
              {categoriaList.map((item, index) => {
                const { nome, cor, status } = item
                return (
                  <Fragment key={index}>
                    {index !== 0 && <Divider />}
                    <ListItem disableGutters>
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
                  </Fragment>
                )
              })}
            </List>
          </Grid>
        }   
      />  
    </Container>
  )
}
