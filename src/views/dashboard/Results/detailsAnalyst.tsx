import { useLocation} from 'react-router-dom';
import React, { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Box, Grid, Stack, Typography } from '@mui/material';

const convertTypes = [
  { label: 'Textual analysis', id: 1 },
  { label: 'Structural analysis', id: 2 },
  { label: 'Textual and Structural analysis', id: 3 },
];


const DetailsAnalyst = () => {
  const gridSpacing = 2; 
  const location = useLocation();
  const state = location.state || {};
  const { projectName,
          email,
          threshold,
          signature,
          responseFerqData,
          typeOfAnalysis, } = state;
  const analysisType = convertTypes.find(type => type.id === typeOfAnalysis)?.label || 'Unknown Type';

  
  return (
   
    <MainCard title="Experiment Details" >
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item sm={6} md={12}>
            <Stack spacing={2}>
            
              <Stack spacing={1.5}>
                <Typography variant="subtitle1">
                Project Name: <Typography component="span" variant="body2">{projectName}</Typography>
                </Typography>
                <Typography variant="subtitle1">
                Frequency File: <Typography component="span" variant="body2">{responseFerqData.FrequencyFile}</Typography>
                </Typography>
                <Typography variant="subtitle1">
                  Email: <Typography component="span" variant="body2">{email}</Typography>
                </Typography>
                <Typography variant="subtitle1">
                Type Of Analysis: <Typography component="span" variant="body2">{analysisType}</Typography>
                </Typography>
                <Typography variant="subtitle1">
                Threshold: <Typography component="span" variant="body2">{threshold}</Typography>
                </Typography>
                <Typography variant="subtitle1">
                Signature: <Typography component="span" variant="body2">{signature}</Typography>
                </Typography>
                <Typography variant="subtitle1">
                Accounts analyzed : <Typography component="span" variant="body2">{responseFerqData.account}</Typography>
                </Typography>
                <Typography variant="subtitle1">
                All accounts: <Typography component="span" variant="body2">{responseFerqData.initiaAuthorsCount}</Typography>
                </Typography>
                <Typography variant="subtitle1">
                Total posts: <Typography component="span" variant="body2">{responseFerqData.initialPostsCount}</Typography>
                </Typography>
              </Stack>
              <Box height={27} /> 
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </MainCard>
 
  );
};

export default DetailsAnalyst;
