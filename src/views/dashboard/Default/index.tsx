import React, { useState } from 'react';
// material-ui
import Button from '@mui/material/Button';
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
import ToDoList from './ToDoList';
import TrafficSources from './TrafficSources';
import TeamMembers from './TeamMembers';

import UserActivity from './UserActivity';
import LatestMessages from './LatestMessages';

import ProjectTable from './ProjectTable';
import ProductSales from './ProductSales';

import TasksCard from '../Vocabularies/TasksCard';
import ApplicationSales from './ApplicationSales';

import ActiveTickets from './ActiveTickets';
import LatestPosts from './LatestPosts';

import FeedsCard from './FeedsCard';
import LatestCustomers from './LatestCustomers';
import LatestOrder from './LatestOrder';

import IncomingRequests from './IncomingRequests';
import TotalRevenue from './TotalRevenue';
import NewCustomers from './NewCustomers';
import RecentTickets from './RecentTickets';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// ===========================|| WIDGET DATA ||=========================== //

const WidgetData = () => {
    const [filter, setFilter] = useState(5); // default to show 5 rows

    const handleSliderChange = (event, newValue) => {
        setFilter(newValue);
    };

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} lg={4}>
                <UserCountCard 
                    primary="Number of Checked Users" 
                    secondary="1,658" 
                    iconPrimary={AccountCircleTwoTone} 
                    color="secondary.main" 
                />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
                <UserCountCard 
                    primary="Number of LPA Analyses" 
                    secondary="1K" 
                    iconPrimary={DescriptionTwoToneIcon} 
                    color="primary.dark" 
                />
            </Grid>
            <Grid item xs={12} lg={4} sm={6}>
                <UserCountCard 
                    primary="Number of Structural Analyses" 
                    secondary="5,678" 
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
                        Number of People to Display in Tables
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
                <MainCard title="LPA Analysis - Main Suspects" content={false} sx={{ boxShadow: 3 }}>
                    <CardContent sx={{ p: 2 }}>
                        <ProjectTable filter={filter} />
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                        <Button variant="outlined" color="primary">
                            View All
                        </Button>
                    </CardActions>
                </MainCard>
            </Grid>

            <Grid item xs={12} lg={6} md={6}>
                <MainCard title="Structural Analysis - Main Suspects" content={false} sx={{ boxShadow: 3 }}>
                    <CardContent sx={{ p: 2 }}>
                        <ProjectTable filter={filter} />
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                        <Button variant="outlined" color="primary">
                            View All
                        </Button>
                    </CardActions>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default WidgetData;
