import * as React from 'react';

// material-ui
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';
import MainCard from 'ui-component/cards/MainCard';
import { KeyedObject, ArrangementOrder, EnhancedTableHeadProps } from 'types';
import { List, ListItemText,ListItem } from '@mui/material';

export type TableEnhancedCreateDataType = { feature: string; details: string };
// table data
export function createData(feature: string, details: string) {
    return {
        feature,
        details
    };
}

// table data
export const rows: TableEnhancedCreateDataType[] = [
    createData('Degree Centrality', 'Total number of connections'),
    createData('Out Degree Centrality', 'Number of profiles a profile follows'),
    createData('In Degree Centrality', 'Number of profiles a profile followed by'),
    createData('Betweenness Centrality', "Profile's influence on communication between others"),
    createData('Closeness Centrality', 'Average distance to all other profiles'),
    createData('Clustering Coefficient', "Community level of profile's followers"),
    createData('PageRank', 'Importance of a profile based on incoming links'),
    createData('Eccentricity', 'Maximum distance from a profile to any other profile')
];

// table filter
export function descendingComparator(a: KeyedObject, b: KeyedObject, orderBy: string) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export function getComparator(order: ArrangementOrder, orderBy: string) {
    return order === 'desc'
        ? (a: KeyedObject, b: KeyedObject) => descendingComparator(a, b, orderBy)
        : (a: KeyedObject, b: KeyedObject) => -descendingComparator(a, b, orderBy);
}

export function stableSort(array: TableEnhancedCreateDataType[], comparator: (a: KeyedObject, b: KeyedObject) => number) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0] as TableEnhancedCreateDataType, b[0] as TableEnhancedCreateDataType);
        if (order !== 0) return order;
        return (a[1] as number) - (b[1] as number);
    });
    return stabilizedThis.map((el) => el[0]);
}

// table header
export const headCells = [
    {
        id: 'name',
        numeric: false,
        label: 'Features'
    },
    {
        id: 'details',
        numeric: true,
        label: 'Details'
    }
];

// ==============================|| TABLE - HEADER ||============================== //

export function EnhancedTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort }: EnhancedTableHeadProps) {
    const createSortHandler = (property: string) => (event: React.SyntheticEvent) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox" sx={{ pl: 3 }}>
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all features'
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'left' : 'left'}
                        padding="normal"
                        sortDirection={orderBy === headCell.id ? order : undefined}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

// ==============================|| TABLE - TOOLBAR ||============================== //


export const EnhancedTableToolbar = ({ numSelected, selected }: { numSelected: number; selected: string[] }) => (
    <Toolbar
      sx={{
        p: 0,
        pl: 1,
        pr: 1,
        ...(numSelected > 0 && {
          color: (theme) => theme.palette.secondary.main,
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography variant="h4" color="tableTitle">
          {numSelected} features selected
        </Typography>
    )  : (
        <Typography variant="h4" id="tableTitle">
          Select features for Cosine-Similarity calculation
        </Typography>
      )}
    </Toolbar>
  );



