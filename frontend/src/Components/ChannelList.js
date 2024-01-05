
import { Box, Card, CardActionArea, CardActions, CardContent, CircularProgress, Divider, Icon, IconButton, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react'
import { grey } from '@mui/material/colors';
import { Link } from 'react-router-dom';


function ChannelList({ channels, handleAddDialogOpen, handleInviteAccept, handleInviteDecline, loaderMap }) {
  return (
    <>
        <Box display="flex" alignItems="center" sx={{my: 1}}>
            <Typography variant="h5">Channel List</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton onClick={() => handleAddDialogOpen()}>
                <AddIcon />
            </IconButton>
        </Box>
        <Divider />
        {Boolean(channels.length) ? (
            <>
                {channels.map((item, i) => (
                    <Card variant='outlined' sx={{my: 1, minWidth: 300, background: grey[200], color: grey[700]}} key={i}>
                    {item.invite_pending ? (
                        <>
                            <CardContent>
                                    <Box display="flex" alignItems="center">
                                        <Typography sx={{mr: 1}}>
                                            {item.title}
                                        </Typography>
                                        <Typography sx={{color: grey[500]}}>
                                            #{item.id}
                                        </Typography>
                                    </Box>
                            </CardContent>
                            <CardActions disableSpacing sx={{pt: 0}}>
                                <IconButton color="inherit" onClick={() => handleInviteAccept(i)} disabled={loaderMap[i]}>
                                    <CheckIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleInviteDecline(i)} disabled={loaderMap[i]}>
                                    <CloseIcon/>
                                </IconButton>
                                {loaderMap[i] && <CircularProgress color="inherit" size="1.5rem" sx={{margin: 1}}/>}
                            </CardActions>
                        </>
                    ) : (
                        <CardActionArea LinkComponent={Link} to={`/channels/${item.id}`}>
                            <CardContent>
                                <Box display="flex" alignItems="center">
                                    <Typography sx={{mr: 1}}>
                                        {item.title}
                                    </Typography>
                                    <Typography sx={{color: grey[500]}}>
                                        #{item.id}
                                    </Typography>
                                    <IconButton disabled>
                                        <Icon/>
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </CardActionArea>
                    )}
                    </Card>
                ))}
            </>
        ) : (
            <Typography variant='h6' textAlign="center">No channels were found</Typography>
        )}
        <Divider />
    </>
  )
}

export default ChannelList
