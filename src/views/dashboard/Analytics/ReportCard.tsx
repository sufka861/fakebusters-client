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
                <Tooltip title="The total number of words found during the initial data processing." enterTouchDelay={0}>
                    <div>
                        <ReportCard primary={responseFerqData.word} secondary="Words" color="secondary.main" iconPrimary={AssessmentOutlinedIcon} />
                    </div>
                </Tooltip>
            </Grid>
            <Grid item xs={12} lg={3} sm={6}>
                <Tooltip title="The total count of posts that were examined." enterTouchDelay={0}>
                    <div>
                        <ReportCard primary={responseFerqData.initialPostsCount} secondary="Posts" color="error.main" iconPrimary={CalendarTodayOutlinedIcon} />
                    </div>
                </Tooltip>
            </Grid>
            <Grid item xs={12} lg={3} sm={6}>
    <Tooltip title={`Represents the size of the dataset processed by the LPA algorithm. Average per account: ${(responseFerqData.freq / responseFerqData.account).toFixed(2)} Words.`} enterTouchDelay={0}>
        <div>
            <ReportCard primary={responseFerqData.freq} secondary="Frequency Lines" color="success.dark" iconPrimary={DescriptionTwoToneIcon} />
        </div>
    </Tooltip>
</Grid>

            <Grid item xs={12} lg={3} sm={6}>
                <Tooltip title="Average number of accounts examined - accounts that published over 30 posts." enterTouchDelay={0}>
                    <div>
                        <ReportCard primary={`${responseFerqData.account}/${responseFerqData.initialAuthorsCount}`} secondary="Accounts" color="primary.main" iconPrimary={AccountCircleTwoTone} />
                    </div>
                </Tooltip>
            </Grid>
        </>
    );
}

export default ReportCards;
