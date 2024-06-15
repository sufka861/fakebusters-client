import React from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Avatar, Grid, Typography } from '@mui/material';

const PairsResultsTableNetwork = ({ data = [] }) => {
    return (
        <Paper>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ pl: 3 }}>User 1</TableCell>
                        <TableCell sx={{ pl: 3 }}>User 2</TableCell>
                        <TableCell align="right">Similarity</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell sx={{ pl: 3 }}>
                                <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
                                    <Grid item>
                                        <Avatar alt={row.user1Name} src={row.user1Image} />
                                    </Grid>
                                    <Grid item xs zeroMinWidth>
                                        <Typography variant="subtitle1">{row.user1Name}</Typography>
                                        <Typography variant="subtitle2">{row.user1Status}</Typography>
                                    </Grid>
                                </Grid>
                            </TableCell>
                            <TableCell sx={{ pl: 3 }}>
                                <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
                                    <Grid item>
                                        <Avatar alt={row.user2Name} src={row.user2Image} />
                                    </Grid>
                                    <Grid item xs zeroMinWidth>
                                        <Typography variant="subtitle1">{row.user2Name}</Typography>
                                        <Typography variant="subtitle2">{row.user2Status}</Typography>
                                    </Grid>
                                </Grid>
                            </TableCell>
                            <TableCell align="right">{row.value.toFixed(4)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

PairsResultsTableNetwork.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            user1Name: PropTypes.string.isRequired,
            user1Image: PropTypes.string,
            user1Status: PropTypes.string.isRequired,
            user2Name: PropTypes.string.isRequired,
            user2Image: PropTypes.string,
            user2Status: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
        })
    )
};

export default PairsResultsTableNetwork;
