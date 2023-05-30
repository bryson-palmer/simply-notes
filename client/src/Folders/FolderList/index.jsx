import { useCallback } from 'react'

import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material'

import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { useFolders } from '@/store/store-selectors';

const FolderList = () => {
  const { palette } = useTheme()
  const handleFolderClick = useCallback( () => {}, [])
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
        <List>
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
                //disableRipple
                //size='small'
                onClick={handleFolderClick(id)}
              >
              <ListItemIcon>
                <FolderOpenIcon/>
                <ListItemText primary={title}/>
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
