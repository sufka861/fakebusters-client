import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    InputAdornment,
    TextField,
    Collapse,
    Box,
    TableSortLabel,
    Select,
    MenuItem,
    Typography,
    Button,
    Alert
} from '@mui/material';
import { Search as SearchIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import axios from 'axios';
import { ProfileDataTable } from './ProfileDataTable';

type ResultLPA = {
    'Corpus 1': string;
    'Corpus 2': string;
    value: string;
    verifiedSelection?: string;
    comment?: string;
};

type ResultsLPAProps = {
    resultsLPA: ResultLPA[];
    fileName: string;
};

const ResultsLPA: React.FC<ResultsLPAProps> = ({ resultsLPA, fileName}) => {
    const theme = useTheme();
    const [filter, setFilter] = useState<string>('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof ResultLPA; direction: 'asc' | 'desc' } | null>(null);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [verifiedSelections, setVerifiedSelections] = useState<{ [key: number]: string }>({});
    const [comments, setComments] = useState<{ [key: number]: string }>({});
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loadedFromDB, setLoadedFromDB] = useState<boolean>(false);

    // const location = useLocation();
    // const state = location.state || {};
    // const { responseFerqData } = state;

    const loadFromDB = async () => {
        try {
            const url = `https://fakebusters-server.onrender.com/api/lpa/${fileName}`;
            const response = await axios.get(url);

            if (response.data.length !== 0) {
                const dataFromDB = response.data[0].LPA_results;
                const newVerifiedSelections: { [key: number]: string } = {};
                const newComments: { [key: number]: string } = {};

                dataFromDB.forEach((item: ResultLPA, index: number) => {
                    newVerifiedSelections[index] = item.verifiedSelection || 'Not Verified';
                    newComments[index] = item.comment || '';
                });

                setVerifiedSelections(newVerifiedSelections);
                setComments(newComments);
                setLoadedFromDB(true);
            }
        } catch (error) {
            console.error('Error loading data from DB:', error);
        }
    };

    useEffect(() => {
        if (!loadedFromDB) {
            loadFromDB();
        }
    }, [loadedFromDB]);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value.toLowerCase());
    };

    const filteredData = resultsLPA.filter((item) => Object.values(item).some((val) => String(val).toLowerCase().includes(filter)));

    const sortedData = React.useMemo(() => {
        if (sortConfig !== null) {
            return [...filteredData]
                .sort((a, b) => {
                    if (a[sortConfig.key] < b[sortConfig.key]) {
                        return sortConfig.direction === 'asc' ? -1 : 1;
                    }
                    if (a[sortConfig.key] > b[sortConfig.key]) {
                        return sortConfig.direction === 'asc' ? 1 : -1;
                    }
                    return 0;
                })
                .map((item, index) => ({
                    ...item,
                    verifiedSelection: verifiedSelections[index] || 'Not Verified',
                    comment: comments[index] || ''
                }));
        }
        return filteredData.map((item, index) => ({
            ...item,
            verifiedSelection: verifiedSelections[index] || 'Not Verified',
            comment: comments[index] || ''
        }));
    }, [filteredData, sortConfig, verifiedSelections, comments]);

    const requestSort = (key: keyof ResultLPA) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleRowClick = (index: number, username1: string, username2: string) => {
        if (expandedRow === index) {
            setExpandedRow(null);
        } else {
            setExpandedRow(index);
        }
    };

    const handleVerifiedChange = (index: number, value: string) => {
        setVerifiedSelections((prev) => ({ ...prev, [index]: value }));
    };

    const handleCommentChange = (index: number, value: string) => {
        setComments((prev) => ({ ...prev, [index]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const aggregatedData = sortedData.map((item, index) => ({
            ...item,
            verifiedSelection: verifiedSelections[index] || 'Not Verified',
            comment: comments[index] || ''
        }));

        try {
            const url = `https://fakebusters-server.onrender.com/api/lpa/${fileName}`;
            await axios.put(
                url,
                {
                    LPA_results: aggregatedData
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            setSuccessMessage('Data saved successfully.');
            setTimeout(() => {
                setSuccessMessage('');
            }, 5000);
            setErrorMessage(''); // Clear any previous error message
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error response:', error.response);
                setErrorMessage('Error saving data: ' + (error.response?.data.message || 'Unknown error.'));
            } else {
                console.error('Error saving data:', error);
                setErrorMessage('Error saving data.');
            }
            setSuccessMessage(''); // Clear any previous success message
        }
    };

    const submitData = async () => {
        const mockEvent = {
            preventDefault: () => {},
            currentTarget: document.createElement('form')
        } as React.FormEvent<HTMLFormElement>;
        await handleSubmit(mockEvent);
    };

    useEffect(() => {
        submitData();
    }, []);

    return (
        <div>
            <TextField
                label="Filter"
                value={filter}
                onChange={handleFilterChange}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    )
                }}
                fullWidth
                margin="normal"
            />
            <form onSubmit={handleSubmit}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {Object.keys(resultsLPA[0]).map((key) => (
                                    <TableCell key={key}>
                                        <TableSortLabel
                                            active={sortConfig?.key === key}
                                            direction={sortConfig?.direction}
                                            onClick={() => requestSort(key as keyof ResultLPA)}
                                        >
                                            {key}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                                <TableCell>Expand</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedData.map((item, index) => (
                                <React.Fragment key={index}>
                                    <TableRow hover onClick={() => handleRowClick(index, item['Corpus 1'], item['Corpus 2'])}>
                                        <TableCell>{item['Corpus 1']}</TableCell>
                                        <TableCell>{item['Corpus 2']}</TableCell>
                                        <TableCell>{item.value}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={verifiedSelections[index] || 'Not Verified'}
                                                onChange={(e) => handleVerifiedChange(index, e.target.value)}
                                            >
                                                <MenuItem value="Not Verified">Not Verified</MenuItem>
                                                <MenuItem value="Sockpuppet">Sockpuppet</MenuItem>
                                                <MenuItem value="Innocent">Innocent</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                value={comments[index] || ''}
                                                onChange={(e) => handleCommentChange(index, e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton>{expandedRow === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
                                        </TableCell>
                                    </TableRow>
                                    {expandedRow === index && (
                                        <TableRow>
                                            <TableCell style={{ padding: 0 }} colSpan={6}>
                                                <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                                                    <Box margin={1} display="flex">
                                                        <Box flex={1}>
                                                            <Typography variant="h6" gutterBottom component="div">
                                                                Profile Data for {item['Corpus 1']}
                                                            </Typography>
                                                            <ProfileDataTable username={item['Corpus 1']} />
                                                        </Box>
                                                        <Box flex={1}>
                                                            <Typography variant="h6" gutterBottom component="div">
                                                                Profile Data for {item['Corpus 2']}
                                                            </Typography>
                                                            <ProfileDataTable username={item['Corpus 2']} />
                                                        </Box>
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                    <Button type="submit" variant="contained" color="primary" sx={{ marginRight: 1 }}>
                        Submit
                    </Button>
                    {successMessage && <Alert severity="success">{successMessage}</Alert>}
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                </Box>
            </form>
        </div>
    );
};

export default ResultsLPA;
