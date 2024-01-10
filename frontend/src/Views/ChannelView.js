import { Box, useMediaQuery } from '@mui/material'
import { enqueueSnackbar } from 'notistack'
import UserSidebar from '../Components/UserSidebar'
import UserDialog from '../Components/UserDialog'
import Chat from '../Components/Chat'
import * as c from '../utils/Constants'
import React, { useEffect, useRef, useState } from 'react'
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

const wsUrl = process.env.REACT_APP_WS_URL



function ChannelView({showSidebar, handleSidebarToggle}) {
    const { channel } = useParams()
    const [users, setUsers] = useState([])
    const [websocketData, setWebsocketData] = useState(null)
    const [channelUser, setChannelUser] = useState({})
    const messageBoxRef = useRef(null)
    const socketRef = useRef(null)
    const [message, setMessage] =  useState({
        msg: {
            text: ''
        },
        sendingPrev: false,
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

    const handleMessageSend = () => {
        verifyOrRefresh().then((token) => {
            if(!token) return
            setMessage({
                ...message,
                sendingPrev: false,
                sending: true
            })
            axios.post(`channels/${channel}/messages/`, message.msg)
                .then(() => {
                    setMessage({
                        msg: {
                            text: ''
                        },
                        sendingPrev: true,
                        sending: false,
                        errors: {}
                    })
                }).catch((err) => {
                    setMessage({
                        ...message,
                        sendingPrev: true,
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

    useEffect(() => {
        if(message.sendingPrev && !message.sending) {
            messageBoxRef.current.children[0].children[0].focus()
            messageBoxRef.current.children[0].classList.add('Mui-focused')
        }
    }, [message.sending, message.sendingPrev])

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
                    navigate('/404', { options: { replace: true }})
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
                        navigate('/404', { options: { replace: true }})
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
                    navigate('/404', { options: { replace: true }})
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
        let isOpen = false
        const wait = verifyOrRefresh().then((token) => {
            if(!token) return
            socketRef.current = new WebSocket(`${wsUrl}channels/${channel}/messages/?token=${token}`)
            socketRef.current.onmessage = (e) => {
                const data = JSON.parse(e.data)
                setWebsocketData(data)
            }
            socketRef.current.onopen = () => {
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
                if(socketRef.current && isOpen)
                    socketRef.current.close()
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
