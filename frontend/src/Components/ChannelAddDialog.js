
import { Box, CircularProgress, Dialog, DialogContent, IconButton, TextField, Toolbar, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { grey } from '@mui/material/colors'
import React from 'react'
import { LoadingButton } from '@mui/lab';

function ChannelAddDialog({ info, setInfo, handleClose, handleSubmit }) {
  return (
    <Dialog open={info.show} sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "750px",
            minWidth: "300px",
          },
        },
      }}>
        <Toolbar sx={{background: grey[200], color: grey[700]}} >
            <Typography variant='h6'>Create a new channel</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton onClick={() => handleClose()}>
                <CloseIcon />
            </IconButton>
        </Toolbar>
        <DialogContent>
            <form onSubmit={(e) => handleSubmit(e)}>
                <TextField label="title" margin="none" sx={{mb: 1}} error={Boolean(info.errors.title)} helperText={info.errors.title && info.errors.title[0]} fullWidth value={info.item.title} onChange={(e) => {
                setInfo({
                    ...info,
                    item: {
                    title: e.target.value
                    }
                })
                }}></TextField>
                <LoadingButton loading={info.submitting} variant="contained" sx={{mt: 1}} fullWidth type="submit" loadingIndicator={<CircularProgress color="inherit" size={24}/>}>Create</LoadingButton>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default ChannelAddDialog
