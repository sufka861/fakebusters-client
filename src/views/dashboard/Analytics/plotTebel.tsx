import React from 'react';
import { BarChart, BarChartProps } from '@mui/x-charts';
import { axisClasses } from '@mui/x-charts';
import MainCard from 'ui-component/cards/MainCard';
import { Box, Typography } from '@mui/material';

interface AxisFormatterProps {
  posts_distribution: { [key: string]: number } | null | undefined;
  title: string;
  color: string;
}

const AxisFormatter: React.FC<AxisFormatterProps> = ({ posts_distribution, title }) => {
  // Ensure posts_distribution is defined and is an object
  const dataset = posts_distribution
    ? Object.keys(posts_distribution).map(key => ({
        range: key,
        posts: posts_distribution[key]
      }))
    : [];

  const chartParams: BarChartProps = {
    series: [
      {
        label: 'Posts',
        dataKey: 'posts',
        valueFormatter: (v) => `${v}`,
        color={color}, 
      },
    ],
    slotProps: { legend: { hidden: true } },
    dataset,
    width: '550',
    height: '400',
    sx: {
      [`& .${axisClasses.left} .${axisClasses.label}`]: {
        transform: 'translate(-20px, 0)',
        fill = {color},
      },
      [`& .${axisClasses.bottom} .${axisClasses.label}`]: {
        fill={color},
      },
      '& rect': {
        fill={color},
      },
    },
  };

  return (
    <MainCard title={title}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {dataset.length > 0 ? (
          <BarChart
            xAxis={[
              {
                scaleType: 'band',
                dataKey: 'range',
                valueFormatter: (range, context) =>
                  context.location === 'tick'
                    ? range
                    : `Range: ${range}`,
              },
            ]}
            {...chartParams}
          />
        ) : (
          <Typography variant="body2" color="textSecondary">
            No data available
          </Typography>
        )}
        <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
          <Typography variant="body2" color="textSecondary">
            X - range of the number of posts written.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Y - number of users who wrote the corresponding number of posts.
          </Typography>
        </Box>
      </Box>
    </MainCard>
  );
};

export default AxisFormatter;
