import React, { useCallback, useEffect, useMemo, useState } from 'react'

import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import { ALL_NOTES_ID, INITIAL_NOTE } from '@/constants/constants'
import FolderForm from '@/Folders/FolderForm'
import useDeleteFolder from '@/hooks/useDeleteFolder'
import useGetFolders from '@/hooks/useGetFolders'
import { useScreenSize, useStore } from '@/store/store'
import StyledTooltip from '@/ui/StyledTooltip'

const FolderList = React.memo(() => {
  const [editableFolderID, setEditableFolderID] = useState('')
  const [isNewFolder, setIsNewFolder] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const { palette } = useTheme()

  // Store
  const screenSize = useScreenSize()
  const selectedFolderID = useStore(store => store.selectedFolderID)
  const setSelectedFolderID = useStore(store => store.setSelectedFolderID)
  const setCurrentNote = useStore(store => store.setCurrentNote)
  const setIsNewNote = useStore(store => store.setIsNewNote)
  const selectedNoteID = useStore(store => store.selectedNoteID)
  const setSelectedNoteID = useStore(store => store.setSelectedNoteID)
  const noteByFolderID = useStore(store => store.noteByFolderID)
  const setNoteByFolderID = useStore(store => store.setNoteByFolderID)

  // Api
  const deleteFolder = useDeleteFolder()
  const { data: folders = [], isFetching: foldersIsFetching, isLoading: foldersIsLoading } = useGetFolders()
  
  const isDesktop = useMemo(() => screenSize === 'large' || screenSize === 'desktop', [screenSize])
  const folderListWidth = useMemo(() => {
    if (screenSize === 'large') return 250
    if (screenSize === 'tablet') return 200
    if (screenSize === 'desktop' || screenSize === 'mobile') return 176
  }, [screenSize])
  
  const isDisabled = useMemo(() => {
    if (folders?.length === 1 && folders[0]?.id === ALL_NOTES_ID) {
      return true
    } else {
      return false
    }
  }, [folders])
  
  const open = useMemo(() => Boolean(anchorEl), [anchorEl])
  
  const handleNewFolder = useCallback(() => {
    console.log('[NEW_FOLDER]')
    setIsNewFolder(prevState => {
      if (prevState) {
        setEditableFolderID('')
      }
      return !prevState
    })
  }, [])
  
  const handleFolderClick = useCallback(id => {
    if (id === selectedFolderID) return

    console.log('[FOLDER_CLICK]', id)
    setSelectedFolderID(id)
    if (id !== ALL_NOTES_ID) {
      // previously selected noteID by folder id
      const noteID = noteByFolderID[id]

      if (noteID) {
        console.log('  Setting selectedNoteID to lookup noteID')
        setSelectedNoteID(noteID)
        setIsNewNote(false)
      } else {
        // Without a noteID, reset selected note id and current note to stay in sync
        console.log('  Resetting note variables for new note')
        setSelectedNoteID(null)
        setCurrentNote(INITIAL_NOTE)
        setIsNewNote(true)
      }
    } else {
      // Prevent isNewNote from being true when changing folders
      console.log('  Selecting All Notes and making sure isNewNote is false')
      setIsNewNote(false)
      setSelectedNoteID(selectedNoteID) // Is this needed? seems odd to have
    }
  }, [noteByFolderID, selectedFolderID, selectedNoteID, setCurrentNote, setIsNewNote, setSelectedFolderID, setSelectedNoteID])

  const handleFolderDoubleClick = useCallback(id => {
    setEditableFolderID(id)
    setSelectedFolderID(id)
    setIsNewFolder(false)  // close New Folder form when editting another folder's name
    handleAnchorElClose()
  }, [setSelectedFolderID])

  const handleAnchorElClick = ({ currentTarget }) => setAnchorEl(currentTarget)

  const handleAnchorElClose = () => setAnchorEl(null)

  const handleFolderDelete = id => {
    handleAnchorElClose()
    setEditableFolderID('')
    deleteFolder.mutate(id)
  }

  // when editting folder is unfocused, close it (return to list folder item)
  const handleEditFolderBlur = () => {
    setEditableFolderID('')
  }

  useEffect(() => {
    console.log('1.FolderList useEffect')
    if (!folders.length || foldersIsLoading) return
    const isSelectedFolderInList = folders.some(folder => folder.id === selectedFolderID)
    // If no selected folder id or the selected folder id isn't in the list of folders
    if (!selectedFolderID || !isSelectedFolderInList) {
      console.log('  Setting selected folder id to first in list')
      console.log('  [folders[0]?.id]: ', folders[0]?.id)
      setSelectedFolderID(folders[0]?.id)
    }
  }, [folders, foldersIsLoading, selectedFolderID, setSelectedFolderID])

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
              <CreateNewFolderIcon
                id='newFolderButton'
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
        {/* New folder list item */}
        {isNewFolder ? (
          <FolderForm
            setEditableFolderID={setEditableFolderID}
            setIsNewFolder={setIsNewFolder}
            onBlur={() => {
              /* noop (we want newFolder form to stick around onBlur. Otherwise behavior gets messy) */
            }}
          />
        ) : null}

        {/* Data state */}
        {folders?.length ? (
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
                onClick={() => handleFolderClick(id)}
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
                        disabled={isDisabled}
                        sx={{
                          color: palette.grey[400],
                        }}
                      >
                        <MoreVertIcon
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
                          onClick={() => handleFolderDelete(id)}
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
                    <FolderOpenIcon />
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
        ) : null}

        {/* Loading state */}
        {!folders?.length && (foldersIsLoading || foldersIsFetching) ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress sx={{ color: palette.secondary[400] }} />
          </Box>
        ) : null}

      </List>
    </Box>
  )
})

FolderList.displayName = '/FolderList'

export default FolderList
