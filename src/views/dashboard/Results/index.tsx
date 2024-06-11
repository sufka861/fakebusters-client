import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

import DetailsAnalyst from './detailsAnalyst';
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
    const [projectDetails, setProjectDetails] = useState([]);
    const [filter, setFilter] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

    const userId = '6650be951fdcf7cb4e278258'; // TODO: Replace with dynamic user ID

    useEffect(() => {
        if (responseFerqData && responseFerqData.FrequencyFile) {
            updateUserProjectId(responseFerqData.FrequencyFile);
        } else {
            fetchUserProjects();
        }
    }, [responseFerqData]);

    useEffect(() => {
        if (userProjects.length > 0) {
            fetchProjectDetails();
        }
    }, [userProjects]);

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

    const fetchProjectDetails = async () => {
        try {
            const details = await Promise.all(
                userProjects.map(async (project) => {
                    const response = await axios.get(`https://fakebusters-server.onrender.com/api/lpa/${project}`);
                    const data = response.data[0];
                    return {
                        project_name: data.project_name,
                        date_created: data.date_created,
                        file_id: data.file_id
                    };
                })
            );
            setProjectDetails(details);
        } catch (error) {
            console.error('Error fetching project details:', error);
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

    const handleFilterChange = (event) => {
        setFilter(event.target.value.toLowerCase());
    };

    const filteredProjects = projectDetails.filter((project) => {
        return Object.values(project).some((value) => String(value).toLowerCase().includes(filter));
    });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedProjects = filteredProjects.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

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
                        <TextField
                            label="Search"
                            value={filter}
                            onChange={handleFilterChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                            fullWidth
                            margin="normal"
                        />
                        {sortedProjects.length > 0 ? (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortConfig.key === 'project_name'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSort('project_name')}
                                                >
                                                    Project Name
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortConfig.key === 'date_created'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSort('date_created')}
                                                >
                                                    Date Created
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortConfig.key === 'file_id'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSort('file_id')}
                                                >
                                                    File ID
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sortedProjects.map((project) => (
                                            <TableRow
                                                key={project.file_id}
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: '#f5f5f5'
                                                    }
                                                }}
                                            >
                                                <TableCell>{project.project_name}</TableCell>
                                                <TableCell>{new Date(project.date_created).toLocaleString()}</TableCell>
                                                <TableCell>{project.file_id}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => fetchProjectData(project.file_id)}
                                                    >
                                                        Load
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography variant="body1" align="center">
                                No previous results available.
                            </Typography>
                        )}
                    </Box>
                </Grid>
                {selectedProjectData && (
                    <Grid item xs={12}>
                        <MainCard title={selectedProjectData.project_name}>
                            <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                                <ResultsLPA resultsLPA={selectedProjectData.LPA_results} fileName={selectedProjectData.file_id} />
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
                        <ResultsLPA resultsLPA={resultsLPA} fileName={responseFerqData.FrequencyFile} />
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
