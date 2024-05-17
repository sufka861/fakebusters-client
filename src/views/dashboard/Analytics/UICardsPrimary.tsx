import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { ThemeMode } from 'types/config';

const UICardsPrimary = () => {
    const theme = useTheme();
    const [isHovered, setIsHovered] = useState(false);

    const cardStyle = {
        bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'grey.50',
        border: '1px solid',
        borderColor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'grey.100'
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <Card 
            sx={{ ...cardStyle, borderColor: 'primary.main' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <CardHeader
                sx={{ borderBottom: '1px solid', borderBottomColor: 'primary.main' }}
                title={
                    <Typography variant="h5" sx={{ color: 'primary.main' }}>
                        {isHovered ? "Setting a threshold for displaying results" : "Threshold"}
                    </Typography>
                }
            />
            <CardContent>
                <Typography variant="subtitle2" color="inherit">
                    The threshold setting acts as a filter for the volume of results you receive. Adjusting this value refines the data to either broaden or narrow the scope of analysis outcomes.
                </Typography>
            </CardContent>
        </Card>
    );
};

export default UICardsPrimary;
