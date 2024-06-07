import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, InputAdornment, TextField, TableSortLabel, Select, MenuItem, Typography, Button
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { CSVLink } from 'react-csv';
import { CSVExport } from 'views/forms/tables/TableExports';



interface CosineSimilarityRow {
    node1: string;
    node2: string;
    similarity: number;
}

export const headers = [
    { label: 'Profile - 1', key: 'node1' },
    { label: 'Profile - 2', key: 'node2' },
    { label: 'Cosine Similarity', key: 'similarity' }
];

// Define the interface for the adjData parameter
export interface AdjData {
    cosine_similarity: CosineSimilarityRow[];
}

function AdjMatrix({ adjData }: { adjData: AdjData }) {
const rows = adjData.cosine_similarity;
  const theme = useTheme();
  const [sortConfig, setSortConfig] = useState<{ key: keyof CosineSimilarityRow; direction: 'asc' | 'desc' } | null>(null);
  const [filter, setFilter] = useState<string>('');

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
            <CSVExport data={sortedData} filename={'Cosine-Similarity-adjacency.csv'} header={headers} />
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
              <Tooltip title="Cosine Similarity based on adjacency matrix - community">
                <TableSortLabel active={sortConfig?.key === 'similarity'} direction={sortConfig?.direction}>
                Cosine Similarity
                </TableSortLabel>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((node) => (
              <TableRow>
                <TableCell>{node.node1}</TableCell>
                <TableCell>{node.node2}</TableCell>
                <TableCell>{node.similarity.toFixed(5)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default AdjMatrix;
