import React, { useState, useRef,useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Alert, Typography } from '@mui/material';
import axios from 'axios';
import Button from '@mui/material/Button';
import Dropzone from './Dropzone';
import MainCard from 'ui-component/cards/MainCard';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import { gridSpacing } from 'store/constant';
import Box from '@mui/material/Box';


interface FileUploadStructureProps {
    onUploadSuccess: (data: any) => void;
}

const FileUploadStructure: React.FC<FileUploadStructureProps> = ({ onUploadSuccess }) => {
    const fileRef = useRef<File | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [project_id, setProject_id] = useState(null)
    const [projectName, setProjectName] = useState(null);

    const handleFormChange = (field, value) => {
        if (field === 'projectName') 
            {console.log(value)
                setProjectName(value);}
    }

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
                    setUploadedFileName(fileRef.current!.name);
                    setProject_id(response.data._id)
                    onUploadSuccess(response.data);
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

    const updateFilename = async (filename,projectName) => {
        try {
            const url = `https://fakebusters-server.onrender.com/api/graphs/${project_id}`;
            console.log(filename)
                await axios.put(url, 
                    {file_name: filename,
                        project_name: projectName
                     },{
                    headers: {'Content-Type': 'application/json'},
                });
    } catch (error) {
    console.error('Error updating file name in project:', error);
    }};

    useEffect(() => {
        if (uploadedFileName && project_id && projectName){
        updateFilename(uploadedFileName,projectName);
        }
    }, [uploadedFileName,project_id, projectName]);

    const handleClickOpen = () => {
        if (fileRef.current) {
            setShowAlert(false);
            handleFileUpload();
        } else {
            setShowAlert(true);
        }
    };

    return (
        <Grid container spacing={2} sx={{ paddingBottom: 2 }}>
            <Grid item xs={12} >
                <MainCard>
                    <InputLabel>Project Name</InputLabel>
                    <TextField
                        fullWidth
                        placeholder="Enter project name"
                        value={projectName}
                        onChange={(e) => handleFormChange('projectName', e.target.value)}
                    />
                    {showAlert && (
                        <Alert severity="error" sx={{ color: 'error.main', mt: 2 }}>
                            Please select a CSV file to upload before starting the analysis.
                        </Alert>
                    )}
                    {!uploadedFileName ? (
                        <React.Fragment>
                            <Dropzone fileRef={fileRef} />
                            <Grid item xs={12} container justifyContent="flex-end" paddingTop={1}>
                                <Button variant="contained" color="secondary" onClick={handleClickOpen}>
                                    Start Network Analysis
                                </Button>
                            </Grid>
                        </React.Fragment>
                    ) : (
                        <Alert severity="info" sx={{ color: 'info.main', mt: 2 }}>
                            Display results for uploaded file: {uploadedFileName}
                        </Alert>
                    )}
                </MainCard>
            </Grid>
        </Grid>
    );
};


export default FileUploadStructure;