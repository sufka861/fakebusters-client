import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import ReportCards from '../Analytics/ReportCard';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import axios from 'axios';
import PrevResults from './PrevResults'; // Import the new component
import { GraphData } from '../Structure/Graph';
import { AdjData } from '../Structure/AdjMatrix';
import { NodeUser } from '../Structure/NodeTable';



const ResultsGraphs = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state || {}; // Fallback to empty object if no state is passed

    const [userProjects, setUserProjects] = useState([]);
    const [selectedProjectData, setSelectedProjectData] = useState(null);
    const [projectDetails, setProjectDetails] = useState([]);
    const [filter, setFilter] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
    const [graphData, setGraphData] = useState<GraphData | null>(null);
    const [adjData, setAdjData] = useState<AdjData | null>(null); 
    const [stats,setStats] = useState< NodeUser[] | null>(null)

    const userId = '6650be951fdcf7cb4e278258'; // TODO: Replace with dynamic user ID

    useEffect(() => {
        fetchUserProjects();
    }, []);

    useEffect(() => {
        if (userProjects.length > 0) {
            fetchProjectDetails();
        }
    }, [userProjects]);

    useEffect(() => {
        if (selectedProjectData) {
            const { nodes, edges,adj_results,stats  } = selectedProjectData;
            const combinedData = {
                nodes: nodes,
                edges:  edges,
            };
            const adjMatrixData = {cosine_similarity:adj_results}
            setGraphData(combinedData)
            setAdjData(adjMatrixData)
            setStats(stats)
        }
    }, [selectedProjectData]);
    

    const fetchUserProjects = async () => {
        try {
            const response = await axios.get(`https://fakebusters-server.onrender.com/api/users/${userId}`);
            const user = response.data[0];
            setUserProjects(user.graph_id);
        } catch (error) {
            console.error('Error fetching user projects:', error);
        }
    };

    const fetchProjectDetails = async () => {
        try {
            const details = await Promise.all(
                userProjects.map(async (project) => {
                    const response = await axios.get(`https://fakebusters-server.onrender.com/api/graphs/${project}`);
                    const data = response.data;
                    return {
                        _id: data._id,
                        project_name: data.project_name,
                        date_created: data.date_created,
                        file_name: data.file_name,
                    };
                })
            );
            setProjectDetails(details);
        } catch (error) {
            console.error('Error fetching project details:', error);
        }
    };

    const fetchProjectData = async (_id:any) => {
        try {
            const response = await axios.get(`https://fakebusters-server.onrender.com/api/graphs/${_id}`);
            setSelectedProjectData(response.data);
        } catch (error) {
            console.error('Error fetching project data:', error);
        }
    };
    
    const handleFilterChange = (event:any) => {
        setFilter(event.target.value.toLowerCase());
    };

    const filteredProjects = projectDetails.filter((project) => {
        return Object.values(project).some((value) => String(value).toLowerCase().includes(filter));
    });

    const handleSort = (key:any) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedProjects = filteredProjects.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

   
        return (
            <PrevResults
                navigate={navigate}
                filter={filter}
                handleFilterChange={handleFilterChange}
                sortedProjects={sortedProjects}
                sortConfig={sortConfig}
                handleSort={handleSort}
                fetchProjectData={fetchProjectData}
                selectedProjectData={selectedProjectData}
                graphData={graphData}
                adjData={adjData}
                stats={stats}
            />
        );
    
};

export default ResultsGraphs;
