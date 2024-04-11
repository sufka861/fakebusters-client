// material-ui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// third party
import Chart, { Props as ChartProps } from 'react-apexcharts';

interface TotalLineChartCardProps {
    bgColor?: string;
    chartData?: ChartProps;
    title: string;
    percentage: string;
    value: number;
}

// ============================|| TOTAL LINE CHART CARD ||============================ //

const TotalLineChartCard = ({ bgColor, chartData, title, percentage, value }: TotalLineChartCardProps) => (
    <Card>
        <Box sx={{ color: '#fff', bgcolor: bgColor || 'primary.dark' }}>
            <Box sx={{ p: 2.5 }}>
                <Grid container direction="column">
                    <Grid item container justifyContent="space-between" alignItems="center">
                        {value && (
                            <Grid item>
                                <Typography variant="h3" color="inherit">
                                    {value}
                                </Typography>
                            </Grid>
                        )}
                        {percentage && (
                            <Grid item>
                                <Typography variant="body2" color="inherit">
                                    {percentage}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                    {title && (
                        <Grid item>
                            <Typography variant="body2" color="inherit">
                                {title}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
            {chartData && <Chart {...chartData} />}
        </Box>
    </Card>
);

export default TotalLineChartCard;
