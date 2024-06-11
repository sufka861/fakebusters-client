import React from 'react';
import NodeTable, { NodeUser } from './NodeTable';
import { Box, Button, Grid, Typography } from '@mui/material';
import { gridSpacing } from 'store/constant';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

interface StatisticsProps {
    nodes: NodeUser[];
    error: string | null;
}

function Statistics({ nodes, error }: StatisticsProps) {
    const navigate = useNavigate();

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
