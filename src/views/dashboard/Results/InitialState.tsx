import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import MainCard from 'ui-component/cards/MainCard';
import { CSVExport } from 'views/forms/tables/TableExports';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const useBorderLinearProgressStyles = (value) => {
  const theme = useTheme();
  let color;
  if (value >= 70) {
    color = theme.palette.error.main;
  } else if (value >= 40) {
    color = theme.palette.warning.main;
  } else {
    color = theme.palette.success.main;
  }

  return {
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: color,
    },
  };
};


const InitialState = ({ resultsLPA }) => {
    if (!resultsLPA || resultsLPA.length === 0) {
        return <div>No data available</div>;
    }
    const BorderLinearProgress = styled(LinearProgress)(({ theme, value }) => useBorderLinearProgressStyles(value));

    // You had a duplicated rows mapping. Removed one of them.
    const rows = resultsLPA.map((item, index) => ({
        id: index + 1,
        corpus1: item['Corpus 1'],
        corpus2: item['Corpus 2'],
        value: parseFloat(item.value), 
    }));
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'corpus1', headerName: 'Corpus 1', width: 150 },
        { field: 'corpus2', headerName: 'Corpus 2', width: 150 },
        {
            field: 'value',
            headerName: 'Filled Quantity',
            width: 150,
            renderCell: (params) => {
                // Invert the value and convert to percentage
                const progressValue = (1 - params.value) * 100;
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', padding: 1 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                            <BorderLinearProgress variant="determinate" value={progressValue} />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                            <Typography variant="body2" color="textSecondary">
                                {params.value.toFixed(5)} 
                            </Typography>
                        </Box>
                    </Box>
                );
            },
        },
    ];
    

    let headers = columns.map((item) => ({
        label: item.headerName,
        key: item.field
    }));

    return (
        <Grid item xs={12}>
            <MainCard
            
                content={false}
                title="Initial State with Access"
                secondary={
                    <Stack direction="row" spacing={2} alignItems="center">
                        <CSVExport data={rows} filename={'initial-state-data-grid-table.csv'} header={headers} />
                    </Stack>
                }
            >
         <Grid>

        </Grid>
                <Box sx={{ width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        hideFooterSelectedRowCount
                        pageSizeOptions={[5]}
                        autoHeight
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5
                                }
                            }
                        }}
                    />
   
                </Box>
             
            </MainCard>  
        </Grid>
    );
};

export default InitialState;
