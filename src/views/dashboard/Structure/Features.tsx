import React, { useState } from "react";
import { EnhancedTableHead, EnhancedTableToolbar, getComparator, rows, stableSort } from "./FeaturesTable";
import { ArrangementOrder } from "types";
import MainCard from "ui-component/cards/MainCard";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Checkbox } from "@mui/material";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CosineMatrix, { CosData } from "./CosineMatrix"; // Import the CosineMatrix component

export interface FeaturesProps {
    graphData: any;
    selected: string[];
    setSelected: (selected: string[]) => void;
    cosineSimilarityData: CosData; 
    setCosineSimilarityData: (data: CosData) => void; 
    showResults: boolean;
    setShowResults: (show: boolean) => void;
}



export default function Features({ graphData, selected, setSelected, cosineSimilarityData, setCosineSimilarityData, showResults, setShowResults }: FeaturesProps) {
    // Your component code
    const [order, setOrder] = useState<ArrangementOrder>('asc');
    const [orderBy, setOrderBy] = useState('feature');
    // const [selected, setSelected] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [dense] = useState(true);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    // const [cosineSimilarityData, setCosineSimilarityData] = useState<CosData>({ similarity_list: [] });
    // const [showResults, setShowResults] = useState<boolean>(false);

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
        setSelected(newSelected);
    };
    

    const handleSubmit = async () => {
        const selectedFeaturesFormat = selected.map((feature) => feature.toLowerCase().replace(/\s+/g, '_'));
        setSelectedFeatures(selectedFeaturesFormat);
        try {
            const response = await fetch('http://127.0.0.1:5000/similarity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ graphData: graphData, selected_features: selectedFeaturesFormat }), // Pass selectedFeaturesFormat instead of selectedFeatures
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Success:', data);
            setCosineSimilarityData(data); // Set cosineSimilarityData with the received similarity data
            setShowResults(true); // Show the results
        } catch (error) {
            console.error('Error submitting features:', error);
        }
    };

    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <MainCard content={false}>
            <EnhancedTableToolbar numSelected={selected.length} selected={selected} />

            {/* table */}
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

            {/* Display the CosineMatrix component when showResults is true */}
            {showResults && (
                <CosineMatrix cosData={cosineSimilarityData} />
            )}
        </MainCard>
    );
}
