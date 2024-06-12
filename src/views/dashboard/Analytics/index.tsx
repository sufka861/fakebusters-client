import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import Dropzone from 'views/dashboard/Analytics/dropzoneCSV';
import { gridSpacing } from 'store/constant';
import ApexBarChart from 'views/dashboard/Analytics/ApexBarChart';
import MainCardAnalyics from './MainCardAnalyics';
import MainCard from 'ui-component/cards/MainCard';
import ReportCards from './ReportCard';
import sentences from './sentences';
import SubCard from 'ui-component/cards/SubCard';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Switch from '@mui/material/Switch';
import LabelSlider from 'views/forms/components/Slider/LabelSlider';
import HoverDataCard from 'ui-component/cards/HoverDataCard';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FunctionsIcon from '@mui/icons-material/Functions';
import EnhancedTable from './TableData';
import TableBasic from './TableBasic';
import ApexColumnChart from './ApexColumnChart';

// table data
function createData(word, frequency) {
    return { word, frequency };
}

const Analytics = () => {
    const [showAlert, setShowAlert] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showChart, setShowChart] = useState(false);
    const [showPreChart, setPreShowChart] = useState(false);
    const [chartData, setChartData] = useState({ categories: [], data: [] });
    const [chartPreData, setChartPreData] = useState({ categories: [], data: [] });
    const [chartWordData, setChartWordData] = useState({ categories: [], data: [] });

    const [responseFerqData, setResponseFerqData] = useState({
        word: null,
        freq: null,
        account: null,
        initialAuthorsCount: null,
        initialPostsCount: null,
        FrequencyFile: ''
    });
    const [uploadFile, setUploadFile] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const filesRef = useRef([]);
    const [showForm, setShowForm] = useState(false);
    const [freqFileName, setFreqFileName] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [email, setEmail] = useState('');
    const [threshold, setThreshold] = useState(0.5);
    const [signature, setSignature] = useState(200);
    const [accountThreshold, setAccountThreshold] = useState(30);
    const [wordThreshold, setWordThreshold] = useState(1000);
    const [showThresholdSettings, setShowThresholdSettings] = useState(false);
    const [showTblholdSettings, setShowTblholdSettings] = useState(false);
    const [showHoverDataCard, setHoverDataCard] = useState({ num_authors: '', max_words: '', average_words_per_user: '' });
    const [sentenceIndex, setSentenceIndex] = useState(0);
    const [isDroppingPunctuation, setIsDroppingPunctuation] = useState(true);
    const [isDroppingLinks, setIsDroppingLinks] = useState(true);
    const [loading, setLoading] = useState(false);
    const [vocabulary, setVocabulary] = useState({ VocabularyWord: [], FreqWord: [] });
    const [rows, setRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const navigate = useNavigate();
    const [startConnection, setStartConnection]= useState(false)
    const [responseFerq, setResponseData] = useState({
        word: null,
        freq: null,
        account: null,
        initialAuthorsCount: null,
        initialPostsCount: null,
        FrequencyFile: ''
    });
    const [formAnalysisData, setFormAnalysisData] = useState({
        projectName: projectName,
        email: email,
        threshold: threshold,
        signature: signature,
        typeOfAnalysis: 1,
        saveFrequencyFile: true,
        saveSettings: false,
    });

    const handleDelete = (namesToDelete) => {
        setVocabulary(prev => ({
            ...prev,
            VocabularyWord: prev.VocabularyWord.filter(item => !namesToDelete.includes(item.name))
        }));
    };

    const handleAddRow = (newWord) => {
        setVocabulary(prev => ({
            ...prev,
            VocabularyWord: [...prev.VocabularyWord, { name: newWord }]
        }));
    };

    const handleFormChange = (field, value) => {
        if (field === 'projectName') setProjectName(value);
        if (field === 'email') setEmail(value);
        if (field === 'threshold') setThreshold(value);
        if (field === 'signature') setSignature(value);
        if (field === 'wordThreshold') setWordThreshold(value);
        if (field === 'accountThreshold') setAccountThreshold(value);
    };

    useEffect(() => {
        console.log('useEffect' )
        console.log(responseFerqData.FrequencyFile )

        if (!responseFerqData.FrequencyFile) {
            return;
        }
        console.log("useEffect 2")
        console.log(responseFerqData.FrequencyFile)

        const url = `https://fakebusters-server.onrender.com/api/sse/lpa-results?fileName=${responseFerqData.FrequencyFile}`;
        const eventSource = new EventSource(url);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received data:', data);

            if (data.message === 'Process completed') {
                eventSource.close();
                console.log(data.resultsLPA);
                navigate('/dashboard/results', {
                    state: {
                        responseFerqData,
                        resultsLPA: data.resultsLPA,
                        chartData,
                        sockpuppetData: data.sockpuppetData,
                        ...formAnalysisData,
                    }
                });
            }
        };

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [startConnection]);

    const handleThresholdSwitchChange = () => {
        setShowThresholdSettings(prev => !prev);
    };

    const handleThresholdSwitchVocabularyChange = () => {
        setShowTblholdSettings(prev => !prev);
    };

    const handleDroppingPunctuationSwitchChange = () => {
        setIsDroppingPunctuation(prev => !prev);
    };

    const handleDroppingLinksSwitchVocabularyChange = () => {
        setIsDroppingLinks(prev => !prev);
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setSentenceIndex((prevIndex) => (prevIndex + 1) % sentences.length);
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    const handleUpFiles = async () => {
        const formData = new FormData();
        if (filesRef.current && filesRef.current.length > 0) {
            filesRef.current.forEach(file => {
                formData.append('files', file);
            });
            try {
                const response = await axios.post('https://fakebusters-server.onrender.com/api/s3/newProject', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setLoading(false);
                setPreShowChart(true);
                setShowForm(true);
                setUploadFile(true);
                console.log(response);

                const categories = Object.keys(response.data.postsDistribution.posts_distribution);
                const data = Object.values(response.data.postsDistribution.posts_distribution);
                const categoriesWord = Object.keys(response.data.postsDistribution.words_distribution);
                const dataWord = Object.values(response.data.postsDistribution.words_distribution);

                const num_authors = response.data.postsDistribution.num_authors;
                const max_words = response.data.postsDistribution.max_words;
                const average_words_per_user = response.data.postsDistribution.average_words_per_user;

                const FreqWord = response.data.postsDistribution.most_common_words;
                const VocabularyWord = response.data.vocabularyData;
                const freqFileName = response.data.combinedFileName;
                setFreqFileName(freqFileName);

                setChartPreData({
                    categories: categories,
                    data: data
                });
                setChartWordData({
                    categories: categoriesWord,
                    data: dataWord
                });
                setHoverDataCard({
                    num_authors: num_authors,
                    max_words: max_words,
                    average_words_per_user: average_words_per_user
                });
                setVocabulary({
                    VocabularyWord: VocabularyWord,
                    FreqWord: FreqWord
                });

                const initialRows = FreqWord.map(item => createData(item[0], item[1]));
                setRows(initialRows);

                setRefreshKey(prevKey => prevKey + 1);
                setIsProcessing(false);
            } catch (error) {
                console.error('Error uploading file:', error);
                setPreShowChart(false);
                setShowForm(false);
                setUploadFile(false);
            }
        } else {
            setUploadFile(false);
            setShowAlert(true);
            setPreShowChart(false);
            setShowForm(false);
        }
    };

    const handleStartAnalysis = async () => {
        const data = {
            projectName: projectName,
            email: email,
            threshold: threshold,
            signature: signature,
            account_threshold: accountThreshold,
            wordThreshold: wordThreshold,
            vocabulary: vocabulary.VocabularyWord,
            isDroppingLinks: isDroppingLinks,
            isDroppingPunctuation: isDroppingPunctuation,
            rowDataFileName: freqFileName,
            topValueWords: showThresholdSettings,
            showTblholdSettings: showTblholdSettings
        };
        console.log('Sending data:', data);

        try {
            const response = await axios.post('https://fakebusters-server.onrender.com/api/s3/preprocessing', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('response:', response);
            
            setChartData({
                categories: response.data.categories,
                data: response.data.data
            });
            setResponseFerqData({
                word: response.data.word,
                freq: response.data.freq,
                account: response.data.account,
                initialAuthorsCount: response.data.initial_authors_count,
                initialPostsCount: response.data.initial_posts_count,
                FrequencyFile: 'freq_'+freqFileName
            });
            setStartConnection(true)
            setRefreshKey(prevKey => prevKey + 1);
            setShowChart(true);
        } catch (error) {
            console.error('Error uploading data:', error);
            setIsProcessing(false);
            setShowChart(false);
            setStartConnection(false)

        }
    };

    const handleStart = () => {
        setShowForm(false);
        setIsProcessing(true);
        handleStartAnalysis();
        setShowForm(false);
        setLoading(false);
        setUploadFile(false)
    };

    const handleNext = () => {
        handleUpFiles();
        setShowForm(true);
        setLoading(true);
    };

    return (
        <Grid container spacing={gridSpacing}>
            {!showForm && !isProcessing && (
                <>
                    {showAlert && (
                        <Grid item xs={12}>
                            <Alert severity="error" sx={{ color: 'error.main' }}>
                                Please select a CSV file to upload before starting the analysis.
                            </Alert>
                        </Grid>
                    )}
                    <Grid item xs={12} lg={12}>
                        <Dropzone filesRef={filesRef} />
                    </Grid>
                    <Grid item xs={12} container justifyContent="flex-end">
                        <Button variant="contained" color="secondary" onClick={handleNext}>
                            Next
                        </Button>
                    </Grid>
                </>
            )}
            {!uploadFile && loading && (
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <CircularProgress aria-label="progress" />
                </Grid>
            )}

            {uploadFile && (
                <>
                    <Grid item xs={12} sm={12} md={12}>
                        <SubCard>
                            Before we start, it is necessary to pre-process the file you uploaded. You will have access to charts to help you make informed decisions.
                        </SubCard>
                    </Grid>
                    {showPreChart && (
                        <>
                            <Grid item xs={12} sm={6} md={6}>
                                <SubCard title="Number of Posts per Author Grouped by Post Count Ranges">
                                    <ApexColumnChart key={refreshKey} categories={chartPreData.categories} data={chartPreData.data} colors={["#4994ec"]} />
                                </SubCard>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <SubCard title="Number of Words per Author Grouped by Post Count Ranges">
                                    <ApexColumnChart key={refreshKey} categories={chartWordData.categories} data={chartWordData.data} colors={"#613cb0"} />
                                </SubCard>
                            </Grid>

                            <Grid item xs={12} sm={7}>
                                <SubCard title="Project Details">
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={6}>
                                            <InputLabel>Project Name</InputLabel>
                                            <TextField
                                                fullWidth
                                                placeholder="Enter project name"
                                                value={projectName}
                                                onChange={(e) => handleFormChange('projectName', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <InputLabel>Email</InputLabel>
                                            <TextField
                                                type="email"
                                                fullWidth
                                                placeholder="Email"
                                                value={email}
                                                onChange={(e) => handleFormChange('email', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                                Algorithm Settings:
                                            </Typography>
                                            <Grid container spacing={1}>
                                                <LabelSlider
                                                    min={0.1}
                                                    max={1}
                                                    start={threshold}
                                                    label="Threshold"
                                                    step={0.1}
                                                    onChange={(e, value) => handleFormChange('threshold', value)}
                                                />
                                                <LabelSlider
                                                    min={100}
                                                    max={2000}
                                                    start={signature}
                                                    label="Signature"
                                                    color="secondary"
                                                    step={100}
                                                    onChange={(e, value) => handleFormChange('signature', value)}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </SubCard>
                            </Grid>
                            <Grid item xs={12} sm={5}>
                                <SubCard title="Preprocessing Settings">
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Switch defaultChecked color="primary" onChange={handleDroppingPunctuationSwitchChange} />
                                            Dropping punctuation marks
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Switch color="primary" onChange={handleThresholdSwitchChange} />
                                            Threshold of posts
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Switch color="primary" onChange={handleThresholdSwitchVocabularyChange} />
                                            Changing a dictionary for belonging words
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Switch defaultChecked color="primary" onChange={handleDroppingLinksSwitchVocabularyChange} />
                                            Dropping links
                                        </Grid>
                                    </Grid>
                                </SubCard>
                            </Grid>
                        </>
                    )}
                    {showThresholdSettings && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <SubCard title="Note! The defined settings are recommended for the LPA algorithm and any change may harm the results">
                                    <Grid container spacing={1}>
                                        <LabelSlider
                                            min={10}
                                            max={100}
                                            start={30}
                                            label="Account Threshold"
                                            step={1}
                                            onChange={(e, value) => handleFormChange('accountThreshold', value)}
                                        />
                                        <LabelSlider
                                            min={1000}
                                            max={100000}
                                            start={showHoverDataCard.average_words_per_user}
                                            label="Word Threshold"
                                            color="secondary"
                                            step={100}
                                            onChange={(e, value) => handleFormChange('wordThreshold', value)}
                                        />
                                    </Grid>
                                </SubCard>
                            </Grid>
                            <Grid item xs={12} lg={3} sm={6}>
                                <SubCard>
                                    <HoverDataCard
                                        title="Maximum"
                                        iconPrimary={ArrowDownwardIcon}
                                        primary={showHoverDataCard.max_words}
                                        secondary="amount of words"
                                        color="success.main"
                                    />
                                </SubCard>
                            </Grid>
                            <Grid item xs={12} lg={3} sm={6}>
                                <SubCard>
                                    <HoverDataCard
                                        title="Average"
                                        iconPrimary={FunctionsIcon}
                                        primary={showHoverDataCard.average_words_per_user}
                                        secondary="words per account"
                                        color="error.main"
                                    />
                                </SubCard>
                            </Grid>
                        </>
                    )}
                    {showTblholdSettings && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <EnhancedTable
                                    vocabulary={vocabulary.VocabularyWord}
                                    onDelete={handleDelete}
                                    onAddRow={handleAddRow}
                                    setVocabulary={setVocabulary}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TableBasic
                                    rows={rows}
                                    setRows={setRows}
                                    selectedRows={selectedRows}
                                    setSelectedRows={setSelectedRows}
                                    setVocabulary={setVocabulary}
                                />
                            </Grid>
                        </>
                    )}
                    <Grid item xs={12} style={{ textAlign: 'right', marginTop: '16px' }}>
                        <SubCard>
                            <Button variant="contained" color="primary" onClick={handleStart}>
                                Start Analysis
                            </Button>
                        </SubCard>
                    </Grid>
                </>
            )}
            {isProcessing && (
                <Grid item xs={12} lg={12} sm={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <MainCardAnalyics title="Your file has been uploaded! We started working!" titleStyle={{ textAlign: 'center' }} style={{ width: '100%' }}>
                        <Typography variant="body1" align="center">
                            {sentences[sentenceIndex]}
                        </Typography>
                    </MainCardAnalyics>
                </Grid>
            )}
            {isProcessing && !showChart && (
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <CircularProgress aria-label="progress" />
                </Grid>
            )}
            {isProcessing && showChart && (
                <>
                    <ReportCards responseFerqData={responseFerqData} />
                    <Grid item xs={12} md={6} lg={6}>
                        <MainCard title="Highest frequency of words 1-10">
                            <ApexBarChart key={refreshKey} categories={chartData.categories.slice(0, 10)} data={chartData.data.slice(0, 10)} bgColor={"#4994ec"} />
                        </MainCard>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <MainCard title="Highest frequency of words 11-20">
                            <ApexBarChart key={refreshKey} categories={chartData.categories.slice(10, 20)} data={chartData.data.slice(10, 20)} bgColor={"#613cb0"} />
                        </MainCard>
                    </Grid>
                </>
            )}
        </Grid>
    );
};

export default Analytics;
