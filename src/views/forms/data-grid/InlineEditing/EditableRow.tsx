// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { randomCreatedDate, randomTraderName, randomUpdatedDate } from '@mui/x-data-grid-generator';

// project import
import MainCard from 'ui-component/cards/MainCard';
import CardSecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { CSVExport } from 'views/forms/tables/TableExports';

// ==============================|| EDITABLE ROW DATA GRID ||============================== //

export default function BasicRowEditingGrid() {
    let headers: any = [];
    columns.map((item) => {
        return headers.push({ label: item.headerName, key: item.field });
    });

    return (
        <MainCard
            content={false}
            title="Editable Row"
            secondary={
                <Stack direction="row" spacing={2} alignItems="center">
                    <CSVExport data={rows} filename={'editable-row-data-grid-table.csv'} header={headers} />
                    <CardSecondaryAction link="https://mui.com/x/react-data-grid/editing/#row-editing" />
                </Stack>
            }
        >
            <Box sx={{ width: '100%' }}>
                <DataGrid hideFooter autoHeight editMode="row" rows={rows} columns={columns} />
            </Box>
        </MainCard>
    );
}

const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 180, editable: true },
    {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        editable: true,
        align: 'left',
        flex: 0.5,
        minWidth: 120,
        headerAlign: 'left'
    },
    {
        field: 'dateCreated',
        headerName: 'Date Created',
        type: 'date',
        flex: 0.75,
        minWidth: 180,
        editable: true
    },
    {
        field: 'lastLogin',
        headerName: 'Last Login',
        type: 'dateTime',
        flex: 0.75,
        minWidth: 180,
        editable: true
    }
];

const rows: GridRowsProp = [
    {
        id: 1,
        name: randomTraderName(),
        age: 25,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate()
    },
    {
        id: 2,
        name: randomTraderName(),
        age: 36,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate()
    },
    {
        id: 3,
        name: randomTraderName(),
        age: 19,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate()
    },
    {
        id: 4,
        name: randomTraderName(),
        age: 28,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate()
    },
    {
        id: 5,
        name: randomTraderName(),
        age: 23,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate()
    }
];
