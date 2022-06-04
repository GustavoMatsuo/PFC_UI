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
  paddingTop: theme.spacing(1)
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
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
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
