import { Card, CardContent, CircularProgress, Divider, TextField, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import React from 'react'

function LoginForm({data, setData, errors, handleSubmit, submitting}) {
  return (
    <Card sx={{minWidth: 300}} variant="outlined">
        <form onSubmit={(e) => handleSubmit(e)}>
            <CardContent sx={{'&.MuiCardContent-root': {pb: 2}}}>
                <Typography variant="h5">Login</Typography>
                <Divider />
                <TextField label="username" margin="normal" error={Boolean(errors.username)} helperText={errors.username && errors.username[0]} fullWidth value={data.username} onChange={(e) => {
                    setData({
                        ...data,
                        username: e.target.value
                    })
                }}/>
                <TextField label="password" margin="normal" type="password" error={Boolean(errors.password)} helperText={errors.password && errors.password[0]} fullWidth value={data.password} onChange={(e) => {
                    setData({
                        ...data,
                        password: e.target.value
                    })
                }}/>
                <LoadingButton loading={submitting} variant="contained" sx={{mt: 2}} fullWidth type="submit" loadingIndicator={<CircularProgress color="inherit" size={24}/>}>Login</LoadingButton>
            </CardContent>
        </form>
    </Card>
  )
}

export default LoginForm
