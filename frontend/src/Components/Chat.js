
import { Box, Divider, LinearProgress, List, ListItem, ListItemText, Paper, TextField } from '@mui/material'
import React from 'react'

const customStyles = (theme) => {
    return (
        {
            chatBox: {
                flex: 1,
                display: 'flex',
                flexFlow: 'column-reverse',
                minWidth: '300px',
                overflowY: 'auto',
            },
            messageList: {
                py: 0,
                px: 2
            },
            messageField: {
                minWidth: '300px',
                mt: 2,
                "& .MuiOutlinedInput-root": {
                    borderRadius: 0,
                    '& fieldset': {
                        borderColor: theme.palette.divider
                    }
                }
            }
        }
    )
}

function Chat({messages, currentMessage, setCurrentMessage, handleSend, innerRef}) {
  const handleKeyDown = (e) => {
    if(e.keyCode === 13 && e.shiftKey === false) {
        e.preventDefault()
        handleSend()
    }
  }
  return (
    <>
        <Paper 
            variant="outlined" 
            sx={(theme) => customStyles(theme).chatBox}
            square
        >
            <List sx={(theme) => customStyles(theme).messageList}>
                {messages.map((m, i) => (
                    <Box key={i}>
                        {i !== 0 && <Divider />}
                        <ListItem>
                            <ListItemText 
                                primary={m.user.username} 
                                secondary={m.text} 
                                sx={{overflowWrap: 'break-word'}}
                            />
                        </ListItem>
                    </Box>
                ))}
            </List>
        </Paper>
        <TextField
            ref={innerRef}
            placeholder="message"
            variant="outlined"
            margin="none"
            multiline
            maxRows={3}
            fullWidth
            error={Boolean(currentMessage.errors.text)}
            helperText={currentMessage.errors.text && currentMessage.errors.text[0]}
            disabled={currentMessage.sending}
            value={currentMessage.msg.text}
            onChange={(e) => {
                setCurrentMessage({
                    ...currentMessage,
                    msg: {
                        text: e.target.value
                    }
                })
            }}
            sx={(theme) => customStyles(theme).messageField}
            onKeyDown={handleKeyDown}
        />
        {currentMessage.sending && <LinearProgress color="primary" />}
    </>
  )
}

export default Chat
