import React from 'react';
import Grid from '@mui/material/Grid';
import ReportCard from 'ui-component/cards/ReportCard';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import AccountCircleTwoTone from '@mui/icons-material/AccountCircleTwoTone';
import Tooltip from '@mui/material/Tooltip';

function ReportCards({ responseFerqData }) {
    console.log(responseFerqData)
    return (
        <>
            <Grid item xs={12} lg={3} sm={6}>
                <Tooltip title="Sum of terms found during the initial data processing." enterTouchDelay={0}>
                    <div>
                        <ReportCard primary={responseFerqData.word} secondary="Terms count" color="secondary.main" iconPrimary={AssessmentOutlinedIcon} />
                    </div>
                </Tooltip>
            </Grid>
            <Grid item xs={12} lg={3} sm={6}>
                <Tooltip title="Sum of posts that were examined." enterTouchDelay={0}>
                    <div>
                        <ReportCard primary={responseFerqData.initialPostsCount} secondary="Posts" color="error.main" iconPrimary={CalendarTodayOutlinedIcon} />
                    </div>
                </Tooltip>
            </Grid>
            <Grid item xs={12} lg={3} sm={6}>
    <Tooltip title={`Represents the size of the dataset processed by the LPA algorithm. Average per account: ${(responseFerqData.freq / responseFerqData.account).toFixed(2)} Words.`} enterTouchDelay={0}>
        <div>
            <ReportCard primary={responseFerqData.freq} secondary="Term Frequency Size" color="success.dark" iconPrimary={DescriptionTwoToneIcon} />
        </div>
    </Tooltip>
</Grid>

            <Grid item xs={12} lg={3} sm={6}>
                <Tooltip title="Fraction of accounts that proceed to the LPA - accounts that match the preprocessing filters" enterTouchDelay={0}>
                    <div>
                        <ReportCard primary={`${responseFerqData.account}/${responseFerqData.initialAuthorsCount}`} secondary="Processed Accounts / Total Accounts" color="primary.main" iconPrimary={AccountCircleTwoTone} />
                    </div>
                </Tooltip>
            </Grid>
        </>
    );
}

export default ReportCards;
