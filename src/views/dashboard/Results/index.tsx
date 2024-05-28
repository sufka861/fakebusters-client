import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import DetailsAnalyst from './detailsAnalyst';
import UserList from './UserList';
import ResultsLPA from './ResultsLPA';
import ReportCards from '../Analytics/ReportCard';
import ApexBarChart from 'views/dashboard/Analytics/ApexBarChart';
import MainCard from 'ui-component/cards/MainCard';
import SockpuppetDetectionChartCard from './SockpuppetDetectionChartCard';
import { gridSpacing } from 'store/constant';

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state || {}; // Fallback to empty object if no state is passed
    const {
        resultsLPA,
        sockpuppetData,
        responseFerqData,
        chartData,
    } = state;

    // const {
    //     resultsLPA = [
    //         {
    //             "Corpus 1": "yosi_shahbar",
    //             "Corpus 2": "yosi_shahbar",
    //             "Value": "0.6"
    //         },
    //         {
    //             "Corpus 1": "yosi_shahbar",
    //             "Corpus 2": "yosi_shahbar",
    //             "Value": "0.5"
    //         },
    //         {
    //             "Corpus 1": "yosi_shahbar",
    //             "Corpus 2": "yosi_shahbar",
    //             "Value": "0.7"
    //         },
    //         {
    //             "Corpus 1": "aaa",
    //             "Corpus 2": "bbb",
    //             "Value": "0.8"
    //         }],
    //     sockpuppetData = {
    //         "VeryLowLikelihood": 1,
    //         "LowLikelihood": 2,
    //         "MediumLikelihood": 3,
    //         "HighLikelihood": 4
    //     },
    //     responseFerqData = {
    //         "word": "11111",
    //         "freq": "22222",
    //         "account": "33333",
    //         "initialAuthorsCount": "44444",
    //         "initialPostsCount": "55555",
    //         "FrequencyFile":'freq_shenkar_954687bc-6ba5-45c6-a9a4-f3b09b8c9484.csv'
    //     },
    //     chartData,
    // } = state;


    const [refreshKey, setRefreshKey] = useState(0);
    
    if (!responseFerqData || !chartData || !chartData.categories || !chartData.data) {
        return (
            <Grid container spacing={gridSpacing} justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Typography variant="h4" align="center">No Results Available</Typography>
                    <Box textAlign="center" mt={2}>
                        <Button variant="contained" color="secondary" onClick={() => navigate('/dashboard/analytics')}>
                            NEW ANALYSIS
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container spacing={gridSpacing}>
            <ReportCards responseFerqData={responseFerqData} />
            <Grid item xs={5}>
                <DetailsAnalyst />
            </Grid>
            <Grid item xs={12}>
                {/* <UserList resultsLPA={resultsLPA} /> */}
                <MainCard title="SockPuppet Distance">
                    <ResultsLPA resultsLPA={resultsLPA} />
                </MainCard>

            </Grid>
    
            <Grid item xs={12} md={6} lg={6}>
                <MainCard title="Highest frequency of words 1-10">
                    <ApexBarChart key={refreshKey} categories={chartData.categories.slice(1, 11)} data={chartData.data.slice(0, 10)} bgColor={"#613cb0"} />
                </MainCard>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
                <MainCard title="Sockpuppet Detection Analysis">
                    <SockpuppetDetectionChartCard sockpuppetData={sockpuppetData} title=''  />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default Results;
