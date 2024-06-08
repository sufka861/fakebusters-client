import React, { useState, useRef } from 'react';
import Grid from '@mui/material/Grid';
import { Alert, Typography } from '@mui/material';
import axios from 'axios';
import Button from '@mui/material/Button';
import Dropzone from './Dropzone';
import MainCard from 'ui-component/cards/MainCard';

interface FileUploadStructureProps {
    onUploadSuccess: (data: any) => void;
}

const FileUploadStructure: React.FC<FileUploadStructureProps> = ({ onUploadSuccess }) => {
    const fileRef = useRef<File | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

    const handleFileUpload = async () => {
        const formData = new FormData();
        if (fileRef.current) {
            formData.append('file', fileRef.current);
            try {
                const response = await axios.post('https://fakebusters-server.onrender.com/api/graphs/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                console.log('File uploaded successfully:', response.data);

                if (response.data && response.data.nodes && response.data.edges) {
                    onUploadSuccess(response.data);
                    setUploadedFileName(fileRef.current!.name); // Set uploaded file name
                } else {
                    console.error("API response does not contain valid graph data");
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        } else {
            console.log('No file uploaded');
        }
    };

    const handleClickOpen = () => {
        if (fileRef.current) {
            setShowAlert(false);
            handleFileUpload();
        } else {
            setShowAlert(true);
        }
    };

    return (
        <Grid container spacing={2}>
            {showAlert && (
                <Grid item xs={12}>
                    <Alert severity="error" sx={{ color: 'error.main' }}>
                        Please select a CSV file to upload before starting the analysis.
                    </Alert>
                </Grid>
            )}
            {!uploadedFileName ? (
                <Grid item xs={12} lg={12}>
                    <Dropzone fileRef={fileRef} />
                    <Grid item xs={12} container justifyContent="center" paddingTop={1}>
                        <Button variant="contained" color="secondary" onClick={handleClickOpen}>
                            Start Network Analysis
                        </Button>
                    </Grid>
                </Grid>
            ) : (
                <Grid xs={12} lg={12}>
                                    <Alert severity="info" sx={{ color: 'info.main' }}>
                                    Showing resuls for uploaded file: {uploadedFileName}
                    </Alert>
                </Grid>
            )}
        </Grid>
    );
};

export default FileUploadStructure;
