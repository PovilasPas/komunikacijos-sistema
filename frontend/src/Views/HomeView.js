import React, { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import ChannelList from '../Components/ChannelList'
import axios from 'axios'
import { enqueueSnackbar } from 'notistack';
import { useVerifyOrRefresh } from '../utils/Hooks/VerifyOrRefreshHook';
import ChannelAddDialog from '../Components/ChannelAddDialog';
import { jwtDecode } from 'jwt-decode';
import * as c from '../utils/Constants'

function HomeView() {
  const verifyOrRefresh = useVerifyOrRefresh()
  const [channels, setChannels] = useState([])
  const [addDialog, setAddDialog] = useState({
    show: false,
    item: {
      title: ''
    },
    submitting: false,
    errors: {}
  })
  const [loaderMap, setLoaderMap] = useState({})
  useEffect(() => {
    verifyOrRefresh()
      .then((token) => {
        if(!token) return
        axios.get('channels/')
          .then((res) => {
            setLoaderMap(res.data.map((c, i) => {
              return {index: i, obj: c}
            }).filter((joined) => joined.obj.invite_pending).reduce((obj, item) => {
              return {
                ...obj,
                [item.index]: false
              }
            }, {}))
            setChannels(res.data)
        }).catch((err) => {
            if(err.response?.status === 500) {
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
      }).catch((err) => {
        if(err.response?.status === 500) {
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
  }, [])

  const handleAddDialogOpen = () => {
    setAddDialog({
      ...addDialog,
      show: true
    })
  }
  const handleAddDialogClose = () => {
    setAddDialog({
      show: false,
      item: {
        title: ''
      },
      submitting: false,
      errors: {}
    })
  }

  const handleAddDialogSubmit = (e) => {
    e.preventDefault()
    setAddDialog({
      ...addDialog,
      submitting: true
    })
    verifyOrRefresh().then((token) => {
      if(!token) return
      axios.post('channels/', addDialog.item)
      .then((res) => {
        handleAddDialogClose()
        setChannels([...channels, res.data])
        enqueueSnackbar('Channel created successfully.', {
          variant: 'success'
        })
      }).catch((err) => {
        setAddDialog({
          ...addDialog,
          submitting: false,
          errors: {}
        })
        if(err.response?.status === 422) {
          setAddDialog({
            ...addDialog,
            errors: err.response.data.details
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
    }).catch((err) => {
      if(err.response?.status === 500) {
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
  //errors
  const handleInviteAccept = (i) => {
    setLoaderMap({
      ...loaderMap,
      [i]: true
    })
    verifyOrRefresh().then((token) => {
      if(!token) return
      const claims = jwtDecode(token)
      axios.get(`channels/${channels[i].id}/users/${claims.user_id}/`)
        .then((res) => {
          const channelUser = res.data
          const data = {
            role: channelUser.role,
            has_accepted: true
          }
          axios.put(`channels/${channels[i].id}/users/${claims.user_id}/`, data)
            .then(() => {
              setChannels(channels.map((c) => {
                if(c.id === channels[i].id)
                  return {
                    ...c,
                    invite_pending: false
                  }
                return c
              }))
              const nextLoaderMap = {...loaderMap}
              delete nextLoaderMap[i]
              setLoaderMap(nextLoaderMap)
              enqueueSnackbar('Invitation accepted.', {
                variant: 'info'
              })
            }).catch((err) => {
              setLoaderMap({
                ...loaderMap,
                [i]: false
              })
              if(err.response?.status === 500) {
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
        }).catch((err) => {
          setLoaderMap({
            ...loaderMap,
            [i]: false
          })
          if(err.response?.status === 500) {
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
    })
  }
  const handleInviteDecline = (i) => {
    setLoaderMap({
      ...loaderMap,
      [i]: true
    })
    verifyOrRefresh().then((token) => {
      if(!token) return
      const claims = jwtDecode(token)
      axios.delete(`channels/${channels[i].id}/users/${claims.user_id}/`)
        .then(() => {
          setChannels(channels.filter((c) => c.id !== channels[i].id))
          const nextLoaderMap = {...loaderMap}
          delete nextLoaderMap[i]
          setLoaderMap(nextLoaderMap)
          enqueueSnackbar('Invitation declined.', {
            variant: 'info'
          })
        }).catch((err) => {
          setLoaderMap({
            ...loaderMap,
            [i]: false
          })
          if(err.response?.status === 500) {
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
    }).catch((err) => {
      if(err.response?.status === 500) {
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
    <>
     <ChannelAddDialog info={addDialog} setInfo={setAddDialog} handleClose={handleAddDialogClose} handleSubmit={handleAddDialogSubmit}/>
      <Grid container sx={{flex: 1}}>
        <Grid item xs={0} sm={1} md={3}></Grid>
        <Grid item xs={12} sm={10} md={6}>
          <ChannelList channels={channels} loaderMap={loaderMap} handleAddDialogOpen={handleAddDialogOpen} handleInviteAccept={handleInviteAccept} handleInviteDecline={handleInviteDecline}/>
        </Grid>
        <Grid item xs={0} sm={1} md={3}></Grid>
      </Grid>
    </>
  )
}

export default HomeView
