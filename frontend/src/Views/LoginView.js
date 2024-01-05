import { Container, Grid } from '@mui/material'
import React, { useContext, useState } from 'react'
import LoginForm from '../Components/LoginForm'
import { AuthContext } from '../Components/AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { enqueueSnackbar } from 'notistack'
import * as c from '../utils/Constants'

function LoginView() {
  const [data, setData] = useState({
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const {setAccess, setRefresh} = useContext(AuthContext)
  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    axios.post('users/login/', data)
        .then((res) => {
            setSubmitting(false)
            setErrors({})
            setAccess(res.data.access)
            setRefresh(res.data.refresh)
            enqueueSnackbar('Login successful.', {
                variant: 'success'
            })
            navigate('/')
        }).catch((err) => {
            setSubmitting(false)
            setErrors({})
            setData({
                ...data,
                password: ''
            })
            if(err.response?.status === 422) {
                setErrors(err.response.data.details)
            }
            else if(err.response?.status === 401) {
                enqueueSnackbar('Invalid credentials.', {
                    variant: 'error'
                })
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
                <LoginForm data={data} setData={setData} errors={errors} handleSubmit={handleSubmit} submitting={submitting}/>
            </Grid>
            <Grid item xs={0} sm={1} md={3}></Grid>
        </Grid>
    </Container>
  )
}

export default LoginView
