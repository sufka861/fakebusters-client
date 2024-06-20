import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import ResultsLPA from './ResultsLPA';
import { gridSpacing } from 'store/constant';

const PrevResults = ({
    navigate,
    filter,
    handleFilterChange,
    sortedProjects,
    sortConfig,
    handleSort,
    fetchProjectData,
    selectedProjectData,
    userProjects
}) => {
    return (
        <Grid justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                    <MainCard title="Previous Results">
                        {userProjects.length <= 0 ? (
                            <div>
                                <Typography variant="h4" align="center">
                                    No Results Available
                                </Typography>
                                <Box textAlign="center" mt={2}>
                                    <Button variant="contained" color="secondary" onClick={() => navigate('/dashboard/analytics')}>
                                        NEW ANALYSIS
                                    </Button>
                                </Box>
                            </div>
                        ) : (
                            <Box textAlign="center" mt={2}>
                                <TextField
                                    label="Search"
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
                                {sortedProjects.length > 0 ? (
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>
                                                        <TableSortLabel
                                                            active={sortConfig.key === 'project_name'}
                                                            direction={sortConfig.direction}
                                                            onClick={() => handleSort('project_name')}
                                                        >
                                                            Project Name
                                                        </TableSortLabel>
                                                    </TableCell>
                                                    <TableCell>
                                                        <TableSortLabel
                                                            active={sortConfig.key === 'date_created'}
                                                            direction={sortConfig.direction}
                                                            onClick={() => handleSort('date_created')}
                                                        >
                                                            Date Created
                                                        </TableSortLabel>
                                                    </TableCell>
                                                    <TableCell>
                                                        <TableSortLabel
                                                            active={sortConfig.key === 'file_id'}
                                                            direction={sortConfig.direction}
                                                            onClick={() => handleSort('file_id')}
                                                        >
                                                            Dataset
                                                        </TableSortLabel>
                                                    </TableCell>
                                                    <TableCell>Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {sortedProjects.map((project) => (
                                                    <TableRow
                                                        key={project.file_id}
                                                        sx={{
                                                            '&:hover': {
                                                                backgroundColor: '#f5f5f5'
                                                            }
                                                        }}
                                                    >
                                                        <TableCell>{project.project_name}</TableCell>
                                                        <TableCell>{new Date(project.date_created).toLocaleString()}</TableCell>
                                                        <TableCell>{project.file_id}</TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="outlined"
                                                                color="primary"
                                                                onClick={() => fetchProjectData(project.file_id)}
                                                            >
                                                                Load
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Typography variant="body1" align="center">
                                        No previous results available.
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </MainCard>
                </Box>
                </Grid>
                {selectedProjectData && (
                    <Grid item xs={12}>
                        <MainCard title={selectedProjectData.project_name}>
                            <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                                <ResultsLPA resultsLPA={selectedProjectData.LPA_results} fileName={selectedProjectData.file_id} />
                            </Box>
                        </MainCard>
                    </Grid>
                )}
            </Grid>
    );
};

export default PrevResults;
