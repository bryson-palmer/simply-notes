import { Form, Formik } from 'formik'
import { folderAPI } from '@/apis/folderAPI'
import { ListItem, ListItemIcon, TextField, useTheme } from '@mui/material'
import { FolderOpen } from '@mui/icons-material'
import { useEffect } from 'react'
import { PropTypes } from 'prop-types/prop-types'

const FolderFormComponent = ({ formik }) => {
    const {handleChange, values, submitForm} = formik
    const {palette} = useTheme()

    const folderName = document.getElementById('folderName')
    useEffect(() => {
        if (folderName) {
            folderName.addEventListener("keypress", e => {
            if ((e.key === "Enter") || (e.key === "Tab")) {
                submitForm()
            }
            })
        }
    }, [folderName])  

    return (
          <ListItem
            dense
            sx={{
              height: '41px',
              borderRadius: '0.5rem',
              '&:hover': { backgroundColor: palette.background.light },
              '& [class*=MuiListItemIcon-root]': {
                color: palette.secondary[400],
                minWidth: 'auto',
                paddingRight: '1rem'
              }
            }}
          >
            <ListItemIcon>
              <FolderOpen />
            </ListItemIcon>
            <TextField
              autoFocus
              id='folderName'
              name='folderName'
              placeholder='Folder Name'
              size='small'
              variant='standard'
              value={values.title ?? ''}
              onChange={handleChange}
              sx={{
                '& [class*=MuiInputBase-root-MuiInput-root]': {
                  color: palette.secondary[400],
                  fontSize: '0.75rem'
                },
                '& [class*=MuiInputBase-root-MuiInput-root]:before': {
                  borderBottom: 'none'
                },
                '& [class*=MuiInputBase-root-MuiInput-root]:hover:not(.Mui-disabled, .Mui-error):before': {
                  borderBottom: 'none'
                },
                '& [class*=MuiInputBase-root-MuiInput-root]:after': {
                  borderColor: palette.secondary[400]
                }
              }}
            />
          </ListItem>
    )
}

FolderFormComponent.displayName = "/FolderNameForm"
FolderFormComponent.propTypes = {
    formik: PropTypes.shape({
        submitForm: PropTypes.func,
        handleChange: 
        values: 
    })
}

const FolderForm = () => {

  const handleFolderSubmit = (folder) => {
    folderAPI.CreateNewFolder(folder)
  }
  return (
    <Formik
      initialValues={{'folderName':''}}
      onSubmit={handleFolderSubmit}
      validationSchema={''}
    >
        {formik => (
            <Form
              onSubmit={formik.handleSubmit}
            >
                <FolderFormComponent
                  formik={formik}
                />
            </Form>
        )}


    </Formik>
  )
}

export default FolderForm