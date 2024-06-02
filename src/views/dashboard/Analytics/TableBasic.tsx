import React from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { CSVExport } from '../../forms/tables/TableExports';

export const header = [
    { label: 'Word', key: 1 },
    { label: 'Frequency', key: 2 }
];

// ==============================|| TABLE - BASIC ||============================== //

export default function TableBasic({ rows, setRows, selectedRows, setSelectedRows, setVocabulary }) {
    const handleRowClick = (row) => {
        const alreadySelected = selectedRows.some(selectedRow => selectedRow.word === row.word);
        if (alreadySelected) {
            setSelectedRows((prev) => prev.filter((r) => r.word !== row.word));
            setRows((prev) => [...prev, row]);
        } else {
            setSelectedRows((prev) => [...prev, row]);
            setRows((prev) => prev.filter((r) => r.word !== row.word));
        }
    };

    const handleWordDelete = (word) => {
        setSelectedRows((prev) => {
            const removedRow = prev.find((row) => row.word === word);
            setRows((prevRows) => [...prevRows, removedRow]);
            return prev.filter((row) => row.word !== word);
        });
    };

    const handleClearSelection = () => {
        setRows((prevRows) => [...prevRows, ...selectedRows]);
        setSelectedRows([]);
    };

    const handleAddSelectedToTable = () => {
        setVocabulary((prev) => {
            const existingWords = new Set(prev.VocabularyWord.map(wordObj => wordObj.name));
            const newWords = selectedRows.filter(row => !existingWords.has(row.word)).map(row => ({ name: row.word }));
            return {
                ...prev,
                VocabularyWord: [...prev.VocabularyWord, ...newWords]
            };
        });
        setSelectedRows([]);
    };

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <MainCard
                    content={false}
                    title="The most common words in the file"
                    secondary={
                        <Stack direction="row" spacing={2} alignItems="center">
                            <CSVExport data={rows} filename={'basic-table.csv'} header={header} />
                        </Stack>
                    }
                >
                    {/* table */}
                    <TableContainer sx={{ maxHeight: 400 }}>
                        <Table stickyHeader sx={{ minWidth: 350 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ pl: 3 }}>Word</TableCell>
                                    <TableCell align="right" sx={{ pr: 3 }}>
                                        Frequency
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow hover key={row.word} onClick={() => handleRowClick(row)}>
                                        <TableCell sx={{ pl: 3 }} component="th" scope="row">
                                            {row.word}
                                        </TableCell>
                                        <TableCell sx={{ pr: 3 }} align="right">
                                            {row.frequency}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </MainCard>
            </Grid>

            <Grid item xs={12}>
                <MainCard
                    content={false}
                    title="Selected Words"
                    secondary={
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleAddSelectedToTable}>
                                Add to vocabulary
                            </Button>
                            <Button variant="contained" color="secondary" onClick={handleClearSelection}>
                                Clear Selection
                            </Button>
                        </Stack>
                    }
                >
                    {/* selected words list */}
                    <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 1, maxHeight: 400, overflow: 'auto' }}>
                        {selectedRows.map((row) => (
                            <Chip
                                key={row.word}
                                label={row.word}
                                onDelete={() => handleWordDelete(row.word)}
                                sx={{ m: 0.5 }}
                            />
                        ))}
                    </Box>
                </MainCard>
            </Grid>
        </Grid>
    );
}
