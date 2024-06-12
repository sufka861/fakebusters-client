import React from 'react';
import { useLocation } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import { Box, Grid, Chip, Stack, Typography, Divider } from '@mui/material';
import { styled } from '@mui/system';

const convertTypes = [
    { label: 'Textual analysis', id: 1 },
    { label: 'Structural analysis', id: 2 },
    { label: 'Textual and Structural analysis', id: 3 }
];

interface DetailsAnalystProps {
    projectName: string;
    email: string;
    threshold: number;
    signature: string;
}

const StyledChip = styled(Chip)(({ theme }) => ({
    margin: theme.spacing(0.5),
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
}));

const DetailsAnalyst = ({ projectName, email, threshold, signature }: DetailsAnalystProps) => {
    const gridSpacing = 2;
    const location = useLocation();
    const state = location.state || {};
    const { responseFerqData, typeOfAnalysis } = state;
    const analysisType = convertTypes.find((type) => type.id === typeOfAnalysis)?.label || 'Unknown Type';

    return (
        <MainCard title="Experiment Details">
            <Box padding={2}>
                <Typography variant="h6" gutterBottom>
                    General
                </Typography>
                <Divider />
                <Grid container spacing={2} marginTop={1}>
                    <StyledChip label={`Project Name: ${projectName}`} />
                    <StyledChip label={`Frequency File: ${responseFerqData?.FrequencyFile}`} />
                    <StyledChip label={`Email: ${email}`} />
                    <StyledChip label={`Type Of Analysis: ${analysisType}`} />
                </Grid>

                <Typography variant="h6" gutterBottom marginTop={2}>
                    Analysis Settings
                </Typography>
                <Divider />
                <Grid container spacing={2} marginTop={1}>
                    <StyledChip label={`Threshold: ${threshold}`} />
                    <StyledChip label={`Signature: ${signature}`} />
                </Grid>

                {/* <Typography variant="h6" gutterBottom marginTop={2}>
                    Data Statistics
                </Typography>
                <Divider />
                <Grid container spacing={2} marginTop={1}>
                    <StyledChip label={`Accounts Analyzed: ${responseFerqData?.account}`} />
                    <StyledChip label={`All Accounts: ${responseFerqData?.initialAuthorsCount}`} />
                    <StyledChip label={`Total Posts: ${responseFerqData?.initialPostsCount}`} />
                </Grid> */}
            </Box>
        </MainCard>
    );
};

export default DetailsAnalyst;
