import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableSortLabel from '@mui/material/TableSortLabel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { visuallyHidden } from '@mui/utils';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { CSVExport } from '../../forms/tables/TableExports';
import { header } from './TableBasic';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

// table data
type CreateDataType = {
    name: string;
    id?: string;
    date_created?: string;
    createdBy?: string;
    terms?: string[];
};

function createData(name: string, id: string, date_created: string, terms?: string[]): CreateDataType {
    return { name, id, date_created, terms };
}

// table filter
function descendingComparator(a: CreateDataType, b: CreateDataType, orderBy: string) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

const getComparator = (order: 'asc' | 'desc', orderBy: string) =>
    order === 'desc'
        ? (a: CreateDataType, b: CreateDataType) => descendingComparator(a, b, orderBy)
        : (a: CreateDataType, b: CreateDataType) => -descendingComparator(a, b, orderBy);

function stableSort(array: CreateDataType[], comparator: (a: CreateDataType, b: CreateDataType) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [CreateDataType, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// table header
const headCells = [
    {
        id: 'name',
        numeric: false,
        label: 'Name'
    }
];

// ==============================|| TABLE - HEADER ||============================== //

interface TableDataEnhancedTableHeadProps {
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: 'asc' | 'desc';
    orderBy: string;
    numSelected: number;
    rowCount: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
}

function EnhancedTableHead(props: TableDataEnhancedTableHeadProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
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
                            'aria-label': 'select all words'
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding="normal"
                        sortDirection={props.orderBy === headCell.id ? props.order : false}
                    >
                        <TableSortLabel
                            active={props.orderBy === headCell.id}
                            direction={props.orderBy === headCell.id ? props.order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {props.orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {props.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

// ==============================|| TABLE - HEADER TOOLBAR ||============================== //

const EnhancedTableToolbar = ({ numSelected, onDelete, title }: { numSelected: number, onDelete: () => void, title: string }) => (
    <Toolbar
        sx={{
            p: 0,
            pl: 1,
            pr: 1,
            ...(numSelected > 0 && {
                color: (theme) => theme.palette.secondary.main
            })
        }}
    >
        {numSelected > 0 ? (
            <Typography color="inherit" variant="subtitle1">
                {numSelected} selected
            </Typography>
        ) : (
            <Typography variant="h6" id="tableTitle">
                {title}
            </Typography>
        )}
        <Box sx={{ flexGrow: 1 }} />
        {numSelected > 0 && (
            <Tooltip title="Delete">
                <IconButton size="large" onClick={onDelete}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        )}
    </Toolbar>
);

// ==============================|| TABLE - DATA TABLE ||============================== //

interface EnhancedTableProps {
    vocabulary: CreateDataType[];
    onDelete: (namesToDelete: string[]) => void;
    onAddRow: (newWord: string) => void;
    setVocabulary: (newWord: string) => void;
}

export default function EnhancedTable({ vocabulary, onDelete, onAddRow, setVocabulary }: EnhancedTableProps) {
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<string>('name');
    const [selected, setSelected] = useState<string[]>([]);
    const [rows, setRows] = useState<CreateDataType[]>([]);
    const [dense] = useState(false);
    const [selectedValue, setSelectedValue] = useState<CreateDataType[]>([]);
    const [open, setOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [vocabularies, setVocabularies] = useState<CreateDataType[]>([]);
    const [selectedVocabId, setSelectedVocabId] = useState<string | null>(null);
    const [vocabName, setVocabName] = useState<string>('');
    const [isDefault, setIsDefault] = useState<boolean>(false);
    const [tableTitle, setTableTitle] = useState<string>('Vocabulary');

    useEffect(() => {
        if (vocabulary) {
            setRows(vocabulary);
        }
    }, [vocabulary]);

    const handleRequestSort = (event: React.SyntheticEvent, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelectedId: string[] = rows.map((n) => n.name);
            setSelected(newSelectedId);
            setSelectedValue(rows);
            return;
        }
        setSelected([]);
        setSelectedValue([]);
    };

    const handleClick = (event: React.MouseEvent<HTMLTableRowElement> | undefined, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: string[] = [];
        let newSelectedValue: CreateDataType[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
            newSelectedValue = newSelectedValue.concat(selectedValue, rows.find((row) => row.name === name)!);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
            newSelectedValue = newSelectedValue.concat(selectedValue.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
            newSelectedValue = newSelectedValue.concat(selectedValue.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
            newSelectedValue = newSelectedValue.concat(
                selectedValue.slice(0, selectedIndex),
                selectedValue.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
        setSelectedValue(newSelectedValue);
    };

    const handleDelete = () => {
        onDelete(selected);
        setSelected([]);
        setSelectedValue([]);
    };

    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    const handleSaveChanges = async () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleDialogSubmit = async () => {
        const data = {
            terms: rows.map((row) => row.name),  // sending all words currently in the table as strings
            name: vocabName,
            is_default: isDefault,
            createdBy: '6650be951fdcf7cb4e278258'
        };
        try {
            const response = await axios.post('https://fakebusters-server.onrender.com/api/vocabularies/', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Save changes:', response.data);
        } catch (error) {
            console.error('Error saving changes:', error);
        }
        setDialogOpen(false);
    };

    const handleGetAllStopWords = async () => {
        try {
            const response = await axios.get('https://fakebusters-server.onrender.com/api/vocabularies/', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const vocabData = response.data.map((vocabulary: any) => createData(vocabulary.name, vocabulary._id, vocabulary.date_modified, vocabulary.terms));
            setVocabularies(vocabData);
            setOpen(true);
        } catch (error) {
            console.error('Error fetching vocabularies:', error);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleVocabClick = (id: string) => {
        setSelectedVocabId(id);
    };

    const handleSelect = () => {
        if (selectedVocabId) {
            console.log(vocabularies)
            const selectedVocabulary = vocabularies.find(vocab => vocab.id === selectedVocabId);

            if (selectedVocabulary && selectedVocabulary.terms) {
                // Update table rows with the selected vocabulary words
                const newRows = selectedVocabulary.terms.map((term: string) => createData(term, '', ''));
                setRows(newRows);

                // Update the table title with the selected vocabulary name
                setTableTitle(`Vocabulary - ${selectedVocabulary.name}`);
            }

            setOpen(false);
        }
    };

    return (
        <MainCard
            content={false}
            title={tableTitle}
            secondary={
                <Stack direction="row" spacing={2} alignItems="center">
                    <CSVExport data={selectedValue.length > 0 ? selectedValue : rows} filename={'data-tables.csv'} header={header} />
                </Stack>
            }
        >
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} onDelete={handleDelete} title={tableTitle} />

                {/* table */}
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                                const isItemSelected = isSelected(row.name);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.name)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.name}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox" sx={{ pl: 3 }}>
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell component="th" id={labelId} scope="row">
                                            {row.name}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Stack direction="row" spacing={2}>
                    <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                        Create Stop Words
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleGetAllStopWords}>
                        Get Stop Words
                    </Button>
                </Stack>
            </Paper>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Vocabularies</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={selectedVocabId !== null}
                                            checked={selectedVocabId !== null}
                                            inputProps={{
                                                'aria-label': 'select all vocabularies'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Date Created</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {vocabularies.map((vocabulary, index) => (
                                    <TableRow
                                        key={index}
                                        onClick={() => handleVocabClick(vocabulary.id!)}
                                        selected={selectedVocabId === vocabulary.id}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedVocabId === vocabulary.id}
                                                inputProps={{
                                                    'aria-labelledby': `vocabulary-${index}`
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell id={`vocabulary-${index}`}>{vocabulary.name}</TableCell>
                                        <TableCell>{vocabulary.date_created}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                    <Button onClick={handleSelect} color="primary">
                        Select
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Create Stop Words</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Vocabulary Name"
                        type="text"
                        fullWidth
                        value={vocabName}
                        onChange={(e) => setVocabName(e.target.value)}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <Checkbox
                            checked={isDefault}
                            onChange={(e) => setIsDefault(e.target.checked)}
                            inputProps={{ 'aria-label': 'Is Default' }}
                        />
                        <Typography variant="body2">Set as Default</Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDialogSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </MainCard>
    );
}
