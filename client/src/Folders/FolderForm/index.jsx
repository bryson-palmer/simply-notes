import { Form, Formik } from 'formik'
import { ListItem, ListItemIcon, TextField, useTheme } from '@mui/material'
import { FolderOpen } from '@mui/icons-material'
import { useEffect } from 'react'
import { PropTypes } from 'prop-types/prop-types'
import * as yup from 'yup'
import { useCreateFolder } from '@/store/store-selectors'

const FolderFormComponent = ({ formik }) => {
    const {handleChange, values, submitForm} = formik
    console.log(formik)
    const {palette} = useTheme()

    const folderName = document.getElementById('folderName')
    useEffect(() => {
        if (folderName) {
            folderName.addEventListener("keyup", e => {
            if ((e.key === "Enter") || (e.key === "Tab")) {
                submitForm()
            }
            })
        }
    }, [folderName, submitForm])  

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
              value={values.folderName ?? ''}
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
        handleChange: PropTypes.func,
        values: PropTypes.shape({
            folderName: PropTypes.string,
        })
    })
}

const validationSchema = yup.object({
  // id: yup
  //   .string('Must be a string'),
  folderName: yup
    .string('Enter a folder name'),
})

const FolderForm = () => {

  const createFolder = useCreateFolder()
  const handleFolderSubmit = (folder) => {
    createFolder(folder)
    // folderAPI.create(folder)
  }

  return (
    <Formik
      initialValues={{folderName:''}}
      onSubmit={handleFolderSubmit}
      validationSchema={validationSchema}
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