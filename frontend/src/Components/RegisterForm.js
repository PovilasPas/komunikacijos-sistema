import { Card, CardContent, CircularProgress, Divider, TextField, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import React from 'react'

function RegisterForm({ data, setData, errors, handleSubmit, submitting }) {
  return (
    <Card sx={{minWidth: 300}} variant="outlined">
        <form onSubmit={(e) => handleSubmit(e)}>
            <CardContent sx={{'&.MuiCardContent-root': {pb: 2}}}>
                <Typography variant="h5">Register</Typography>
                <Divider />
                <TextField label="username" margin="normal" error={Boolean(errors.username)} helperText={errors.username && errors.username[0]} fullWidth value={data.username} onChange={(e) => {
                    setData({
                        ...data,
                        username: e.target.value
                    })
                }}/>
                <TextField label="password" margin="normal" error={Boolean(errors.password)} helperText={errors.password && errors.password[0]} type="password" fullWidth value={data.password} onChange={(e) => {
                    setData({
                        ...data,
                        password: e.target.value
                    })
                }}/>
                <TextField label="confirm password" margin="normal" error={Boolean(errors.password_confirmation)} helperText={errors.password_confirmation && errors.password_confirmation[0]} type="password" fullWidth value={data.password_confirmation} onChange={(e) => {
                    setData({
                        ...data,
                        password_confirmation: e.target.value
                    })
                }}/>
                <LoadingButton loading={submitting} variant="contained" sx={{mt: 2}} fullWidth type="submit" loadingIndicator={<CircularProgress color="inherit" size={24}/>}>Register</LoadingButton>
            </CardContent>
        </form>
    </Card>
  )
}

export default RegisterForm

