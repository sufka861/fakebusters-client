import React, { useState, useEffect } from 'react';
import NodeTable, { NodeUser } from './NodeTable';
import { Box, Button, Grid, Typography } from '@mui/material';
import { gridSpacing } from 'store/constant';
import { useLocation, useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';

function Statistics() {
    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state || {}; // Fallback to empty object if no state is passed
    const [refreshKey, setRefreshKey] = useState(0);
    const [nodes, setNodes] = useState<NodeUser[]>([]);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        // Fetch nodes data from server
        fetch('http://localhost:5000/stats')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
              
                setNodes(data);
                setError(null); // Clear any previous errors
                if (nodes) {console.log(nodes)}
            })
            .catch((error) => {
                console.error('Error fetching node data:', error);
                setError(error.message); // Set error state
            });
    }, [refreshKey]);
        if (error) {
        return (
            <Grid container spacing={gridSpacing} justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Typography variant="h4" align="center">
                        No Results Available
                    </Typography>
                    <Box textAlign="center" mt={2}>
                        <Button variant="contained" color="secondary" onClick={() => navigate('/dashboard/analytics')}>
                            NEW Structual ANALYSIS
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        );
    }
    if (!nodes) {
        return (
            <Grid container spacing={gridSpacing} justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Typography variant="h4" align="center">
                        No Results Available
                    </Typography>
                    <Box textAlign="center" mt={2}>
                        <Button variant="contained" color="secondary" onClick={() => navigate('/dashboard/analytics')}>
                            NEW Structual ANALYSIS
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        );
    }

    return (
      <Grid item xs={12} md={6} lg={6}>
          <MainCard title="Users Statistics - Network analysis">
              <NodeTable nodes={nodes} />
          </MainCard>
      </Grid>
  );
}



export default Statistics;
