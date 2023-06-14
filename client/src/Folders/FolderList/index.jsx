import { useCallback, useEffect, useState } from 'react'

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from '@mui/material'

import { FolderOpen, CreateNewFolder, MoreVert } from '@mui/icons-material'
import { useFolders } from '@/store/store-selectors'
import FolderForm from '@/Folders/FolderForm'
import { useDeleteFolder, useSelectedFolderID, useSetSelectedFolderID } from '@/store/store-selectors'

const FolderList = () => {
  const { palette } = useTheme()
  const folders = useFolders()
  const deleteFolder = useDeleteFolder()
  const selectedFolderID = useSelectedFolderID()
  const setSelectedFolderID = useSetSelectedFolderID()

  const [editableFolderID, setEditableFolderID] = useState('')
  const [isNewFolder, setIsNewFolder] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const open = Boolean(anchorEl)
 
  const handleNewFolder = useCallback(() => setIsNewFolder(!isNewFolder), [isNewFolder])

  // using useCallback makes it re-render?
  const handleFolderDoubleClick = useCallback(id => {
    setEditableFolderID(id)
    setSelectedFolderID('')
    handleAnchorElClose()
  }, [setSelectedFolderID])

  const handleAnchorElClick = e => setAnchorEl(e.currentTarget)

  const handleAnchorElClose = () => setAnchorEl(null)

  const handleFolderDelete = (id) => {
    handleAnchorElClose()
    setEditableFolderID('')
    setSelectedFolderID('')
    deleteFolder(id)
  }

  useEffect(() => {
    if (!editableFolderID || !selectedFolderID) return
    if (editableFolderID !== selectedFolderID) {
      setEditableFolderID('')
    }
  }, [editableFolderID, selectedFolderID])

  return (
    <Box
      sx={{
        // if window gets to small, hide folders
        display: { sm: "none", md: "block" },
        width: 'clamp(200px, 15%, 250px)',
        height: '75vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingTop: '1rem',
        marginRight: '0.5rem',
        paddingRight: '0.5rem',
        bgcolor: 'transparent',
        borderRight: `1px solid ${palette.grey[800]}`,
      }}
    >
      {/* Folder List Header */}
      <ListItem
        sx={{
          marginBottom: '1rem',
        }}
        secondaryAction={
          <IconButton
            onClick={handleNewFolder}
            sx={{
              '& [class*=MuiListItemSecondaryAction-root': {
                right: 0
              }
            }}
          >
            <CreateNewFolder
              sx={{
                color: palette.secondary[400],
                '&:hover': { color: palette.secondary[100] },
              }}
            />
          </IconButton>
        }
      >
      </ListItem>

      {/* Folder List */}
      <List>
        {isNewFolder ? <FolderForm/> : null}

        {folders?.map(({ id, folderName }) => {
          const labelId = `folders-list-label-${id}`

          return  id == editableFolderID? (
            <FolderForm
              key={labelId}
              id={id}
              folderName={folderName}
              setEditableFolderID={setEditableFolderID}
            />
            ) : (
            <ListItem
              dense
              key={labelId}
              id={id}
              onClick={() => setSelectedFolderID(id)}
              onDoubleClick={() => handleFolderDoubleClick(id) }
              secondaryAction={
                selectedFolderID === id ? (
                  <>
                    <IconButton
                      id='anchorEl'
                      aria-controls="IconButton"
                      aria-label="IconButton"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleAnchorElClick}
                      sx={{
                        color: palette.grey[400],
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                    <Menu
                      id='menuList'
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleAnchorElClose}
                      sx={{
                        '& [class*=MuiPaper-root-MuiMenu-paper-MuiPopover-paper]': {
                          backgroundColor: palette.background.default,
                          color: palette.grey[400],
                          border: `0.5px solid ${palette.secondary[400]}`,
                        },
                      }}
                    >
                      <MenuItem
                        onClick={() => {setEditableFolderID(id); handleAnchorElClose()}}
                        sx={{
                          '&:hover': {
                            backgroundColor: palette.background.light
                          }
                        }}
                      >
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={() => {(handleFolderDelete(id))}}
                        sx={{
                          '&:hover': {
                            backgroundColor: palette.background.light
                          }
                        }}
                      >
                        Delete
                      </MenuItem>
                    </Menu>
                  </>
                ) : null
              }
              sx={{
                borderRadius: '0.5rem',
                backgroundColor: selectedFolderID === id ? palette.background.light : 'inherit',
                paddingRight: '2rem',
                '& [class*=MuiButtonBase-root-MuiListItemButton-root]': {
                  paddingRight: 0,
                  gap: '0.25rem'
                },
                '& [class*=MuiListItemIcon-root]': {
                  color: palette.secondary[400],
                  minWidth: 'auto',
                },
                '& [class*=MuiListItemSecondaryAction-root]': {
                  right: 0
                },
              }}
            >
              <ListItemButton
                disableGutters
                disableRipple
                sx={{ '&:hover': { backgroundColor: 'transparent'} }}
              >
                <ListItemIcon>
                  <FolderOpen />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{ noWrap: true }}
                  sx={{ color: palette.secondary[400] }}
                  primary={folderName} 
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}

export default FolderList
