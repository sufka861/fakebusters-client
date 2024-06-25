import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import axios from 'axios';
// project import
import useConfig from 'hooks/useConfig';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';

// components
import FileUploadStructure from './upload';
import Graphs from './Graphs';
import Statistics from './Statistics';
// types
import { ThemeMode } from 'types/config';
import { NodeUser } from './NodeTable';
import AdjMatrix, { AdjData } from './AdjMatrix';
import Features from './Features';
import { CosData } from './CosineMatrix';

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

// ==============================|| LEAD SUMMARY - CHART ||============================== //

const LeadSummary = ({ isLoading }: { isLoading: boolean }) => {
    const theme = useTheme();
    const { mode } = useConfig();
    const [selected, setSelected] = useState<string[]>([]);
    const [cosineSimilarityData, setCosineSimilarityData] = useState<CosData>({ similarity_list: [] });
    const [showResults, setShowResults] = useState<boolean>(false);
    const [tabValue, setTabValue] = useState(0);
    const [graphData, setGraphData] = useState(null);
    const [nodes, setNodes] = useState<NodeUser[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [adj, setAdj] = useState<AdjData | null>(null);
    const [project_id, setProject_id] = useState(null);
    //const [fileName, setfileName] = useState("");
    const [userid, setUserid] = useState('6650be951fdcf7cb4e278258');

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleFileUploadSuccess = (data: any) => {
        setGraphData(data);
        setTabValue(0);
        setProject_id(data._id);
        // setFileName(data.fileName)
    };

    const handleSelectChange = (selected: string[]) => {
        setSelected(selected);
    };

    const handleCosineSimilarityData = (data: CosData) => {
        setCosineSimilarityData(data);
        setShowResults(true);
    };

    useEffect(() => {
        if (graphData) {
            fetch('https://graphs-analysis.onrender.com/stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(graphData) // Send graphData here
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    setNodes(data);
                    setError(null); // Clear any previous errors
                })
                .catch((error) => {
                    console.error('Error fetching node data:', error);
                    setError(error.message);
                });
        }
    }, [graphData]);

    useEffect(() => {
        if (graphData) {
            fetch('https://graphs-analysis.onrender.com/adjacency', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(graphData)
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data: AdjData) => {
                    setAdj(data);

                    setError(null); // Clear any previous errors
                })
                .catch((error) => {
                    console.error('Error fetching node data:', error);
                    setError(error.message); // Set error state
                });
        }
    }, [graphData]);

    useEffect(() => {
        if (adj && project_id && nodes) {
            updateGraphDoc(adj, project_id, nodes);
            updateGraphsInUser(project_id);
        }
    }, [adj, project_id, nodes]);

    const updateGraphDoc = async (adj, project_id, nodes) => {
        try {
            const url = `https://fakebusters-server.onrender.com/api/graphs/${project_id}`;
            await axios.put(
                url,
                { adj_results: adj.cosine_similarity, stats: nodes },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        } catch (error) {
            console.error('Error updating adj matrix data in project:', error);
        }
    };

    const updateGraphsInUser = async (project_id) => {
        try {
            const url = `https://fakebusters-server.onrender.com/api/users/${userid}`;
            const response = await axios.get(url);
            const user = response.data[0];
            if (user && !user.graph_id.includes(project_id)) {
                const updatedProjectId = [...user.graph_id, project_id];
                await axios.put(
                    url,
                    { graph_id: updatedProjectId },
                    {
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            }
        } catch (error) {
            console.error('Error updating user project ID:', error);
        }
    };

    return (
        <>
            <FileUploadStructure onUploadSuccess={handleFileUploadSuccess} />
            {graphData && (
                <MainCard content={false}>
                    <Box sx={{ p: 3 }}>
                        <Grid container spacing={gridSpacing} rowSpacing={2.5}>
                            <Grid item xs={12}>
                                <Typography variant="h4">Network Analysis Results</Typography>
                            </Grid>
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
                                        {tabValue === 1 && <Statistics nodes={nodes} error={error} />}
                                        {tabValue === 2 && (
                                            <Features
                                                graphData={graphData}
                                                selected={selected} // Pass selected state
                                                setSelected={handleSelectChange} // Pass function to update selected state
                                                cosineSimilarityData={cosineSimilarityData} // Pass cosineSimilarityData state
                                                setCosineSimilarityData={handleCosineSimilarityData} // Pass function to update cosineSimilarityData state
                                                showResults={showResults} // Pass showResults state
                                                setShowResults={setShowResults}
                                            />
                                        )}
                                        {tabValue === 3 && adj && <AdjMatrix adjData={adj} />}
                                    </Stack>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </MainCard>
            )}
        </>
    );
};

export default LeadSummary;
