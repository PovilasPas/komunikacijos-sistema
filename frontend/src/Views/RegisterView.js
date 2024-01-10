import { Container, Grid } from '@mui/material'
import React, { useContext, useState } from 'react'
import RegisterForm from '../Components/RegisterForm'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { enqueueSnackbar } from 'notistack'
import * as c from '../utils/Constants'

function RegisterView() {
    const [data, setData] = useState({
        username: '',
        password: '',
        password_confirmation: ''
    })
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitting(true)
        axios.post('users/register/', data)
            .then(() => {
                setSubmitting(false)
                setErrors({})
                enqueueSnackbar('Registration successful.', {
                    variant: 'success'
                })
                navigate('/Login')
            }).catch((err) => {
                setSubmitting(false)
                setErrors({})
                setData({
                    username: data.username,
                    password: '',
                    password_confirmation: ''
                })
                if(err.response?.status === 422) {
                    setErrors(err.response.data.details)
                }
                else if(err.response?.status === 500) {
                    enqueueSnackbar(c.errorMessage500, {
                        variant: 'error'
                    })
                }
                else if(!err.response && err.request) {
                    enqueueSnackbar(c.errorMessageOff, {
                        variant: 'error'
                    })
                }
                else console.log(err)
            })
    }
  return (
    <Container sx={{flex: 1}}>
        <Grid container sx={{height: '100%', alignItems: 'center'}}>
            <Grid item xs={0} sm={1} md={3}></Grid>
            <Grid item xs={12} sm={10} md={6}>
                <RegisterForm data={data} setData={setData} errors={errors} handleSubmit={handleSubmit} submitting={submitting}/>
            </Grid>
            <Grid item xs={0} sm={1} md={3}></Grid>
        </Grid>
    </Container>
  )
}

export default RegisterView
