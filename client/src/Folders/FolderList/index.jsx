import { useCallback, useEffect, useState } from 'react'

import {
  Box,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material'

import {
  CreateNewFolder,
  Folder as FolderIcon,
  FolderOpen,
  MoreVert
} from '@mui/icons-material'
import { useFolders } from '@/store/store-selectors'
import FolderForm from '@/Folders/FolderForm'
import { useDeleteFolder, useSelectedFolderID, useSetSelectedFolderID } from '@/store/store-selectors'
import EmptyState from '@/ui/EmptyState'
import StyledTooltip from '@/ui/StyledTooltip'

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
  const Icon = () => <FolderIcon />
 
  const handleNewFolder = useCallback(() => {
    // if we are about to add a new folder form, remove form from other folder
    setIsNewFolder(!isNewFolder)
    if (isNewFolder) {
      setEditableFolderID('')
    }
  }, [isNewFolder])

  // using useCallback makes it re-render?
  const handleFolderDoubleClick = useCallback(id => {
    setEditableFolderID(id)
    setSelectedFolderID(id)
    setIsNewFolder(false)  // close New Folder form when editting another folder's name
    handleAnchorElClose()
  }, [setSelectedFolderID])

  const handleAnchorElClick = e => setAnchorEl(e.currentTarget)

  const handleAnchorElClose = () => setAnchorEl(null)

  const handleFolderDelete = (id) => {
    handleAnchorElClose()
    setEditableFolderID('')
    setSelectedFolderID('')  // this doesn't seem to work?
    deleteFolder(id)
  }

  // when editting folder is unfocused, close it (return to list folder item)
  const handleEditFolderBlur = () => {
    setEditableFolderID('')
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
        width: 'clamp(175px, 25%, 250px)',
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
            <StyledTooltip
              arrow
              title="Add folder"
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 400 }}
            >
              <CreateNewFolder
              sx={{
                color: palette.secondary[400],
                '&:hover': { color: palette.secondary[100] },
              }}
            />
            </StyledTooltip>
          </IconButton>
        }
      >
      </ListItem>

      {/* Folder List */}
      <List>
        {isNewFolder ? (
          <FolderForm
            setEditableFolderID={setEditableFolderID}
            setIsNewFolder={setIsNewFolder}
            onBlur={() => {/* noop (we want newFolder form to stick around onBlur. Otherwise behavior gets messy) */}}
          />
        ) : null}

        {folders.length ? 
          (folders?.map(({ id, folderName }) => {
            const labelId = `folders-list-label-${id}`

            return  id == editableFolderID? (
              <FolderForm
                key={labelId}
                id={id}
                folderName={folderName}
                setEditableFolderID={setEditableFolderID}
                setIsNewFolder={setIsNewFolder}
                onBlur={handleEditFolderBlur}
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
                          '& [class*=MuiPaper-root]': {
                            backgroundColor: palette.background.default,
                            color: palette.grey[400],
                            border: `1px solid ${palette.secondary[200]}`,
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
                  '& [class*=MuiButtonBase-root]': {
                    paddingRight: 0,
                    gap: '0.25rem'
                  },
                  '& [class*=MuiListItemIcon-root]': {
                    color: palette.secondary[400],
                    minWidth: 'auto',
                  },
                  '& [class*=MuiListItemSecondaryAction-root]': {
                    right: 8
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
          })
        ) : (
          <EmptyState EmptyIcon={Icon} isNewFolder={isNewFolder} text={'No folders'} />
        )
        }
      </List>
    </Box>
  )
}

export default FolderList
