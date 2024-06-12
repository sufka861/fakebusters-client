import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box,Collapse,Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, InputAdornment, TextField, TableSortLabel, Select, MenuItem, Typography, Button, IconButton
} from '@mui/material';
import { Search as SearchIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { CSVLink } from 'react-csv';
import { CSVExport } from 'views/forms/tables/TableExports';
import { ProfileDataTable } from '../Results/ProfileDataTable';


export interface CosineSimilarityRow {
    node1: string;
    node2: string;
    similarity: number;
}

// Define the interface for the adjData parameter
export interface CosData {
  similarity_list: CosineSimilarityRow[];
}

export const headers = [
    { label: 'Profile - 1', key: 'node1' },
    { label: 'Profile - 2', key: 'node2' },
    { label: 'Cosine Similarity', key: 'similarity' }
];



function CosineMatrix({ cosData }: { cosData: CosData }) {
  const rows = cosData.similarity_list;
  const theme = useTheme();
  const [sortConfig, setSortConfig] = useState<{ key: keyof CosineSimilarityRow; direction: 'asc' | 'desc' } | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [expandedRow, setExpandedRow] = useState<number | null>(null); 

  const handleRowClick = (index:number) => {
    if (expandedRow === index) {
      setExpandedRow(null);
  } else {
      setExpandedRow(index);
  }
};

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value.toLowerCase());
  };

  const filteredData = rows.filter((item) =>
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

  const requestSort = (key: keyof CosineSimilarityRow) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
    }
    setSortConfig({ key, direction });
  };


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
            <CSVExport data={sortedData} filename={'Cosine-Similarity-features.csv'} header={headers} />
      </Stack>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => requestSort('node1')}>
                <TableSortLabel active={sortConfig?.key === 'node1'} direction={sortConfig?.direction}>
                  Profile - 1
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => requestSort('node2')}>
                <TableSortLabel active={sortConfig?.key === 'node2'} direction={sortConfig?.direction}>
                Profile - 2
                </TableSortLabel>
              </TableCell>
              <TableCell onClick={() => requestSort('similarity')}>
              <Tooltip title="Cosine Similarity based on netwrok features matrix">
                <TableSortLabel active={sortConfig?.key === 'similarity'} direction={sortConfig?.direction}>
                Cosine Similarity
                </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell>Expand</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((node, index) => (
            <React.Fragment key={index}>
              <TableRow hover onClick={() => handleRowClick(index)}>
                <TableCell>{node.node1}</TableCell>
                <TableCell>{node.node2}</TableCell>
                <TableCell>{node.similarity.toFixed(10)}</TableCell>
                <TableCell>
                  <IconButton>{expandedRow === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
                </TableCell>
              </TableRow>
              {expandedRow === index && (
                <TableRow>
                  <TableCell style={{ padding: 0 }} colSpan={4}>
                    <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                      <Box margin={1} display="flex">
                        <Box flex={1}>
                          <Typography variant="h6" gutterBottom component="div">
                            Profile Data for {node.node1}
                          </Typography>
                          <ProfileDataTable username={node.node1} />
                        </Box>
                        <Box flex={1}>
                          <Typography variant="h6" gutterBottom component="div">
                            Profile Data for {node.node2}
                          </Typography>
                          <ProfileDataTable username={node.node2} />
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
    </>
  );
}

export default CosineMatrix;
