import { Form, Formik } from 'formik'
import { ListItem, ListItemIcon, TextField, useTheme } from '@mui/material'
import { FolderOpen } from '@mui/icons-material'
import { PropTypes } from 'prop-types/prop-types'
import * as yup from 'yup'
import { useCreateFolder } from '@/store/store-selectors'

const FolderFormComponent = ({ formik }) => {
  const { handleChange, values } = formik
  const { palette } = useTheme()

  return (
    <ListItem
      dense
      sx={{
        height: '41px',
        borderRadius: '0.5rem',
        '& [class*=MuiListItemIcon-root]': {
          color: palette.secondary[400],
          minWidth: 'auto',
          paddingRight: '0.25rem',
        },
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
        inputProps={{ enterkeyhint: 'enter' }}
        value={values.folderName ?? ''}
        onChange={handleChange}
        sx={{
          '& [class*=MuiInputBase-root]': {
            color: palette.secondary[400],
            fontSize: '0.75rem',
          },
          '& [class*=MuiInputBase-root]:before': {
            borderBottom: 'none',
          },
          '& [class*=MuiInputBase-root]:hover:not(.Mui-disabled, .Mui-error):before':
            {
              borderBottom: 'none',
            },
          '& [class*=MuiInputBase-root]:after': {
            borderColor: palette.secondary[400],
          },
        }}
      />
    </ListItem>
  )
}

FolderFormComponent.displayName = '/FolderNameForm'
FolderFormComponent.propTypes = {
  formik: PropTypes.shape({
    submitForm: PropTypes.func,
    handleChange: PropTypes.func,
    values: PropTypes.shape({
      folderName: PropTypes.string,
    }),
  }),
}

const validationSchema = yup.object({
  id: yup.string('Must be a string'),
  folderName: yup.string('Enter a folder name'),
})

const FolderForm = ({ id, folderName, setEditableFolderID, setIsNewFolder, onBlur }) => {
  const createFolder = useCreateFolder()

  const handleFolderSubmit = (folder) => {
    createFolder(folder)
    setEditableFolderID('')
    setIsNewFolder(false)
  }

  const handleStopFolderSubmit = (e, dirty, handleSubmit) => {
    e.preventDefault()
    if (!dirty) {
      return false
    } else {
      handleSubmit()
      return false
    }
  }

  const handleOnBlur = () => {
    console.log('handle on blur')
    onBlur()
  }

  return (
    <Formik
      initialValues={{ folderName: folderName ?? '', id: id ?? '' }}
      onSubmit={handleFolderSubmit}
      validationSchema={validationSchema}
    >
      {(formik) => (
        <Form
          onSubmit={e => handleStopFolderSubmit(e, formik.dirty, formik.handleSubmit, formik.isSubmitting)}
          onBlur={handleOnBlur}
        >
          <FolderFormComponent formik={formik} />
        </Form>
      )}
    </Formik>
  )
}

FolderForm.propTypes = {
  id: PropTypes.string,
  folderName: PropTypes.string,
  setEditableFolderID: PropTypes.func,
  setIsNewFolder: PropTypes.func,
  onBlur: PropTypes.func,
}

export default FolderForm
