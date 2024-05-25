import React, { useState } from 'react';
import { Card, CardContent, Typography, Icon } from '@mui/material';

const HoverReportCard = ({ primary, secondary, color, iconPrimary: IconPrimary, hoverText }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <Card 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave} 
            sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: color }}
        >
            {isHovered ? (
                <Typography variant="subtitle1" style={{ textAlign: 'center' }}>
                    {hoverText}
                </Typography>
            ) : (
                <>
                    <Icon component={IconPrimary} sx={{ fontSize: 40 }} />
                    <Typography variant="h5">{primary}</Typography>
                    <Typography variant="subtitle2">{secondary}</Typography>
                </>
            )}
        </Card>
    );
};

export default HoverReportCard;
