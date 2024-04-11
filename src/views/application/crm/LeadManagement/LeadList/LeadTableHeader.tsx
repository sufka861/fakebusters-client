// material-ui
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// assets
import DeleteIcon from '@mui/icons-material/Delete';

// types
import { EnhancedTableHeadProps, HeadCell, EnhancedTableToolbarProps } from 'types';

// table header options
const headCells: HeadCell[] = [
    {
        id: 'id',
        numeric: true,
        label: 'ID'
    },
    {
        id: 'name',
        numeric: false,
        label: 'Name'
    },
    {
        id: 'manage',
        numeric: false,
        label: 'Lead Manage'
    },
    {
        id: 'source',
        numeric: false,
        label: 'Source'
    },
    {
        id: 'status',
        numeric: false,
        label: 'Status'
    },
    {
        id: 'assigned',
        numeric: false,
        label: 'Assigned'
    },
    {
        id: 'company',
        numeric: false,
        label: 'Company'
    },
    {
        id: 'phone',
        numeric: false,
        label: 'Phone no'
    },
    {
        id: 'duration',
        numeric: false,
        label: 'Duration'
    },
    {
        id: 'followup',
        numeric: false,
        label: 'Next Followup'
    },
    {
        id: 'created',
        numeric: false,
        label: 'Created Lead'
    }
];

// ==============================|| LEAD - TABLE TOOLBAR ||============================== //

const EnhancedTableToolbar = ({ numSelected }: EnhancedTableToolbarProps) => (
    <Toolbar sx={{ p: 0, pl: 2, pr: 1, ...(numSelected > 0 && { color: 'secondary.main' }) }}>
        {numSelected > 0 ? (
            <Typography color="inherit" variant="h4">
                {numSelected} Selected
            </Typography>
        ) : (
            <Typography variant="h6" id="tableTitle">
                Nutrition
            </Typography>
        )}
        <Box sx={{ flexGrow: 1 }} />
        {numSelected > 0 && (
            <Tooltip title="Delete">
                <IconButton size="large">
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        )}
    </Toolbar>
);

interface ProEnhancedTableHeadProps extends EnhancedTableHeadProps {
    selected: string[];
}

// ==============================|| LEAD - TABLE HEADER ||============================== //

function LeadTableHeader({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, selected }: ProEnhancedTableHeadProps) {
    const createSortHandler = (property: string) => (event: React.SyntheticEvent<Element, Event>) => {
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
                            'aria-label': 'select all desserts'
                        }}
                    />
                </TableCell>
                {numSelected > 0 && (
                    <TableCell padding="none" colSpan={12}>
                        <EnhancedTableToolbar numSelected={selected.length} />
                    </TableCell>
                )}
                {numSelected <= 0 &&
                    headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.align}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Typography component="span" sx={{ display: 'none' }}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Typography>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                {numSelected <= 0 && <TableCell sortDirection={false} align="center" sx={{ pr: 3 }}></TableCell>}
            </TableRow>
        </TableHead>
    );
}

export default LeadTableHeader;
