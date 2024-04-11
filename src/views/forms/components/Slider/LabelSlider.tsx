import React from 'react';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

interface LabelSliderProps {
    min: number;
    max: number;
    start: number;
    label: string;
    color?: 'primary' | 'secondary';
    step?: number;
}

export default function LabelSlider({ min, max, start, label, color = 'primary', step = 0.1 }: LabelSliderProps) {
    const [value, setValue] = React.useState<number>(start);
    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number);
    };

    return (
        <Grid  item xs={12} container direction="column" spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12} container spacing={2} alignItems="center">
                <Grid item>
                    <Typography variant="caption">{label}</Typography>
                </Grid>
                <Grid item xs>
                    <Slider
                        value={value}
                        onChange={handleChange}
                        aria-labelledby="continuous-slider"
                        min={min}
                        max={max}
                        step={step}
                        color={color}
                    />
                </Grid>
                <Grid item>
                    <Typography variant="h6">{value}</Typography>
                </Grid>
            </Grid>
        </Grid>
    );
}
