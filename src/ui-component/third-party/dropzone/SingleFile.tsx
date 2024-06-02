// material-ui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// third-party
import { useDropzone } from 'react-dropzone';

// project import
import RejectionFiles from './RejectionFile';
import PlaceholderContent from './PlaceHolderContent';

// types
import { CustomFile, UploadProps } from 'types/dropzone';
import { Typography } from '@mui/material';

const DropzoneWrapper = styled('div')(({ theme }) => ({
    outline: 'none',
    overflow: 'hidden',
    position: 'relative',
    padding: theme.spacing(5, 1),
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create('padding'),
    backgroundColor: theme.palette.background.paper,
    border: `1px dashed ${theme.palette.secondary.main}`,
    '&:hover': { opacity: 0.72, cursor: 'pointer' }
}));

// ==============================|| UPLOAD - SINGLE FILE ||============================== //

const SingleFileUpload = ({ error, file, setFieldValue, fileRef, sx, ...other }: UploadProps) => {
    const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
        accept: {
            'text/csv': ['.csv']
        },
        multiple: false,
        onDrop: (acceptedFiles: CustomFile[]) => {
            const updatedFiles = acceptedFiles.map((file: CustomFile) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file)
                })
            );
            setFieldValue('files', updatedFiles);
            if (fileRef) {
                fileRef.current = acceptedFiles[0];
            }
        }
    });

    const onRemove = () => {
        setFieldValue('files', null);
        if (fileRef) {
            fileRef.current = null;
        }
    };

    return (
        <Box sx={{ width: '100%', ...sx }}>
            <DropzoneWrapper
                {...getRootProps()}
                sx={{
                    ...(isDragActive && { opacity: 0.72 }),
                    ...((isDragReject || error) && { color: 'error.main', borderColor: 'error.light', bgcolor: 'error.lighter' }),
                    ...(file && { padding: '12% 0' })
                }}
            >
                <input {...getInputProps()} />
                <PlaceholderContent />
            </DropzoneWrapper>

            {file && file.length > 0 && (
                <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.5 }}>
                    <Button variant="contained" color="error" onClick={onRemove}>
                        Remove
                    </Button>
                </Stack>
            )}

            {file && file.length > 0 && (
                <Box sx={{ mt: 1 }}>
                    <Typography variant="body1">{file[0].name}</Typography>
                </Box>
            )}

            {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}
        </Box>
    );
};

export default SingleFileUpload;
