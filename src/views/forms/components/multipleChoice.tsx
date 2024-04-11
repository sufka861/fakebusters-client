import React from 'react';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const AnalysisTypeSelector = ({ options, placeholder }) => {
    return (
        <Grid>
            <Grid item>
                <Autocomplete
                    disableClearable
                    options={options}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                        <TextField {...params} fullWidth placeholder={placeholder} label="" />
                    )}
                />
            </Grid>
        </Grid>
    );
};

export default AnalysisTypeSelector;
