import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import { gridSpacing } from 'store/constant';
import LabelSlider from 'views/forms/components/Slider/LabelSlider';
import AnalysisTypeSelector from 'views/forms/components/multipleChoice';

const typesAnalysis = [
    { label: 'Textual analysis', id: 1 },
    { label: 'Structural analysis', id: 2 },
    { label: 'Textual and Structural analysis', id: 3 },
];

function ProjectForm({
    formData,
    setFormData,
    handleFormChange
}) {

    const { projectName, email, threshold, signature, typeOfAnalysis, saveFrequencyFile, saveSettings } = formData;
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <MainCard title="New Analysis">
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                            <InputLabel>Project Name</InputLabel>
                            <TextField
                                fullWidth
                                placeholder="Enter project name"
                                value={projectName}
                                onChange={(e) => handleFormChange('projectName', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <InputLabel>Type of Analysis</InputLabel>
                            <AnalysisTypeSelector
                                options={typesAnalysis}
                                placeholder="Type of Analysis"
                                value={typeOfAnalysis}
                                onChange={(e) => handleFormChange('typeOfAnalysis', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel>Email</InputLabel>
                            <TextField
                                type="email"
                                fullWidth
                                placeholder='Email'
                                value={email}
                                onChange={(e) => handleFormChange('email', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Settings:
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={7}>
                                    <LabelSlider
                                        min={0.1}
                                        max={1}
                                        start={threshold}
                                        label="Threshold"
                                        step={0.1}
                                        onChange={(e, value) => handleFormChange('threshold', value)}
                                    />
                                    <LabelSlider
                                        min={100}
                                        max={2000}
                                        start={signature}
                                        label="Signature"
                                        color="secondary"
                                        step={100}
                                        onChange={(e, value) => handleFormChange('signature', value)}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={saveFrequencyFile}
                                                onChange={(e) => handleFormChange('saveFrequencyFile', e.target.checked)}
                                            />
                                        }
                                        label="Save a frequency file"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={saveSettings}
                                                onChange={(e) => handleFormChange('saveSettings', e.target.checked)}
                                            />
                                        }
                                        label="Save settings"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </MainCard>
            </Grid>
        </Grid>
    );
}

export default ProjectForm;
