import { Props } from 'react-apexcharts';
// ==============================|| WIDGET - SATISFACTION CHART ||============================== //

const chartData: Props = {
    height: 300,
    type: 'pie',
    options: {
        chart: {
            id: 'satisfaction-chart'
        },
        labels: ['Very High Risk', 'High Risk', 'Medium Risk', 'Low Risk'],
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
        }
    },
    series: [66, 50, 40, 30]
};

export default chartData;
