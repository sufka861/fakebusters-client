import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ReportCards from './ReportCard';
import CircularProgress from '@mui/material/CircularProgress';
import sentences from './sentences'

// project imports
import axios from 'axios';
import Dropzone from 'views/dashboard/Analytics/dropzoneCSV';
import ProjectForm from 'views/dashboard/Analytics/projectForm';
import { gridSpacing } from 'store/constant';
import ApexBarChart from 'views/dashboard/Analytics/ApexBarChart';
import MainCardAnalyics from './MainCardAnalyics';
import MainCard from 'ui-component/cards/MainCard';
import CustomizedDialogs from './CustomizedDialogs';
import UICardsPrimary from './UICardsPrimary';
import UICardsSecondary from './UICardsSecondary';

const Analytics = () => {

    //Effect on the components
    const filesRef = useRef([]);
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showChart, setShowChart] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [sentenceIndex, setSentenceIndex] = useState(0);
    const [open, setOpen] = useState(false);
   
    //data
    const [chartData, setChartData] = useState({ categories: [], data: [] });
    const [responseFerqData, setResponseData] = useState({
        word: null,
        freq: null,
        account: null,
        initiaAuthorsCount: null,
        initialPostsCount: null,
        FrequencyFile:''
    });
    const [formAnalysisData, setFormAnalysisData] = useState({
        projectName: '',
        email: '',
        threshold: 0.5,
        signature: 500,
        typeOfAnalysis: 1,
        saveFrequencyFile: true,
        saveSettings: false,
    });

    //useEffect
    useEffect(() => {
        const intervalId = setInterval(() => {
            setSentenceIndex((prevIndex) => (prevIndex + 1) % sentences.length);
        }, 2000); 

        return () => clearInterval(intervalId);
    }, []);

    
    useEffect(() => {
        if (!showChart) {
            return; 
        }

        console.log(responseFerqData.FrequencyFile)

        const url = `http://localhost:5000/api/sse/lpa-results?fileName=${responseFerqData.FrequencyFile}`;
        const eventSource = new EventSource(url);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received data:', data);

            if (data.message === 'Process completed') {
                eventSource.close(); 
                console.log(data.resultsLPA)
                navigate('/dashboard/results', { state: {   responseFerqData,
                                                            resultsLPA: data.resultsLPA,
                                                            chartData,
                                                            sockpuppetData: data.sockpuppetData,
                                                            ...formAnalysisData,
                                                        } });
            }                                                       
        };

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close(); 
        };
    }, [navigate, showChart, formAnalysisData]);


    const handleClickOpen = () => {
        if (filesRef.current && filesRef.current.length > 0) {
            setOpen(true);
            handleStartAnalysis();
            setShowAlert(false); 
        } else {
            setShowAlert(true); 
        }
    };

    const handleClose = () => {
        setIsProcessing(true);
        setOpen(false);
    };

    const handleStartAnalysis = async () => {
        const formData = new FormData();
        if (filesRef.current && filesRef.current.length > 0) {
            const file = filesRef.current[0];
            formData.append('file', file);

            // Append formAnalysisData fields to formData
            for (const [key, value] of Object.entries(formAnalysisData)) {
                formData.append(key, value.toString());
            }

            try {
                const response = await axios.post('http://localhost:5000/api/s3/Preprocessing', formData);
                setChartData({
                    categories: response.data.categories, 
                    data: response.data.data
                });
                setResponseData({
                    word: response.data.word,
                    freq: response.data.freq,
                    account: response.data.account,
                    initiaAuthorsCount: response.data.initial_authors_count,
                    initialPostsCount: response.data.initial_posts_count,
                    FrequencyFile: response.data.output_file_name
                });
                setRefreshKey(prevKey => prevKey + 1);
                setShowChart(true);
            } catch (error) {
                console.error('Error uploading file:', error);
                setIsProcessing(false);
                setShowChart(false);
            }
        } else {
            console.log('No file to upload.');
            setIsProcessing(false);
            setShowChart(false);
        }
    };

    const handleFormChange = (name, value) => {
        setFormAnalysisData(prev => ({ ...prev, [name]: value }));
    };

    if (isProcessing) {
        return (
            
            <Grid container spacing={2}>
                <Grid item xs={12} lg={12} sm={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <MainCardAnalyics title="Your file has been uploaded! We started working!" titleStyle={{ textAlign: 'center' }} style={{ width: '100%' }}>
                        <Typography variant="body1" align="center">
                            {sentences[sentenceIndex]}
                        </Typography>
                    </MainCardAnalyics>
                </Grid>
                {!showChart && (
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <CircularProgress aria-label="progress" />
                    </Grid>
                )}
                {showChart && (
                    <>
                        <ReportCards responseFerqData={responseFerqData} />
                        <Grid item xs={12} md={6} lg={6}>
                            <MainCard title="Highest frequency of words 1-10">
                                <ApexBarChart key={refreshKey} categories={chartData.categories.slice(1, 11)} data={chartData.data.slice(1, 11)} bgColor={"#4994ec"} />
                            </MainCard>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <MainCard title="Highest frequency of words 11-20">
                                <ApexBarChart key={refreshKey} categories={chartData.categories.slice(12, 22)} data={chartData.data.slice(12, 22)} bgColor={"#613cb0"}/>
                            </MainCard>
                        </Grid>
                    </>
                )}
            </Grid>
        );
    }

    return (
       
        <Grid container spacing={gridSpacing}>
           
            <Grid item xs={12} sm={6} md={4}>
            </Grid>
            <Grid item xs={12} lg={12} md={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={8} md={12} sm={12} xs={12}>
                    <ProjectForm  
                        formData={formAnalysisData}
                        setFormData={setFormAnalysisData}
                        handleFormChange={handleFormChange}
                    />
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={6} style={{ minWidth: '100%', maxWidth: '100%' }}>
                                <UICardsPrimary />
                            </Grid>
                            <Grid item xs={6} style={{ minWidth: '100%', maxWidth: '100%' }}>
                                <UICardsSecondary />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {showAlert && (
                <Grid item xs={12}>
                    <Alert severity="error" sx={{ color: 'error.main' }}>
                        Please select a CSV  file to upload before starting the analysis.
                    </Alert>
                </Grid>
            )}
            <Grid item xs={12} lg={12}>
                <Dropzone filesRef={filesRef} />
            </Grid>
            <Grid item xs={12} container justifyContent="flex-end">
                <Button variant="contained" color="secondary" onClick={handleClickOpen}>
                    Start Analysis
                </Button>
            </Grid>
            <CustomizedDialogs open={open} onClose={handleClose} />
        </Grid>
    );
    
};

export default Analytics;
