import { useCallback, useEffect, useMemo, useState } from 'react'

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
import { useDeleteFolder, useScreenSize, useSelectedFolderID, useSetSelectedFolderID } from '@/store/store-selectors'
import EmptyState from '@/UI/EmptyState'
import StyledTooltip from '@/UI/StyledTooltip'

const FolderList = () => {
  const { palette } = useTheme()
  const folders = useFolders()
  const deleteFolder = useDeleteFolder()
  const screenSize = useScreenSize()
  const selectedFolderID = useSelectedFolderID()
  const setSelectedFolderID = useSetSelectedFolderID()

  const [editableFolderID, setEditableFolderID] = useState('')
  const [isNewFolder, setIsNewFolder] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const isDesktop = useMemo(() => screenSize === 'large' || screenSize === 'desktop', [screenSize])
  const folderListWidth = useMemo(() => {
    if (screenSize === 'large') return 250
    if (screenSize === 'tablet') return 200
    if (screenSize === 'desktop' || screenSize === 'mobile') return 176
  }, [screenSize])

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
        width: folderListWidth,
        paddingTop: '0.5rem',
        bgcolor: 'transparent',
        borderRight: isDesktop ? 'none' : `thin solid ${palette.grey[800]}`,
        borderTopRightRadius: isDesktop ? 'none' : '0.5rem'
      }}
    >
      {/* Folder List Header */}
      <ListItem
        sx={{
          height: '49.5px',
          borderBottom: `thin solid ${palette.grey[800]}`
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
              title={isDesktop ? 'Add folder' : ''}
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 400 }}
            >
              <CreateNewFolder
                id="newFolderButton"
                sx={{
                  color: palette.secondary[400],
                  '&:hover': { color: palette.secondary[100] },
                }}
              />
            </StyledTooltip>
          </IconButton>
        }
      />

      {/* Folder List */}
      <List
        sx={{
          height: '88vh',
          overflow: 'auto',
          paddingRight: '0.5rem',
          paddingLeft: '1rem',
          borderRight: isDesktop ? `thin solid ${palette.grey[800]}` : 'none',
        }}
      >
        {isNewFolder ? (
          <FolderForm
            setEditableFolderID={setEditableFolderID}
            setIsNewFolder={setIsNewFolder}
            onBlur={() => {
              /* noop (we want newFolder form to stick around onBlur. Otherwise behavior gets messy) */
            }}
          />
        ) : null}

        {folders.length ? (
          folders?.map(({ id, folderName }) => {
            const labelId = `folders-list-label-${id}`

            return id == editableFolderID ? (
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
                onDoubleClick={() => handleFolderDoubleClick(id)}
                secondaryAction={
                  selectedFolderID === id ? (
                    <>
                      <IconButton
                        id='anchorEl'
                        aria-controls='IconButton'
                        aria-label='IconButton'
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleAnchorElClick}
                        sx={{
                          color: palette.grey[400],
                        }}
                      >
                        <MoreVert 
                          id='optionsFolder'
                        />
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
                          '& [class*=MuiList-root]': {
                            padding: 0
                          }
                        }}
                      >
                        <MenuItem
                          id='editFolderButton'
                          onClick={() => {
                            setEditableFolderID(id)
                            handleAnchorElClose()
                          }}
                          sx={{
                            minHeight: 0,
                            '&:hover': {
                              backgroundColor: palette.background.light,
                            },
                            '& [class*=MuiButtonBase-root]': {
                              minHeight: 0,
                            }
                          }}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          id='deleteFolderButton'
                          onClick={() => {
                            handleFolderDelete(id)
                          }}
                          sx={{
                            minHeight: 0,
                            '&:hover': {
                              backgroundColor: palette.background.light,
                            },
                            '& [class*=MuiButtonBase-root]': {
                              minHeight: 0,
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
                  backgroundColor:
                    selectedFolderID === id
                      ? palette.background.light
                      : 'inherit',
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
                  sx={{ '&:hover': { backgroundColor: 'transparent' } }}
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
          <EmptyState
            EmptyIcon={Icon}
            isNewFolder={isNewFolder}
            text={'No folders'}
          />
        )}
      </List>
    </Box>
  )
}

export default FolderList
