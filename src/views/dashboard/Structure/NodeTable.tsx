import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    IconButton, Stack, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Tooltip, InputAdornment, TextField, Collapse, Box, TableSortLabel, Select, MenuItem, Typography, Button
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { IconInfoCircleFilled } from '@tabler/icons-react';
import InfoIcon from '@mui/icons-material/Info';
import { CSVLink } from 'react-csv';
import { CSVExport } from 'views/forms/tables/TableExports';

export interface NodeUser {
  id: number;
  label: string;
  title: string;
  degree_centrality: number;
  in_degree_centrality: number;
  out_degree_centrality: number;
  betweenness_centrality: number;
  closeness_centrality: number;
  clustering_coefficient: number;
  page_rank: number;
}

interface NodeTableProps {
  nodes: NodeUser[];
}

function NodeTable({ nodes }: NodeTableProps) {
  const theme = useTheme();
  const [sortConfig, setSortConfig] = useState<{ key: keyof NodeUser; direction: 'asc' | 'desc' } | null>(null);
  const [filter, setFilter] = useState<string>('');

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value.toLowerCase());
  };

  const filteredData = nodes.filter((item) =>
    Object.values(item).some(val => String(val).toLowerCase().includes(filter))
  );

  const sortedData = React.useMemo(() => {
    if (sortConfig !== null) {
        return [...filteredData].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }
    return filteredData;
  }, [filteredData, sortConfig]);

  const requestSort = (key: keyof NodeUser) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // CSV headers
  const headers = [
    { label: "Username", key: "label" },
    { label: "Degree Centrality", key: "degree_centrality" },
    { label: "In Degree Centrality", key: "in_degree_centrality" },
    { label: "Out Degree Centrality", key: "out_degree_centrality" },
    { label: "Betweenness Centrality", key: "betweenness_centrality" },
    { label: "Closeness Centrality", key: "closeness_centrality" },
    { label: "Clustering Coefficient", key: "clustering_coefficient" },
    { label: "PageRank", key: "page_rank" },
  ];

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <TextField
          variant="outlined"
          placeholder="Filter results..."
          margin="normal"
          onChange={handleFilterChange}
          InputProps={{
              startAdornment: (
                  <InputAdornment position="start">
                      <SearchIcon />
                  </InputAdornment>
              ),
          }}
        />
            <CSVExport data={sortedData} filename={'nodes-analysis.csv'} header={headers} />
      </Stack>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => requestSort('label')}>
                <TableSortLabel active={sortConfig?.key === 'label'} direction={sortConfig?.direction}>
                  Username
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => requestSort('degree_centrality')}>
              <Tooltip title="Total number of connections a profile has (followers and following)">
                <TableSortLabel active={sortConfig?.key === 'degree_centrality'} direction={sortConfig?.direction}>
                  Degree Centrality
                </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell onClick={() => requestSort('in_degree_centrality')}>
              <Tooltip title="Number followers the profile has (popularity)">
                <TableSortLabel active={sortConfig?.key === 'in_degree_centrality'} direction={sortConfig?.direction}>
                  In Degree Centrality
                </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell onClick={() => requestSort('out_degree_centrality')}>
              <Tooltip title="Number of profiles a profile follows">
                <TableSortLabel active={sortConfig?.key === 'out_degree_centrality'} direction={sortConfig?.direction}>
                  Out-Degree Centrality
                </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell onClick={() => requestSort('betweenness_centrality')}>
              <Tooltip title="Profile's influence on communication between others, how often profile is between information flow">
                <TableSortLabel active={sortConfig?.key === 'betweenness_centrality'} direction={sortConfig?.direction}>
                  Betweenness Centrality
                </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell onClick={() => requestSort('closeness_centrality')}>
              <Tooltip title="Average distance (shortest path) to all other profiles, measuring the efficiency of spreading information through a graph">
                <TableSortLabel active={sortConfig?.key === 'closeness_centrality'} direction={sortConfig?.direction}>
                  Closeness Centrality
                </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell onClick={() => requestSort('clustering_coefficient')}>
              <Tooltip title="How well a profile's followers are connected to each other (community)">
                <TableSortLabel active={sortConfig?.key === 'clustering_coefficient'} direction={sortConfig?.direction}>
                  Clustering Coefficient
                </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell onClick={() => requestSort('page_rank')}>
              <Tooltip title="Importance of a profile based on incoming links from important profiles">
                <TableSortLabel active={sortConfig?.key === 'page_rank'} direction={sortConfig?.direction}>
                  PageRank
                </TableSortLabel>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((node) => (
              <TableRow key={node.id}>
                <TableCell>{node.label}</TableCell>
                <TableCell>{node.degree_centrality}</TableCell>
                <TableCell>{node.in_degree_centrality}</TableCell>
                <TableCell>{node.out_degree_centrality}</TableCell>
                <TableCell>{node.betweenness_centrality}</TableCell>
                <TableCell>{node.closeness_centrality}</TableCell>
                {/* <TableCell>{node.eigen_centrality}</TableCell> */}
                <TableCell>{node.clustering_coefficient}</TableCell>
                <TableCell>{node.page_rank}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default NodeTable;
