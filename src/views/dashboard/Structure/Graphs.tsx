import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { gridSpacing } from 'store/constant';
import GraphA from './Graph';
import MainCard from 'ui-component/cards/MainCard';
import { CircularProgress } from '@mui/material';

export interface Node {
  id: number;
  label: string;
  title?: string;
}

export interface Edge {
  from: number;
  to: number;
  arrows: 'to' | 'middle' | 'from' | 'none' | 'to, from';
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

interface GraphsProps {
  graphData: GraphData | null;
}

const Graphs: React.FC<GraphsProps> = ({ graphData }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (graphData) {
      setLoading(false);
    }
  }, [graphData]);

  const reverseEdges = (edges: Edge[]): Edge[] => {
    return edges.map(edge => ({ from: edge.to, to: edge.from, arrows: edge.arrows }));
  };

  return (
    <Grid container spacing={gridSpacing}>
      {loading ? (
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <CircularProgress aria-label="progress" />
        </Grid>
      ) : (graphData && (
        <>
          <Grid item xs={12} md={6}>
            <MainCard title="Follow Connections">
              <GraphA nodes={graphData.nodes} edges={graphData.edges} />
            </MainCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <MainCard title="Followed By Connections">
              <GraphA nodes={graphData.nodes} edges={reverseEdges(graphData.edges)} />
            </MainCard>
          </Grid>
        </>)
      )}
    </Grid>
  );
};

export default Graphs;
