import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, useMediaQuery } from '@mui/material'
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import React from 'react'
import * as c from '../utils/Constants'

const customSytles = (theme) => (
    {
        sidebar: {
            overflowY: 'auto',
            '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                zIndex: theme.zIndex.appBar - 1,
                width: c.drawerWidthxs,
                [theme.breakpoints.up("sm")]: {
                    width: c.drawerWidthsm,
                    height: `calc(100vh - ${c.toolbarHeightsm}px)`,
                    top: c.toolbarHeightsm
                },
                [theme.breakpoints.up("md")]: {
                    width: c.drawerWidthmd
                },
                [theme.breakpoints.up("lg")]: {
                    width: c.drawerWidthlg
                },
            }
        },
        list: {
            py: 0
        },
        listItemBox: {
            py: 1,
            px: 2
        }
    }
)

function UserSidebar({mobileOpen, mobileToggle, users, handleAddOpen, handleEditOpen, channelUser}) {
    const isSmAndUp = useMediaQuery("(min-width:600px)")
    const isOwner = channelUser.role === 2
    const determineUserRoleName = (id) => {
        switch(id) {
            case 2:
                return 'Owner'
            case 1:
                return 'Inviter'
            default:
                return 'User' 
        }
    }
    const userList = (
        <List sx={(theme) => customSytles(theme).list}>
            {channelUser.role !== 0 && (
                <>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleAddOpen}>
                            <Box display="flex" alignItems="center" justifyContent="center" width="100%" sx={{my: '4px'}}>
                                <GroupAddIcon sx={{mr: 1}}/>
                                Invite
                            </Box>
                        </ListItemButton>
                    </ListItem>
                    <Divider />
                </>
            )}
            {users.map((user, i) => (
                <Box key={i}>
                    <ListItem disablePadding>
                        {isOwner && channelUser.user.id !== user.user.id ? (
                            <ListItemButton onClick={() => handleEditOpen(i)}>
                                <ListItemText primary={user.user.username} secondary={determineUserRoleName(user.role)}/>
                            </ListItemButton>
                        ) : (
                            <Box width="100%" sx={(theme) => customSytles(theme).listItemBox}>
                                <ListItemText primary={user.user.username} secondary={determineUserRoleName(user.role)}/>
                            </Box>
                        )}
                    </ListItem>
                    <Divider />
                </Box>
            ))}
        </List>
    )
  return (
    <>
        {isSmAndUp ? (
        <Drawer
            variant="permanent"
            anchor="right"
            sx={(theme) => customSytles(theme).sidebar}
        >
        {userList}
        </Drawer>
        ) : (
            <Drawer
            variant="temporary"
            anchor="right"
            open={mobileOpen}
            onClose={mobileToggle}
            sx={(theme) => customSytles(theme).sidebar}
        >
        {userList}
        </Drawer>
        )}
    </>
  )
}

export default UserSidebar