import React, { useState, useRef } from 'react';
import Grid from '@mui/material/Grid';
import { gridSpacing } from "store/constant";
import GraphA from "./Graph";
import { GraphData, Edge } from './Graph';
import Dropzone from '../Analytics/dropzoneCSV';
import { Alert, Button } from '@mui/material';
import axios from 'axios';
import CustomizedDialogs from '../Analytics/CustomizedDialogs';

const Graphs = () => {
    const filesRef = useRef<File[]>([]);
    const [graph, setGraph] = useState<GraphData | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showGraph, setShowGraph] = useState(false);
    const [open, setOpen] = useState(false);

    const handleGraphAnalysis = async () => {
        const formData = new FormData();
            if (filesRef.current && filesRef.current.length > 0) {
                filesRef.current.forEach(file => {
                    formData.append('files', file);  
                });
                try{
                const response = await axios.post('http://localhost:5001/api/graphs/', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                });
            
                console.log('File uploaded successfully:', response.data);

                console.log(response);
                if (response.data && response.data.nodes && response.data.edges) {
                    setGraph(response.data);
                } else {
                    console.error("API response does not contain valid graph data");
                }
                setShowGraph(true);
            } catch (error) {
                console.error('Error uploading file:', error);
                setIsProcessing(false);
                setShowGraph(false);
            }
        } else {
            console.log('No file uploaded');
            setIsProcessing(false);
            setShowGraph(false);
        }
    };

    const handleClickOpen = () => {
        if (filesRef.current && filesRef.current.length > 0) {
            setOpen(true);
            handleGraphAnalysis();
            setShowAlert(false);
        } else {
            setShowAlert(true);
        }
    };

    const reverseEdges = (edges: Edge[]): Edge[] => {
        return edges.map(edge => ({ from: edge.to, to: edge.from }));
    };

    const handleClose = () => {
        setIsProcessing(true);
        setOpen(false);
    };

    return (
        <Grid container spacing={gridSpacing}>
            {showAlert && (
                <Grid item xs={12}>
                    <Alert severity="error" sx={{ color: 'error.main' }}>
                        Please select a CSV file to upload before starting the analysis.
                    </Alert>
                </Grid>
            )}
            <Grid item xs={12} lg={12}>
                <Dropzone filesRef={filesRef} />
                <Grid item xs={12} container justifyContent="center" paddingTop={1}>
                    <Button variant="contained" color="secondary" onClick={handleClickOpen}>
                        Start Structure Analysis
                    </Button>
                </Grid>
                <CustomizedDialogs open={open} onClose={handleClose} />
            </Grid>
            {graph && (
                <>
                    <Grid item xs={12} md={6}>
                        <GraphA nodes={graph.nodes} edges={graph.edges} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <GraphA nodes={graph.nodes} edges={reverseEdges(graph.edges)} />
                    </Grid>
                </>
            )}
        </Grid>
    );
};

export default Graphs;
