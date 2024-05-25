import React, { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart, { Props as ChartProps } from 'react-apexcharts';

// project import
import useConfig from 'hooks/useConfig';

// chart options
const barChartOptions = {
    chart: {
        type: 'bar',
        height: 350
    },
    plotOptions: {
        bar: {
            borderRadius: 4,
            horizontal: true
        }
    },
    dataLabels: {
        enabled: false
    },
    xaxis: {
        categories: [
            'South Korea',
            'Canada',
            'United Kingdom',
            'Netherlands',
            'Italy',
            'France',
            'Japan',
            'United States',
            'China',
            'Germany'
        ]
    },
    legend: {
        show: true,
        fontFamily: `'Roboto', sans-serif`,
        position: 'bottom',
        offsetX: 10,
        offsetY: 10,
        labels: {
            useSeriesColors: false
        },
        markers: {
            width: 16,
            height: 16,
            radius: 5
        },
        itemMargin: {
            horizontal: 15,
            vertical: 8
        }
    },
    responsive: [
        {
            breakpoint: 600,
            options: {
                yaxis: {
                    show: false
                }
            }
        }
    ]
};

// ==============================|| BAR CHART ||============================== //

const ApexBarChart: React.FC<ApexBarChartProps> = ({ categories, data, bgColor }) => {
    const theme = useTheme();
    const { mode } = useConfig();

    const primary = theme.palette.text.primary;
    const darkLight = theme.palette.dark.light;
    const divider = theme.palette.divider;

    const successDark = theme.palette.success.dark;

    const [series] = useState([{ data }]);
    const [options, setOptions] = useState<ChartProps>(barChartOptions);

    useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            xaxis: {
                ...prevState.xaxis,
                categories: categories,
                labels: {
                    style: {
                        colors: Array(categories.length).fill(primary)
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: Array(categories.length).fill(primary)
                    }
                }
            },
            grid: {
                borderColor: divider
            },
            tooltip: {
                theme: mode
            },
            colors: [bgColor] 
        }));
    }, [categories, data, mode, primary, darkLight, divider, successDark]);

    return <div id="chart">
        <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>;
};


export default ApexBarChart;
