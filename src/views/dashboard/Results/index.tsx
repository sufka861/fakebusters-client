import React, { useEffect, useState } from 'react';
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
import axios from 'axios';

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state || {}; // Fallback to empty object if no state is passed
    const { resultsLPA, sockpuppetData, responseFerqData, chartData } = state;

    const [refreshKey, setRefreshKey] = useState(0);
    const [userProjects, setUserProjects] = useState([]);
    const [selectedProjectData, setSelectedProjectData] = useState(null);

    const userId = '6650be951fdcf7cb4e278258'; // TODO: Replace with dynamic user ID

    useEffect(() => {
        if (responseFerqData && responseFerqData.FrequencyFile) {
            updateUserProjectId(responseFerqData.FrequencyFile);
        } else {
            fetchUserProjects();
        }
    }, [responseFerqData]);

    const updateUserProjectId = async (filename: string) => {
        try {
            const response = await axios.get(`https://fakebusters-server.onrender.com/api/users/${userId}`);
            const user = response.data[0];

            if (user && !user.project_id.includes(filename)) {
                const updatedProjectId = [...user.project_id, filename];
                await axios.put(
                    `https://fakebusters-server.onrender.com/api/users/${userId}`,
                    {
                        project_id: updatedProjectId
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
            }
        } catch (error) {
            console.error('Error updating user project ID:', error);
        }
    };

    const fetchUserProjects = async () => {
        try {
            const response = await axios.get(`https://fakebusters-server.onrender.com/api/users/${userId}`);
            const user = response.data[0];
            setUserProjects(user.project_id);
        } catch (error) {
            console.error('Error fetching user projects:', error);
        }
    };

    const fetchProjectData = async (filename: string) => {
        try {
            const response = await axios.get(`https://fakebusters-server.onrender.com/api/lpa/${filename}`);
            setSelectedProjectData(response.data[0]);
        } catch (error) {
            console.error('Error fetching project data:', error);
        }
    };

    if (!responseFerqData || !chartData || !chartData.categories || !chartData.data) {
        return (
            <Grid container spacing={gridSpacing} justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Typography variant="h4" align="center">
                        No Results Available
                    </Typography>
                    <Box textAlign="center" mt={2}>
                        <Button variant="contained" color="secondary" onClick={() => navigate('/dashboard/analytics')}>
                            NEW ANALYSIS
                        </Button>
                    </Box>
                    <Box textAlign="center" mt={4}>
                        <Typography variant="h5" align="center">
                            Previous Results
                        </Typography>
                        {userProjects.length > 0 ? (
                            <Box mt={2}>
                                {userProjects.map((project) => (
                                    <Button
                                        key={project}
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => fetchProjectData(project)}
                                        style={{ margin: '5px' }}
                                    >
                                        {project}
                                    </Button>
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="body1" align="center">
                                No previous results available.
                            </Typography>
                        )}
                    </Box>
                </Grid>
                {selectedProjectData && (
                    <Grid item xs={12}>
                        <MainCard title="Selected Project Data">
                            <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                                <ResultsLPA resultsLPA={selectedProjectData.LPA_results} />
                            </Box>
                        </MainCard>
                    </Grid>
                )}
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
                <MainCard title="SockPuppet Distance">
                    <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                        <ResultsLPA resultsLPA={resultsLPA} />
                    </Box>
                </MainCard>
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
                <MainCard title="Highest frequency of words 1-10">
                    <ApexBarChart
                        key={refreshKey}
                        categories={chartData.categories.slice(1, 11)}
                        data={chartData.data.slice(0, 10)}
                        bgColor={'#613cb0'}
                    />
                </MainCard>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
                <MainCard title="Sockpuppet Detection Analysis">
                    <SockpuppetDetectionChartCard sockpuppetData={sockpuppetData} title="" />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default Results;
