import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chart from 'react-apexcharts';
import MainCard from 'ui-component/cards/MainCard';
import Box from '@mui/material/Box';

interface SockpuppetDetectionChartProps {
    sockpuppetData: {
        VeryLowLikelihood: number;
        LowLikelihood: number;
        MediumLikelihood: number;
        HighLikelihood: number;
    };
    title: string;
}

const SockpuppetDetectionChartCard = ({ sockpuppetData, title }: SockpuppetDetectionChartProps) => {
    if (!sockpuppetData) {
        console.error('SockpuppetDetectionChartCard data is undefined');
        sockpuppetData = {
            VeryLowLikelihood: 0,
            LowLikelihood: 0,
            MediumLikelihood: 0,
            HighLikelihood: 0
        };
    }

    const chartData = {
        height: 300,
        type: 'pie',
        options: {
            chart: {
                id: 'satisfaction-chart'
            },
            labels: ['0 - 0.24  ', '0.25 - 0.49 ', '0.5 - 0.74 ', '0.75 - 1.0'],
            legend: {
                show: true,
                position: 'bottom',
                fontFamily: 'inherit',
                labels: {
                    colors: 'inherit'
                }
            },
            dataLabels: {
                enabled: true,
                dropShadow: {
                    enabled: false
                }
            },
            theme: {
                monochrome: {
                    enabled: true
                }
            },
        },
        series: [
            sockpuppetData.VeryLowLikelihood,
            sockpuppetData.LowLikelihood,
            sockpuppetData.MediumLikelihood,
            sockpuppetData.HighLikelihood
        ]
    };

    return (
        <MainCard>
            <Grid container direction="column" spacing={1}>
                <Grid item>
                    <Typography variant="subtitle1">{title}</Typography>
                </Grid>
                <Grid item>
                    <Chart type={chartData.type} series={chartData.series} options={chartData.options} height={chartData.height} />
                    <Box height={40} />
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default SockpuppetDetectionChartCard;
