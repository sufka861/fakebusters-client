import React, { useState } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';

// project imports
import { getUsersListStyle1 } from 'store/slices/user';

// assets
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import BlockTwoToneIcon from '@mui/icons-material/BlockTwoTone';
import { useDispatch } from 'react-redux';
import { TextField } from '@mui/material';

// types
// ==============================|| USER LIST 1 ||============================== //


const UserList = ({ resultsLPA }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [filter, setFilter] = useState('');

    React.useEffect(() => {
        dispatch(getUsersListStyle1());
    }, [dispatch]);

    const handleFilterChange = (event) => {
        setFilter(event.target.value.toLowerCase());
    };

    const filteredData = resultsLPA.filter((item) =>
        Object.values(item).some(val => 
            String(val).toLowerCase().includes(filter)
        )
    );

    return (
        <React.Fragment>
            <TextField
                variant="outlined"
                placeholder="Filter results..."
                margin="normal"
                fullWidth
                onChange={handleFilterChange}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ pl: 3 }}>#</TableCell>
                            <TableCell>Username 1</TableCell>
                            <TableCell>Username 2</TableCell>
                            <TableCell>Numeric Value 1</TableCell>
                            <TableCell>Numeric Value 2</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((row, index) => (
                            <TableRow hover key={index}>
                                <TableCell sx={{ pl: 3 }}>{index + 1}</TableCell>
                                <TableCell>{row.username1}</TableCell>
                                <TableCell>{row.username2}</TableCell>
                                <TableCell>{row.numericValue1}</TableCell>
                                <TableCell>{row.numericValue2}</TableCell>
                                <TableCell align="center" sx={{ pr: 3 }}>
                                    <Stack direction="row" justifyContent="center" alignItems="center">
                                        <Tooltip title="Message">
                                            <IconButton color="primary" aria-label="message" size="large">
                                                <ChatBubbleTwoToneIcon sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Block">
                                            <IconButton
                                                color="primary"
                                                sx={{
                                                    color: theme.palette.error.main,
                                                    '&:hover': { bgcolor: theme.palette.error.light }
                                                }}
                                                size="large"
                                            >
                                                <BlockTwoToneIcon sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    );
};

export default UserList;