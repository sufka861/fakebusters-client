import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, InputAdornment, Stack, Tabs, Button } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { ThemeMode } from 'types/config';
import { Link } from 'react-router-dom';
import Statistics from '../Structure/Statistics';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import Graphs from '../Structure/Graphs';
import { NodeUser } from '../Structure/NodeTable';
import AdjMatrix, { AdjData } from '../Structure/AdjMatrix';
import Features from '../Structure/Features';
import { CosData } from '../Structure/CosineMatrix';

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

const PrevResults = ({
    navigate,
    filter,
    handleFilterChange,
    sortedProjects,
    sortConfig,
    handleSort,
    fetchProjectData,
    selectedProjectData,
    graphData,
    adjData,
    stats
}) => {
    const [tabValue, setTabValue] = useState(0);
    console.log(stats)
    const theme = useTheme();
    const [cosineSimilarityData, setCosineSimilarityData] = useState<CosData>({ similarity_list: [] })
    const [selected, setSelected] = useState<string[]>([]); 
    const [showResults, setShowResults] = useState<boolean>(false);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };
    const handleSelectChange = (selected: string[]) => {
        setSelected(selected);
    };
    const handleCosineSimilarityData = (data: CosData) => { 
        setCosineSimilarityData(data);
        setShowResults(true);
    };
    
    return (
        <Grid justifyContent="center" >
            <MainCard sx={{ mb:2 }}>
            <Grid item xs={12}>
            
                <Box textAlign="center" >
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
                                                File Name
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortedProjects.map((project) => (
                                        <TableRow
                                            key={project._id}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: '#f5f5f5'
                                                }
                                            }}
                                        >
                                            <TableCell>{project.project_name}</TableCell>
                                            <TableCell>{new Date(project.date_created).toLocaleString()}</TableCell>
                                            <TableCell>{project.file_name}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() => fetchProjectData(project._id)}
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
            </Grid>
            </MainCard>
           
            {selectedProjectData && (
                <Grid item xs={12}>
                    <MainCard title={selectedProjectData.project_name}>
                    <Grid item xs={12}>
                            <Tabs
                                value={tabValue}
                                variant="scrollable"
                                onChange={handleChange}
                                sx={{
                                    '& a': {
                                        minHeight: 'auto',
                                        minWidth: 10,
                                        py: 1.5,
                                        px: 1,
                                        mr: 2.2,
                                        color: theme.palette.mode === ThemeMode.DARK ? 'grey.600' : 'grey.900',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    },
                                    '& a.Mui-selected': {
                                        color: 'primary.main'
                                    },
                                    '& a > svg': {
                                        mb: '0px !important',
                                        mr: 1.1
                                    }
                                }}
                            >
                                <Tab
                                    component={Link}
                                    to="#"
                                    label="Networks"
                                    {...a11yProps(0)}
                                    icon={<TimelineOutlinedIcon sx={{ fontSize: '1.3rem' }} />}
                                />
                                <Tab
                                    component={Link}
                                    to="#"
                                    label="Nodes Analysis"
                                    {...a11yProps(1)}
                                    icon={<PersonOutlinedIcon sx={{ fontSize: '1.3rem' }} />}
                                />
                                <Tab
                                    component={Link}
                                    to="#"
                                    label="Cosine Similarity"
                                    {...a11yProps(2)}
                                    icon={<CompareArrowsOutlinedIcon sx={{ fontSize: '1.3rem' }} />}
                                />
                                <Tab
                                    component={Link}
                                    to="#"
                                    label="Cosine Similarity - Adjacency"
                                    {...a11yProps(2)}
                                    icon={<CompareArrowsOutlinedIcon sx={{ fontSize: '1.3rem' }} />}
                                />
                    
                            </Tabs>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={1} justifyContent="space-between">
                                <Stack spacing={1}>
                                    {tabValue === 0 && graphData && <Graphs graphData={graphData} />}
                                    {tabValue === 1 && graphData && <Statistics nodes={stats} error={null} />}
                                    {tabValue === 2 && graphData && <Features graphData={graphData} selected={selected} // Pass selected state
                setSelected={handleSelectChange} // Pass function to update selected state
                cosineSimilarityData={cosineSimilarityData} // Pass cosineSimilarityData state
                setCosineSimilarityData={handleCosineSimilarityData} // Pass function to update cosineSimilarityData state
                showResults={showResults} // Pass showResults state
                setShowResults={setShowResults} />}
                                    {tabValue === 3 && adjData && <AdjMatrix adjData={adjData} />}
                                </Stack>
                            </Stack>
                        </Grid>
                        {/* <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                        <Graphs graphData={graphData} />
                        </Box> */}

                    </MainCard>
                </Grid>
            )}
        </Grid>
        
    );
    
};

export default PrevResults;
