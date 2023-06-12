import { Form, Formik } from 'formik'
import { ListItem, ListItemIcon, TextField, useTheme } from '@mui/material'
import { FolderOpen } from '@mui/icons-material'
// import { useEffect } from 'react'
import { PropTypes } from 'prop-types/prop-types'
import * as yup from 'yup'
import { useCreateFolder } from '@/store/store-selectors'

const FolderFormComponent = ({ formik }) => {
  const { handleChange, values /*, submitForm */ } = formik
  console.log(formik)
  const { palette } = useTheme()

  // const folderName = document.getElementById('folderName')
  // useEffect(() => {
  //     if (folderName) {
  //         folderName.addEventListener('keyup', e => {
  //         if (/*(e.key === 'Enter') || */ (e.key === 'Tab')) {
  //             submitForm()
  //         }
  //         })
  //     }
  // }, [folderName, submitForm])

  // useEffect(() => {
  //   if (dirty && isValid) {
  //     submitForm()
  //   }
  // }, [dirty, isValid, submitForm])

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
          paddingRight: '1rem',
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
        value={values.folderName ?? ''}
        onChange={handleChange}
        sx={{
          '& [class*=MuiInputBase-root-MuiInput-root]': {
            color: palette.secondary[400],
            fontSize: '0.75rem',
          },
          '& [class*=MuiInputBase-root-MuiInput-root]:before': {
            borderBottom: 'none',
          },
          '& [class*=MuiInputBase-root-MuiInput-root]:hover:not(.Mui-disabled, .Mui-error):before':
            {
              borderBottom: 'none',
            },
          '& [class*=MuiInputBase-root-MuiInput-root]:after': {
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

const FolderForm = ({ id, folderName, setEditableFolderID }) => {
  const createFolder = useCreateFolder()

  const handleFolderSubmit = (folder) => {
    createFolder(folder)
    setEditableFolderID('')
  }

  const handleStopFolderSubmit = (e, dirty, handleSubmit) => {
    console.log("🚀 ~ file: index.jsx:102 ~ handleStopFolderSubmit ~ dirty:", dirty)
    e.preventDefault()
    if (!dirty) {
      return false
    } else {
      handleSubmit()
      return false
    }
}

  return (
    <Formik
      initialValues={{ folderName: folderName ?? '', id: id ?? '' }}
      onSubmit={handleFolderSubmit}
      validationSchema={validationSchema}
    >
      {(formik) => (
        <Form onSubmit={e => handleStopFolderSubmit(e, formik.dirty, formik.handleSubmit, formik.isSubmitting)}>
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
}

export default FolderForm
