import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useDropzone } from 'react-dropzone';

import FilesPreview from './FilePreview';
import PlaceholderContent from './PlaceHolderContent';
import RejectionFiles from './RejectionFile';

import { CustomFile, DropzopType, UploadMultiFileProps } from 'types/dropzone';

const DropzoneWrapper = styled('div')(({ theme }) => ({
    outline: 'none',
    padding: theme.spacing(5, 1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    border: `1px dashed ${theme.palette.secondary.main}`,
    '&:hover': { opacity: 0.72, cursor: 'pointer' }
}));

interface MultiFileUploadProps extends UploadMultiFileProps {
    filesRef: React.RefObject<CustomFile[]>; 
    showList?: boolean; 
    type?: DropzopType; 
    sx?: any; 
    error?: boolean; 
}

const MultiFileUpload = ({
    error,
    showList = false,
    type,
    sx,
    filesRef
}: MultiFileUploadProps) => {

    const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
        multiple: true, 
        onDrop: (acceptedFiles: CustomFile[]) => {
            console.log('Accepted file:', acceptedFiles);
            if (filesRef && filesRef.current) {
                const newFiles = acceptedFiles.map(file => 
                    Object.assign(file, { preview: URL.createObjectURL(file) })
                );
                filesRef.current = [...filesRef.current, ...newFiles]; // Combines old and new files
                
            } else {
                // Initialize filesRef.current if it's not set
                const initialFiles = acceptedFiles.map(file => 
                    Object.assign(file, { preview: URL.createObjectURL(file) })
                );
                filesRef.current = initialFiles;
            }
        }
    });

    const onRemove = (fileToRemove: CustomFile) => {
        if (filesRef.current) {
            filesRef.current = filesRef.current.filter(file => file.id !== fileToRemove.id);
        }
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
                {filesRef && filesRef.current && filesRef.current.length > 0 && (
                    <FilesPreview 
                        files={filesRef.current} 
                        showList={showList} 
                        onRemove={onRemove} 
                        type={type}
                    />
                )}
            </Box>
        </>
    );
};

export default MultiFileUpload;
