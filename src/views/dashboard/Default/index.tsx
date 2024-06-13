import React, { useState, useEffect } from 'react';
import axios from 'axios';
// material-ui
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import AccountCircleTwoTone from '@mui/icons-material/AccountCircleTwoTone';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentTwoTone';

import UserCountCard from 'ui-component/cards/UserCountCard';
import PairsResultsTable from './PairsResultsTable';
import ProjectTable from './ProjectTable';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

const WidgetData = () => {
    const [filter, setFilter] = useState(5); 
    const [singlesData, setSinglesData] = useState([]);
    const [userDetails, setUserDetails] = useState([]);
    const [pairsData, setPairsData] = useState([]);
    const [networkSinglesData, setNetworkSinglesData] = useState([]);
    const [networkPairsData, setNetworkPairsData] = useState([]);
    const [checkedUsersCount, setCheckedUsersCount] = useState(0);
    const [lpaCount, setLpaCount] = useState(0);
    const [structuralAnalysisCount, setStructuralAnalysisCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://fakebusters-server.onrender.com/api/suspects/6650be951fdcf7cb4e278258');
                const LPAresponse = await fetch('https://fakebusters-server.onrender.com/api/users/6650be951fdcf7cb4e278258');
                const statsResponse = await fetch('https://fakebusters-server.onrender.com/api/suspects/structure/6650be951fdcf7cb4e278258');
                
                const data = await response.json();
                const lpaDataArray = await LPAresponse.json();
                const statsData = await statsResponse.json();

                const lpaData = lpaDataArray[0]; // Access the first element in the array

                setSinglesData(data.singles || []); 
                setCheckedUsersCount((data.singles || []).length);
                setLpaCount(lpaData.project_id ? lpaData.project_id.length : 0);
                setStructuralAnalysisCount(lpaData.graph_id ? lpaData.graph_id.length : 0);

                const userDetailsPromises = (data.singles || []).map(async (single) => {
                    const username = single.corpus;
                    try {
                        const userResponse = await axios.get(`https://fakebusters-server.onrender.com/api/profiles/profile?username=${username}`);
                        const profileData = userResponse.data?.[0];
                        
                        let status = 'Active';
                        if (profileData?.errors) {
                            if (profileData.errors[0].title === 'Not Found Error') {
                                status = 'User not found';
                            } else if (profileData.errors[0].title === 'Forbidden') {
                                status = 'User suspended';
                            }
                        } else if (!profileData || !profileData.data || !profileData.data[0]) {
                            status = 'No profile data';
                        }

                        return {
                            name: profileData?.data?.[0]?.username || username,
                            username,
                            image: profileData?.data?.[0]?.profile_image_url || '',
                            averageValue: parseFloat(single.averageValue), // Ensure value is parsed as number
                            status,
                        };
                    } catch (error) {
                        console.error(`Error fetching profile data for ${username}:`, error);
                        return {
                            name: username,
                            username,
                            image: '',
                            averageValue: parseFloat(single.averageValue), // Ensure value is parsed as number
                            status: 'Error fetching profile data',
                        };
                    }
                });

                const userDetailsResults = await Promise.all(userDetailsPromises);
                setUserDetails(userDetailsResults);

                const pairsDetailsPromises = (data.pairs || []).map(async (pair) => {
                    const [user1, user2] = await Promise.all([
                        axios.get(`https://fakebusters-server.onrender.com/api/profiles/profile?username=${pair['Corpus 1']}`),
                        axios.get(`https://fakebusters-server.onrender.com/api/profiles/profile?username=${pair['Corpus 2']}`)
                    ]);

                    const user1Data = user1.data?.[0];
                    const user2Data = user2.data?.[0];

                    let user1Status = 'Active';
                    if (user1Data?.errors) {
                        if (user1Data.errors[0].title === 'Not Found Error') {
                            user1Status = 'User not found';
                        } else if (user1Data.errors[0].title === 'Forbidden') {
                            user1Status = 'User suspended';
                        }
                    } else if (!user1Data || !user1Data.data || !user1Data.data[0]) {
                        user1Status = 'No profile data';
                    }

                    let user2Status = 'Active';
                    if (user2Data?.errors) {
                        if (user2Data.errors[0].title === 'Not Found Error') {
                            user2Status = 'User not found';
                        } else if (user2Data.errors[0].title === 'Forbidden') {
                            user2Status = 'User suspended';
                        }
                    } else if (!user2Data || !user2Data.data || !user2Data.data[0]) {
                        user2Status = 'No profile data';
                    }

                    return {
                        user1Name: user1Data?.data?.[0]?.username || pair['Corpus 1'],
                        user1Image: user1Data?.data?.[0]?.profile_image_url || '',
                        user1Status,
                        user2Name: user2Data?.data?.[0]?.username || pair['Corpus 2'],
                        user2Image: user2Data?.data?.[0]?.profile_image_url || '',
                        user2Status,
                        value: parseFloat(pair.value), // Ensure value is parsed as number
                    };
                });

                const pairsDetailsResults = await Promise.all(pairsDetailsPromises);
                setPairsData(pairsDetailsResults);

                // Fetch Network Analysis Data
                const networkSingles = statsData.singles || [];
                const networkPairs = statsData.pairs || [];

                // Process Network Analysis Singles
                const networkSinglesDetailsPromises = networkSingles.map(async (single) => {
                    const username = single.corpus;
                    try {
                        const userResponse = await axios.get(`https://fakebusters-server.onrender.com/api/profiles/profile?username=${username}`);
                        const profileData = userResponse.data?.[0];
                        
                        let status = 'Active';
                        if (profileData?.errors) {
                            if (profileData.errors[0].title === 'Not Found Error') {
                                status = 'User not found';
                            } else if (profileData.errors[0].title === 'Forbidden') {
                                status = 'User suspended';
                            }
                        } else if (!profileData || !profileData.data || !profileData.data[0]) {
                            status = 'No profile data';
                        }

                        return {
                            name: profileData?.data?.[0]?.username || username,
                            username,
                            image: profileData?.data?.[0]?.profile_image_url || '',
                            averageValue: parseFloat(single.averageValue), // Ensure value is parsed as number
                            status,
                        };
                    } catch (error) {
                        console.error(`Error fetching profile data for ${username}:`, error);
                        return {
                            name: username,
                            username,
                            image: '',
                            averageValue: parseFloat(single.averageValue), // Ensure value is parsed as number
                            status: 'Error fetching profile data',
                        };
                    }
                });

                const networkSinglesDetailsResults = await Promise.all(networkSinglesDetailsPromises);
                setNetworkSinglesData(networkSinglesDetailsResults);

                // Process Network Analysis Pairs
                const networkPairsDetailsPromises = networkPairs.map(async (pair) => {
                    const [user1, user2] = await Promise.all([
                        axios.get(`https://fakebusters-server.onrender.com/api/profiles/profile?username=${pair.node1}`),
                        axios.get(`https://fakebusters-server.onrender.com/api/profiles/profile?username=${pair.node2}`)
                    ]);

                    const user1Data = user1.data?.[0];
                    const user2Data = user2.data?.[0];

                    let user1Status = 'Active';
                    if (user1Data?.errors) {
                        if (user1Data.errors[0].title === 'Not Found Error') {
                            user1Status = 'User not found';
                        } else if (user1Data.errors[0].title === 'Forbidden') {
                            user1Status = 'User suspended';
                        }
                    } else if (!user1Data || !user1Data.data || !user1Data.data[0]) {
                        user1Status = 'No profile data';
                    }

                    let user2Status = 'Active';
                    if (user2Data?.errors) {
                        if (user2Data.errors[0].title === 'Not Found Error') {
                            user2Status = 'User not found';
                        } else if (user2Data.errors[0].title === 'Forbidden') {
                            user2Status = 'User suspended';
                        }
                    } else if (!user2Data || !user2Data.data || !user2Data.data[0]) {
                        user2Status = 'No profile data';
                    }

                    return {
                        user1Name: user1Data?.data?.[0]?.username || pair.node1,
                        user1Image: user1Data?.data?.[0]?.profile_image_url || '',
                        user1Status,
                        user2Name: user2Data?.data?.[0]?.username || pair.node2,
                        user2Image: user2Data?.data?.[0]?.profile_image_url || '',
                        user2Status,
                        value: parseFloat(pair.similarity), // Ensure value is parsed as number
                    };
                });

                const networkPairsDetailsResults = await Promise.all(networkPairsDetailsPromises);
                setNetworkPairsData(networkPairsDetailsResults);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleSliderChange = (event, newValue) => {
        setFilter(newValue);
    };

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} lg={4}>
                <UserCountCard 
                    primary="Accounts Analysed" 
                    secondary={checkedUsersCount ? checkedUsersCount.toString() : '0'} 
                    iconPrimary={AccountCircleTwoTone} 
                    color="secondary.main" 
                />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
                <UserCountCard 
                    primary="LPA Analysis" 
                    secondary={lpaCount ? lpaCount.toString() : '0'} 
                    iconPrimary={DescriptionTwoToneIcon} 
                    color="primary.dark" 
                />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
                <UserCountCard 

                    primary="Network Analysis" 
                    secondary={structuralAnalysisCount ? structuralAnalysisCount.toString() : '0'} 
                    iconPrimary={AssessmentOutlinedIcon} 
                    color="success.dark" 
                />
            </Grid>

            <Grid item xs={12}>
                <Box 
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 2,
                        borderRadius: 2,
                        boxShadow: 1,
                        bgcolor: 'background.paper'
                    }}
                >
                    <Typography variant="h6" gutterBottom sx={{ mr: 2 }}>
                        Show top number of users
                    </Typography>
                    <Slider
                        value={filter}
                        onChange={handleSliderChange}
                        aria-labelledby="continuous-slider"
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={1}
                        max={10}
                        sx={{ width: '50%' }}
                    />
                </Box>
            </Grid>
         
            <Grid item xs={12} lg={6} md={6}>
                <MainCard  title={`LPA Analysis- Top ${filter} Suspects`} content={false} sx={{ boxShadow: 3 }}>
                    <CardContent sx={{ p: 2 }}>
                        <ProjectTable data={userDetails.slice(0, filter)} /> {/* Apply filter */}
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>

                    </CardActions>
                </MainCard>
            </Grid>
         
            <Grid item xs={12} lg={6} md={6}>
                <MainCard    title={`Network Analysis - Top ${filter} Suspects`} content={false} sx={{ boxShadow: 3 }}>
                    <CardContent sx={{ p: 2 }}>
                        <ProjectTable data={networkSinglesData.slice(0, filter)} /> {/* Apply filter */}
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                    </CardActions>
                </MainCard>
            </Grid>
            <Grid item xs={12} lg={6} md={6}>
                <MainCard title={`LPA - Top ${filter} Sockpuppets`} content={false}>
                    <CardContent sx={{ p: 0 }}>
                        <PairsResultsTable data={pairsData.slice(0, filter)} /> 
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'flex-end' }}>

                    </CardActions>
                </MainCard>
            </Grid>
            <Grid item xs={12} lg={6} md={6}>
                <MainCard title={`Network Analysis - Top ${filter} Sockpuppets`} content={false}>
                    <CardContent sx={{ p: 0 }}>
                        <PairsResultsTable data={networkPairsData.slice(0, filter)} /> 
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'flex-end' }}>

                    </CardActions>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default WidgetData;
