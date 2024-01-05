import { Box, Checkbox, CircularProgress, Dialog, DialogContent, FormControlLabel, IconButton, TextField, Toolbar, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import CloseIcon from '@mui/icons-material/Close';
import React from 'react'
import { LoadingButton } from '@mui/lab';

function UserDialog({info, setInfo, handleClose, handleAdd, handleUpdate}) {
  return (
    <Dialog open={info.show} sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "750px",
            minWidth: "300px",
          },
        },
      }}>
      <Toolbar sx={{background: grey[200], color: grey[700]}}>
        <Typography variant='h6'>{info.index <= -1 ? 'Invite a user' : `Update ${info.updateItem.username}'s info`}</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={() => handleClose()}>
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <DialogContent>
        {info.index <= -1 ? (
          <form onSubmit={(e) => handleAdd(e)}>
            <TextField 
              label="username" 
              margin="none" 
              sx={{mb: 1}} 
              error={Boolean(info.errors.username)} 
              helperText={info.errors.username && info.errors.username[0]} 
              fullWidth 
              value={info.addItem.username} 
              onChange={(e) => {
              setInfo({
                ...info,
                addItem: {
                  username: e.target.value
                }
              })
            }}></TextField>
            <LoadingButton loading={info.submitting} variant="contained" sx={{mt: 1}} fullWidth type="submit" loadingIndicator={<CircularProgress color="inherit" size={24}/>}>Invite</LoadingButton>
          </form>
        ) : (
          <form onSubmit={(e) => handleUpdate(e)}>
            <FormControlLabel label="Can user invite other users?"  sx={{mb: 1}} control={<Checkbox checked={info.updateItem.role === 1} onChange={(e) => {
                if(e.target.checked) {
                  setInfo({
                    ...info,
                    updateItem: {
                      role: 1,
                      username: info.updateItem.username
                    }
                  })
                }
                else {
                  setInfo({
                    ...info,
                    updateItem: {
                      role: 0,
                      username: info.updateItem.username
                    }
                  })
                }
              }}></Checkbox>}/>
            <LoadingButton loading={info.submitting} variant="contained" sx={{mt: 1}} fullWidth type="submit" loadingIndicator={<CircularProgress color="inherit" size={24}/>}>Save</LoadingButton>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default UserDialog
