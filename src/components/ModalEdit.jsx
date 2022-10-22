import PropTypes from 'prop-types'
import { Modal, Fade, Backdrop, Typography, styled, Card, Stack } from '@mui/material'

const ContentStyle = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(2),
}))

const BodyModal = styled('div')(({ theme }) => ({
  overflowY: 'auto',
  maxHeight: '80vh',
  paddingTop: '8px'
}))

ModalEdit.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  modalWidth: PropTypes.string,
  title: PropTypes.string,
  form: PropTypes.any
}

export function ModalEdit({
  isOpen,
  handleClose,
  modalWidth,
  title,
  form
}) {
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 0,
      }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Fade in={isOpen}>
        <ContentStyle sx={{width: modalWidth}}>
          <Stack 
            mb={2}
            direction="row" 
            alignItems="center" 
            justifyContent="space-between" 
          >
            <Typography variant="h4" noMargin>
              {title}
            </Typography>
          </Stack>
          <BodyModal>
            {form}
          </BodyModal>
        </ContentStyle>
      </Fade>
    </Modal>
  )
}
