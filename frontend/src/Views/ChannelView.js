import { Box, useMediaQuery } from '@mui/material'
import { enqueueSnackbar } from 'notistack'
import UserSidebar from '../Components/UserSidebar'
import UserDialog from '../Components/UserDialog'
import Chat from '../Components/Chat'
import { AuthContext } from '../Components/AuthContext'
import * as c from '../utils/Constants'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useVerifyOrRefresh } from '../utils/Hooks/VerifyOrRefreshHook'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

const customStyles = (theme) => (
    {
        main: {
            display: 'flex',
            flex: 1,
            flexFlow: 'column',
            padding: 2,
            overflow: 'hidden',
            [theme.breakpoints.up("sm")]: {
                width: `calc(100% - ${c.drawerWidthsm}px)`
            },
            [theme.breakpoints.up("md")]: {
                width: `calc(100% - ${c.drawerWidthmd}px)`
            },
            [theme.breakpoints.up("lg")]: {
                width: `calc(100% - ${c.drawerWidthlg}px)`
            }
        }
    }
)
function ChannelView({showSidebar, handleSidebarToggle}) {
    const { channel } = useParams()
    const [users, setUsers] = useState([])
    const [websocketData, setWebsocketData] = useState(null)
    const [channelUser, setChannelUser] = useState({})
    const messageBoxRef = useRef(null)
    const [message, setMessage] =  useState({
        msg: {
            text: ''
        },
        sending: false,
        errors: {}
    })
    const [messages, setMessages] = useState([])
    const [userDialog, setUserDialog] = useState({
        show: false,
        addItem: {
            username: ''
        },
        updateItem: {
            role: null,
            username: ''
        },
        index: -1,
        submitting: false,
        errors: {}
    })
    const isSmAndUp = useMediaQuery("(min-width:600px)")
    const navigate = useNavigate()
    const verifyOrRefresh = useVerifyOrRefresh()

    const handleUserDialogAddOpen = () => {
        setUserDialog({
            ...userDialog,
            show: true
        })
    }
    const handleUserDialogEditOpen = (index) => {
        setUserDialog({
            ...userDialog,
            show: true,
            updateItem: {
                role: users[index].role,
                username: users[index].user.username
            },
            index: index,
        })
    }
    const handleUserDialogClose = () => {
        setUserDialog({
            show: false,
            addItem: {
                username: ''
            },
            updateItem: {
                role: null,
                username: ''
            },
            index: -1,
            submitting: false,
            errors: {}
        })
    }


    //errors
    const handleMessageSend = () => {
        verifyOrRefresh().then((token) => {
            if(!token) return
            setMessage({
                ...message,
                sending: true
            })
            axios.post(`channels/${channel}/messages/`, message.msg)
                .catch((err) => {
                    setMessage({
                        ...message,
                        sending: false,
                        errors: {}
                    })
                    if(err.response?.status === 422) {
                        setMessage({
                            ...message,
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


    const handleUserDialogAdd = (e) => {
        e.preventDefault()
        setUserDialog({
            ...userDialog,
            submitting: true
        })
        verifyOrRefresh().then((token) => {
            if(!token) return
            axios.post(`channels/${channel}/users/`, userDialog.addItem)
                .then((res) => {
                    handleUserDialogClose()
                    setUsers([...users, res.data])
                    enqueueSnackbar('User invited successfully.', {
                        variant: 'success'
                    })
                }).catch((err) => {
                    setUserDialog({
                        ...userDialog,
                        submitting: false,
                        errors: {}
                    })
                    if(err.response?.status === 422) {
                        setUserDialog({
                            ...userDialog,
                            errors: err.response.data.details
                        })
                    }
                    else if(err.response?.status === 409) {
                        enqueueSnackbar(err.response.data.detail, {
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

    const handleUserDialogUpdate = (e) => {
        e.preventDefault()
        setUserDialog({
            ...userDialog,
            submitting: true
        })
        verifyOrRefresh().then((token) => {
            if(!token) return
            const selectedUser = users[userDialog.index]
            const data = {
                role: userDialog.updateItem.role,
                has_accepted: selectedUser.has_accepted
            }
            axios.put(`channels/${channel}/users/${selectedUser.user.id}/`, data)
                .then((res) => {
                    handleUserDialogClose()
                    const nextUsers = users.map((u) => {
                        if(u.user.id === res.data.user.id) {
                            return res.data
                        }
                        return u
                    })
                    setUsers(nextUsers)
                    enqueueSnackbar('User\'s information updated successfully', {
                        variant: 'success'
                    })
                }).catch((err) => {
                    setUserDialog({
                        ...userDialog,
                        submitting: false,
                        errors: {}
                    })
                    if(err.response?.status === 422) {
                        enqueueSnackbar(err.response.data.details.role[0], {
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

    const getChannelUsers = () => {
        verifyOrRefresh().then((token) => {
            if(!token) return
            axios.get(`channels/${channel}/users/`)
            .then((res) => {
                setUsers(res.data)
            }).catch((err) => {
                if(err.response?.status === 404) {
                    navigate('/404')
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
    const getChannelMessages = () => {
        verifyOrRefresh().then((token) => {
            if(!token) return
            axios.get(`channels/${channel}/messages/`)
                .then((res) => {
                    setMessages(res.data)
                }).catch((err) => {
                    if(err.response?.status === 404) {
                        navigate('/404')
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

    const getChannelUser = () => {
        verifyOrRefresh().then((token) => {
            if(!token) return
            const claims = jwtDecode(token)
            axios.get(`channels/${channel}/users/${claims.user_id}/`)
            .then((res) => {
                setChannelUser(res.data)
            }).catch((err) => {
                if(err.response?.status === 404) {
                    navigate('/404')
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

    const initWs = () => {
        let socket = null
        let isOpen = false
        const wait = verifyOrRefresh().then((token) => {
            if(!token) return
            socket = new WebSocket(`${c.BACKEND_WS_URL}channels/${channel}/messages/?token=${token}`)
            socket.onmessage = (e) => {
                setMessage({
                    msg: {
                        text: ''
                    },
                    sending: false,
                    errors: {}
                })
                const data = JSON.parse(e.data)
                setWebsocketData(data)
            }
            socket.onopen = () => {
                isOpen = true
            }
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
        return () => {
            wait.then(() => {
                if(socket && isOpen)
                    socket.close()
            })
        }
    }


    useEffect(() => {
        getChannelUsers()
        getChannelMessages()
        getChannelUser()
        return initWs()
    }, [])

    useEffect(() => {
        if(websocketData) {
            if(channelUser.user.id === websocketData.user.id) {
                messageBoxRef.current.children[0].children[0].focus()
                messageBoxRef.current.children[0].classList.add('Mui-focused')
            }
            setMessages([...messages, websocketData])
        }
    }, [websocketData])

    useEffect(() => {
        if(isSmAndUp && showSidebar)
            handleSidebarToggle()
    }, [isSmAndUp])
  
    return (
        <>
            <UserSidebar
                mobileOpen={showSidebar} 
                mobileToggle={handleSidebarToggle} 
                users={users} 
                handleAddOpen={handleUserDialogAddOpen}
                handleEditOpen={handleUserDialogEditOpen}
                channelUser={channelUser}
            />
            {channelUser.role !== 0 && channelUser.has_accepted && 
                <UserDialog 
                    info={userDialog} 
                    setInfo={setUserDialog} 
                    handleClose={handleUserDialogClose} 
                    handleAdd={handleUserDialogAdd} 
                    handleUpdate={handleUserDialogUpdate}
                />
            }
            <Box sx={(theme) => customStyles(theme).main}>
                <Chat 
                    messages={messages} 
                    currentMessage={message} 
                    setCurrentMessage={setMessage}
                    handleSend={handleMessageSend}
                    innerRef={messageBoxRef}
                />
            </Box>
        </>
  )
}

export default ChannelView
