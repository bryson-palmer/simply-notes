import { useCallback, useState } from 'react'

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  IconButton,
  Box,
} from '@mui/material'

import { FolderOpen, CreateNewFolder } from '@mui/icons-material'
import { useFolders } from '@/store/store-selectors'
import FolderForm from '@/Folders/FolderForm'

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
        width: 'clamp(160px, 15%, 240px)',
        height: '75vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingTop: '1rem',
        marginRight: '0.5rem',
        bgcolor: 'transparent',
        borderRight: `1px solid ${palette.grey[800]}`,
      }}
    >
      {/* Folder List Header */}
      <ListItem
        sx={{ marginBottom: '1rem' }}
        secondaryAction={
          <IconButton onClick={handleNewFolder}>
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
        <FolderForm/>

        {folders?.map(({ id, title }) => {
          const labelId = `folders-list-label-${id}`

          return (
            <ListItem
              dense
              key={labelId}
              sx={{
                borderRadius: '0.5rem',
                '&:hover': { backgroundColor: palette.background.light },
                '& [class*=MuiListItemIcon-root]': {
                  color: palette.secondary[400],
                  minWidth: 'auto',
                  paddingRight: '1rem'
                }
              }}
            >
              <ListItemButton
                disableGutters
                onClick={handleFolderClick(id)}
              >
                <ListItemIcon>
                  <FolderOpen />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{ noWrap: true }}
                  sx={{ color: palette.secondary[400] }}
                  primary={title} 
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
