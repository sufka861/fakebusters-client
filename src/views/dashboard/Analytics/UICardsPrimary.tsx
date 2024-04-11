import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { ThemeMode } from 'types/config'; 

const UICardsPrimary = () => {
    const theme = useTheme();

    const cardStyle = {
        bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'grey.50',
        border: '1px solid',
        borderColor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'grey.100'
    };

    return (

                <Card sx={{ ...cardStyle, borderColor: 'primary.main' }}>
                    <CardHeader
                        sx={{ borderBottom: '1px solid', borderBottomColor: 'primary.main' }}
                        title={
                            <Typography variant="h5" sx={{ color: 'primary.main' }}>
                                Threshold
                            </Typography>
                        }
                    />
                    <CardContent>
                        
                        <Typography variant="subtitle2" color="inherit">
                        The threshold setting acts as a filter for the volume of results you receive. Adjusting this value refines the data to either broaden or narrow the scope of analysis outcomes.
                            <></>
                        </Typography>
                   
                    </CardContent>
                </Card>
    );
};

export default UICardsPrimary;
