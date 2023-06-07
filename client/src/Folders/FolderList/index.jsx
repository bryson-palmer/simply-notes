import { useCallback, useState } from 'react'

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  IconButton,
  TextField,
  Box,
} from '@mui/material'

import { FolderOpen, CreateNewFolder } from '@mui/icons-material'
import { useFolders } from '@/store/store-selectors'
// import { Form } from 'react-router-dom'

const FolderList = () => {
  const { palette } = useTheme()
  const [isNewFolder, setIsNewFolder] = useState(false)
  // console.log('isnewfolder:', isNewFolder)
  const handleNewFolder = useCallback(
    () => setIsNewFolder(!isNewFolder),
    [isNewFolder]
  )
  const handleFolderClick = useCallback(() => {}, [])
  const folders = useFolders()
  return (
    <Box
      sx={{
        // if window gets to small, hide folders
        display: { sm: "none", md: "block" },
        width: '10%',
        height: '75vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingTop: 0,
        paddingRight: '1rem',
        bgcolor: 'transparent',
        borderRight: `1px solid ${palette.grey[800]}`,
      }}
    >
      {/* Folder List Header */}
      <ListItem
        disablePadding
        dense
      >
        <IconButton onClick={handleNewFolder}>
          <CreateNewFolder
            sx={{
              color: palette.secondary[400],
              '&:hover': { color: palette.secondary[100] },
            }}
            size='large'
          />
        </IconButton>
      </ListItem>

      {/* Folder List */}
      <List>
        {isNewFolder ? (
          <ListItem
            dense
            disablePadding
            sx={{
              borderRadius: '1rem',
              '&:hover': { backgroundColor: palette.background.light },
            }}
          >
            <ListItemButton>
              <ListItemIcon>
                <FolderOpen />
                <TextField autoFocus id='folderName' />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        ) : null}

        {folders?.map(({ id, title }) => {
          const labelId = `folders-list-label-${id}`

          return (
            <ListItem
              dense
              disablePadding
              key={labelId}
              sx={{
                borderRadius: '1rem',
                '&:hover': { backgroundColor: palette.background.light },
                '& [class*=MuiListItemIcon-root]': {color: palette.secondary[400]}
              }}
            >
              <ListItemButton
                disableGutters
                onClick={handleFolderClick(id)}
              >
                <ListItemIcon>
                  <FolderOpen />
                  <ListItemText
                    sx={{paddingLeft: '.3rem'}}
                    primary={title} 
                  />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}

export default FolderList
