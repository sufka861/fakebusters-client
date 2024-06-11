import React from 'react';
// material-ui
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// project imports
import Chip from 'ui-component/extended/Chip';

// assets
import Avatar1 from 'assets/images/users/avatar-1.png';
import Avatar2 from 'assets/images/users/avatar-2.png';
import Avatar3 from 'assets/images/users/avatar-3.png';
import Avatar4 from 'assets/images/users/avatar-4.png';

// table data
const createData = (
    avtar: string,
    name: string,
    designation: string,
    product: string,
    date: string,
    score: number
) => ({ avtar, name, designation, product, date, score });

const rows = [
    createData(Avatar1, 'John Deo', 'Graphics Designer', 'Materially', 'Jun, 26', 3),
    createData(Avatar2, 'Jenifer Vintage', 'Web Designer', 'Mashable', 'March, 31', 5),
    createData(Avatar3, 'William Jem', 'Developer', 'Flatable', 'Aug, 02', 4),
    createData(Avatar4, 'David Jones', 'Developer', 'Guruable', 'Sep, 22', 5)
];

// ===========================|| DATA WIDGET - PROJECT TABLE CARD ||=========================== //

const ProjectTable = ({ filter }) => (
    <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell sx={{ pl: 3 }}>Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>Score</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.slice(0, filter).map((row, index) => (
                    <TableRow hover key={index}>
                        <TableCell sx={{ pl: 3 }}>
                            <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
                                <Grid item>
                                    <Avatar alt="User 1" src={row.avtar} />
                                </Grid>
                                <Grid item xs zeroMinWidth>
                                    <Typography variant="subtitle1">{row.name}</Typography>
                                    <Typography variant="subtitle2">{row.designation}</Typography>
                                </Grid>
                            </Grid>
                        </TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell align="right" sx={{ pr: 3 }}>
                            {row.score}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

export default ProjectTable;
