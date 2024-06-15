import React from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Avatar, Grid, Typography } from '@mui/material';

const ProjectTable = ({ data = [] }) => {
    return (
        <Paper>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ pl: 3 }}>User</TableCell>
                        <TableCell align="right">Sockpuppet Potential (%)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell sx={{ pl: 3 }}>
                                <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
                                    <Grid item>
                                        <Avatar alt={row.name} src={row.image} />
                                    </Grid>
                                    <Grid item xs zeroMinWidth>
                                        <Typography variant="subtitle1">{row.name}</Typography>
                                        <Typography variant="subtitle2">{row.status}</Typography>
                                    </Grid>
                                </Grid>
                            </TableCell>
                            <TableCell align="right">{((1 - row.averageValue) * 100).toFixed(2)}%</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

ProjectTable.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            username: PropTypes.string.isRequired,
            image: PropTypes.string,
            averageValue: PropTypes.number.isRequired,
            status: PropTypes.string.isRequired
        })
    )
};

export default ProjectTable;
