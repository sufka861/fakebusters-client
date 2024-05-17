import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Grid, Typography, Divider } from '@mui/material';

const UICardsPrimary = () => {
    const theme = useTheme();
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <Card 
            sx={{ border: '1px solid', borderColor: 'secondary.main' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <CardHeader
                sx={{ borderBottom: '1px solid', borderBottomColor: 'secondary.main' }}
                title={
                    <Typography variant="h5" sx={{ color: 'secondary.main' }}>
                        {isHovered ? "Number of words to create a signature" : "Signature"}
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
                            Changes to this setting may lead to delays in obtaining the results.
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default UICardsPrimary;
