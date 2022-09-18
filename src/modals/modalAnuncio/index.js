import PropTypes from 'prop-types'
import { useState, useEffect, Fragment } from 'react'
import { 
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
import { ModalAnuncioForm } from './ModalAnuncioForm'
import Iconify from 'src/components/Iconify'
import api from 'src/config/api'
import { fDateSimple } from 'src/utils/formatTime'

ModalAnuncio.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
}

const TIME = 500 

export function ModalAnuncio({ isOpen, handleClose }) {
  const [anuncioList, setAnuncioList] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [hideForm, setHideForm] = useState(false)

  useEffect(() => {
    getAnuncioList()
  }, [])

  const getAnuncioList = async() => {
    const { data } = await api.get('/anuncio/simple')
    setAnuncioList(data)
  }

  const handleCloseAnuncio = () => {
    closeForm()
    handleClose()
  }

  const handleNew = () => {
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

  const theme = useTheme()

  return (
    <>
      <ModalCustom
        isOpen={isOpen}
        handleClose={handleCloseAnuncio}
        modalWidth='940px'
        content={
          <Grid>
            <PageHeaderList
              title='Anúncio'
              buttonTitle='Novo anúncio'
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
                <ModalAnuncioForm
                  closeForm={closeForm}
                  getAnuncioList={getAnuncioList}
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
              {anuncioList.map((item, index) => {
                const { titulo, texto, data } = item
                return (
                  <Fragment key={index}>
                    {index !== 0 && <Divider />}
                    <ListItem disableGutters>
                      <ListItemAvatar>
                        <Avatar variant='rounded' sx={{backgroundColor: theme.palette.primary.main}}>
                          <Iconify 
                            icon="eva:info-outline" 
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
                              {titulo} &nbsp;
                              ({fDateSimple(data)})
                            </Typography>
                          </>
                        }
                        secondary={<>{texto}</>}
                      />
                    </ListItem>
                  </Fragment>
                )
              })}
            </List>
          </Grid>
        }   
      />  
    </>
  )
}
