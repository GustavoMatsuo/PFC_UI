import PropTypes from 'prop-types'
import { 
  Modal, 
  Fade, 
  Backdrop,
  styled, 
  Card
} from '@mui/material'

const ContentStyle = styled(Card)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  maxHeight: '90vh',
  padding: theme.spacing(2),
}))

ModalCustom.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  modalWidth: PropTypes.string,
  content: PropTypes.any
}

export function ModalCustom({
  isOpen,
  handleClose,
  modalWidth,
  content
}) {
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Fade in={isOpen}>
        <ContentStyle sx={{width: modalWidth}}>
          {content}
        </ContentStyle>
      </Fade>
    </Modal>
  )
}
