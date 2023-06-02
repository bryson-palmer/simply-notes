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
    <div
      style={{
        width: '10%',
        //minWidth: 100,
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
      <ListItem>
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
              paddingLeft: '1rem',
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
                paddingLeft: '1rem',
                '&:hover': { backgroundColor: palette.background.light },
              }}
            >
              <ListItemButton
                onClick={handleFolderClick(id)}
              >
                <ListItemIcon>
                  <FolderOpen />
                  <ListItemText primary={title} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </div>
  )
}

export default FolderList
