import React from 'react';
import Grid from '@mui/material/Grid';
import ReportCard from 'ui-component/cards/ReportCard';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import AccountCircleTwoTone from '@mui/icons-material/AccountCircleTwoTone';

function ReportCards({ responseFerqData }) {
    return (
        <>
            <Grid item xs={12} lg={3} sm={6}>
                <ReportCard primary={responseFerqData.word} secondary="Words" color="secondary.main" iconPrimary={AssessmentOutlinedIcon} />
            </Grid>
            <Grid item xs={12} lg={3} sm={6}>
                <ReportCard primary={responseFerqData.initialPostsCount} secondary="Post" color="error.main" iconPrimary={CalendarTodayOutlinedIcon} />
            </Grid>
            <Grid item xs={12} lg={3} sm={6}>
                <ReportCard primary={responseFerqData.freq} secondary="Frequency Lines" color="success.dark" iconPrimary={DescriptionTwoToneIcon} />
            </Grid>
            <Grid item xs={12} lg={3} sm={6}>
            <ReportCard primary={`${responseFerqData.account}/${responseFerqData.initiaAuthorsCount}`} secondary="Account" color="primary.main" iconPrimary={AccountCircleTwoTone} />
            </Grid>
        </>
    );
}

export default ReportCards;







