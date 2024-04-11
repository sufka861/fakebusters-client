import { ReactNode } from 'react';

// material-ui
import { Theme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// third party
import Chart, { Props as ChartProps } from 'react-apexcharts';

// project imports
import MainCard from './MainCard';

// =============================|| SEO CHART CARD ||============================= //

interface SeoChartCardProps {
    chartData: ChartProps;
    value?: string | number;
    title?: string;
    icon?: ReactNode | string;
    type?: number;
}

const SeoChartCard = ({ chartData, value, title, icon, type }: SeoChartCardProps) => {
    const downMM = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    return (
        <MainCard content={false} sx={{ p: 2.5 }}>
            <Grid container spacing={1.25} justifyContent="space-between">
                <Grid item xs={12}>
                    <Stack direction={type === 1 ? 'column-reverse' : 'column'} spacing={type === 1 ? 0.5 : 1}>
                        {value && <Typography variant={downMM ? 'h4' : 'h3'}>{value}</Typography>}
                        {(title || icon) && (
                            <Stack direction="row" alignItems="center" spacing={1}>
                                {title && (
                                    <Typography variant="body1" color="grey.500">
                                        {title}
                                    </Typography>
                                )}
                                {icon && icon}
                            </Stack>
                        )}
                    </Stack>
                </Grid>
                {chartData && (
                    <Grid item xs={12}>
                        <Chart {...chartData} />
                    </Grid>
                )}
            </Grid>
        </MainCard>
    );
};

export default SeoChartCard;
