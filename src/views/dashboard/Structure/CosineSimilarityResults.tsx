// CosineSimilarityResults.tsx

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { CSVExport } from '../../forms/tables/TableExports';

interface CosineSimilarityResultsProps {
  similarityData: { node1: number; node2: number; similarity: number }[];
  selectedFeatures: string[];
}

const CosineSimilarityResults = ({ similarityData, selectedFeatures }: CosineSimilarityResultsProps) => {
  return (
    <Paper>
       <CSVExport data={similarityData} filename={'cosine-similarity.csv'} />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Profile - 1</TableCell>
              <TableCell>Profile - 2</TableCell>
              <TableCell>Cosine Similarity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {similarityData.map((similarity, index) => (
              <TableRow key={index}>
                <TableCell>{similarity.node1}</TableCell>
                <TableCell>{similarity.node2}</TableCell>
                <TableCell>{similarity.similarity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CosineSimilarityResults;
