import React, { useState, useEffect } from 'react';
import NodeTable, { NodeUser } from './NodeTable';
import { Box, Button, Grid, Typography } from '@mui/material';
import { gridSpacing } from 'store/constant';
import { useLocation, useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import CircularProgress from '@mui/material/CircularProgress';


interface StatisticsProps {
    graphData: any;
}

function Statistics({ graphData }: StatisticsProps) {
    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state || {}; // Fallback to empty object if no state is passed
    const [refreshKey, setRefreshKey] = useState(0);
    const [nodes, setNodes] = useState<NodeUser[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch nodes data from server
        fetch('http://localhost:5000/stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(graphData) // Send graphData here
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setNodes(data);
                setError(null); // Clear any previous errors
            })
            .catch((error) => {
                console.error('Error fetching node data:', error);
                setError(error.message); // Set error state
            });
    }, [refreshKey, graphData]);

    if (error) {
        return (
            <Grid container spacing={gridSpacing} justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Typography variant="h4" align="center">
                        No Results Available
                    </Typography>
                    <Box textAlign="center" mt={2}>
                        <Button variant="contained" color="secondary" onClick={() => navigate('/dashboard/structure')}>
                            NEW Structural ANALYSIS
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        );
    }

    if (!nodes.length) {
        return (
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <CircularProgress aria-label="progress" />
        </Grid>
        );
    }
    return (
        <Grid item xs={12} md={12} lg={12}>
                <NodeTable nodes={nodes} />
        </Grid>
    );
}

export default Statistics;
