import * as React from 'react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { visuallyHidden } from '@mui/utils';
import CosineSimilararityResults from './CosineSimilarityResults';
import MainCard from 'ui-component/cards/MainCard';
import { KeyedObject, ArrangementOrder, EnhancedTableHeadProps } from 'types';
import { List, ListItemText,ListItem } from '@mui/material';

type TableEnhancedCreateDataType = { feature: string; details: string };
// table data
function createData(feature: string, details: string) {
    return {
        feature,
        details
    };
}

// table data
const rows: TableEnhancedCreateDataType[] = [
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
function descendingComparator(a: KeyedObject, b: KeyedObject, orderBy: string) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order: ArrangementOrder, orderBy: string) {
    return order === 'desc'
        ? (a: KeyedObject, b: KeyedObject) => descendingComparator(a, b, orderBy)
        : (a: KeyedObject, b: KeyedObject) => -descendingComparator(a, b, orderBy);
}

function stableSort(array: TableEnhancedCreateDataType[], comparator: (a: KeyedObject, b: KeyedObject) => number) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0] as TableEnhancedCreateDataType, b[0] as TableEnhancedCreateDataType);
        if (order !== 0) return order;
        return (a[1] as number) - (b[1] as number);
    });
    return stabilizedThis.map((el) => el[0]);
}

// table header
const headCells = [
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

function EnhancedTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort }: EnhancedTableHeadProps) {
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


const EnhancedTableToolbar = ({ numSelected, selected }: { numSelected: number; selected: string[] }) => (
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
      <div>
        <Typography variant="h4" color="inherit">
          {numSelected} features selected:
        </Typography>
        <List dense>
          {selected.map((feature, index) => (
            <ListItem key={index} disablePadding>
              <ListItemText>
                <Typography>{feature}</Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </div>
    )  : (
        <Typography variant="h4" id="tableTitle">
          Select features for Cosine-Similarity calculation
        </Typography>
      )}
    </Toolbar>
  );
// ==============================|| TABLE - ENHANCED ||============================== //
interface FeaturesTableProps {
    graphData: any;

}

export default function FeaturesTable({ graphData  }: FeaturesTableProps) {
    const [order, setOrder] = React.useState<ArrangementOrder>('asc');
    const [orderBy, setOrderBy] = React.useState('feature');
    const [selected, setSelected] = React.useState<string[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense] = React.useState(true);
    const [rowsPerPage, setRowsPerPage] = React.useState(8);
    const [cosineSimilarityData,setCosineSimilarityData] = React.useState([]);
    const [selectedValue, setSelectedValue] = React.useState([]);
    const [showResults, setShowResults] = React.useState<boolean>(false);

    const handleRequestSort = (event: React.SyntheticEvent, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            if (selected.length > 0) {
                setSelected([]);
            } else {
                const newSelectedId: string[] = rows.map((n) => n.feature);
                setSelected(newSelectedId);
            }
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<HTMLTableRowElement> | undefined, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        const selectedRowData: any = rows.filter((row) => newSelected.includes(row.feature.toString()));
        setSelectedValue(selectedRowData);
        setSelected(newSelected);
    };

    const handleSubmit = async () => {
        const selectedFeatures = selected.map((feature) => feature.toLowerCase().replace(/\s+/g, '_'));
        try {
            const response = await fetch('https://graphs-analysis.onrender.com/similarity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ node_stats: graphData.nodes, selected_features: selectedFeatures })
            });
            const result = await response.json();
            setShowResults(true);
            setCosineSimilarityData(result.similarity);
            console.log('Similarity Results:', result);
        } catch (error) {
            console.error('Error submitting features:', error);
        }
    };

    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    console.log(selected)
    return (
        <MainCard content={false}>
            <EnhancedTableToolbar numSelected={selected.length} selected={selected} />
            

            {/* table */}
            {!showResults && 
             <MainCard>
            <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                    />
                    <TableBody>
                        {stableSort(rows, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                if (typeof row === 'number') return null;
                                const isItemSelected = isSelected(row.feature);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.feature)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.feature}
                                        selected={isItemSelected}
                                    >
                                        <TableCell sx={{ pl: 3 }} padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{row.feature}</TableCell>
                                        <TableCell align="left">{row.details}</TableCell>
                                    </TableRow>
                                );
                            })}
                        {emptyRows > 0 && (
                            <TableRow sx={{ height: (dense ? 33 : 53) * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ m: 2 }}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                Calculate Cosine Similarity
                </Button>
            </Box>
             </MainCard>
            }

            <Box sx={{ m: 2 }}>
                {showResults && <CosineSimilararityResults similarityData={cosineSimilarityData} />}
            </Box>
        </MainCard>
        
    );
}
