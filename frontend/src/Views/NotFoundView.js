import { Divider, Grid, Typography } from '@mui/material'
import React from 'react'

function NotFoundView() {
  return (
    <Grid container flex={1} alignItems="center" minWidth="300px">
        <Grid item xs={2}></Grid>
        <Grid item xs={8} textAlign="center">
            <Typography variant="h1">404</Typography>
            <Divider />
            <Typography variant="h6">Resource not found</Typography>
        </Grid>
        <Grid item xs={2}></Grid>
    </Grid>
  )
}

export default NotFoundView
