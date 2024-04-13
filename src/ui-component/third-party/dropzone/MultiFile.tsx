// material-ui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// third-party
import { useDropzone } from 'react-dropzone';

// project import
import FilesPreview from './FilePreview';
import PlaceholderContent from './PlaceHolderContent';
import RejectionFiles from './RejectionFile';

// types
import { CustomFile, DropzopType, UploadMultiFileProps } from 'types/dropzone';

const DropzoneWrapper = styled('div')(({ theme }) => ({
    outline: 'none',
    padding: theme.spacing(5, 1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    border: `1px dashed ${theme.palette.secondary.main}`,
    '&:hover': { opacity: 0.72, cursor: 'pointer' }
}));

// ==============================|| UPLOAD - MULTIPLE FILE ||============================== //

const MultiFileUpload = ({ error, showList = false, files, type, setFieldValue, sx, onUpload, ...other }: UploadMultiFileProps) => {
    const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
        multiple: true,
        onDrop: (acceptedFiles: CustomFile[]) => {
            if (files) {
                setFieldValue('files', [
                    ...files,
                    ...acceptedFiles.map((file: CustomFile) =>
                        Object.assign(file, {
                            preview: URL.createObjectURL(file)
                        })
                    )
                ]);
            } else {
                setFieldValue(
                    'files',
                    acceptedFiles.map((file: CustomFile) =>
                        Object.assign(file, {
                            preview: URL.createObjectURL(file)
                        })
                    )
                );
            }
        }
    });

    const onRemove = (file: File | string) => {
        const filteredItems = files && files.filter((_file) => _file !== file);
        setFieldValue('files', filteredItems);
    };

    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    ...(type === DropzopType.standard && { width: 'auto', display: 'flex' }),
                    ...sx
                }}
            >
                <Stack {...(type === DropzopType.standard && { alignItems: 'center' })}>
                    <DropzoneWrapper
                        {...getRootProps()}
                        sx={{
                            ...(type === DropzopType.standard && {
                                p: 0,
                                m: 1,
                                width: 64,
                                height: 64
                            }),
                            ...(isDragActive && { opacity: 0.72 }),
                            ...((isDragReject || error) && {
                                color: 'error.main',
                                borderColor: 'error.light',
                                bgcolor: 'error.lighter'
                            })
                        }}
                    >
                        <input {...getInputProps()} />
                        <PlaceholderContent type={type} />
                    </DropzoneWrapper>
           
                </Stack>
                {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}
                {files && files.length > 0 && <FilesPreview files={files} showList={showList} onRemove={onRemove} type={type} />}
            </Box>
        </>
    );
};

export default MultiFileUpload;
