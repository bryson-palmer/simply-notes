import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import { useTheme } from '@mui/material'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import TextField from '@mui/material/TextField'
import { Form, Formik } from 'formik'
import { PropTypes } from 'prop-types/prop-types'
import * as yup from 'yup'
import useCreateFolder from '@/hooks/useCreateFolder'

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
        <FolderOpenIcon />
      </ListItemIcon>
      <TextField
        autoFocus
        id='folderName'
        name='folderName'
        placeholder='Folder Name'
        size='small'
        variant='standard'
        inputProps={{ enterKeyHint: 'enter' }}
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
    createFolder.mutate(folder)
    setEditableFolderID('')
    setIsNewFolder(false)
  }

  const handleStopFolderSubmit = async (e, dirty, handleSubmit) => {
    e.preventDefault()
    if (!dirty) {
      return false
    } else {
      await handleSubmit()
      return false
    }
  }

  const handleOnBlur = () => onBlur()

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
