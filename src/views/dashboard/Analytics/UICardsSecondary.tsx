import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { ThemeMode } from 'types/config'; 
import Divider from '@mui/material/Divider';

const UICardsPrimary = () => {
    const theme = useTheme();

    const cardStyle = {
        bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'grey.50',
        border: '1px solid',
        borderColor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'grey.100'
    };

    return (

        <Card sx={{ border: '1px solid', borderColor: 'secondary.main' }}>
        <CardHeader
            sx={{ borderBottom: '1px solid', borderBottomColor: 'secondary.main' }}
            title={
                <Typography variant="h5" sx={{ color: 'secondary.main' }}>
                    Signature
                </Typography>
            }
        />
        <Divider />
        <CardContent>
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Typography variant="subtitle1" color="inherit">
                    Choose the level of accuracy!
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="subtitle2" color="inherit">
                Creating a signature of 500 words is recommended for optimal performance. 
                Changes to this setting may lead to delays in obtaining the results.                </Typography>
            </Grid>
        </Grid>
        </CardContent>
    </Card>
    );
};

export default UICardsPrimary;
