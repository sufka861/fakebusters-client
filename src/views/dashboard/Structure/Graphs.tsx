// Graphs.tsx
import React from 'react';
import Grid from '@mui/material/Grid';
import { gridSpacing } from 'store/constant';
import GraphA from './Graph';
import MainCard from 'ui-component/cards/MainCard';

export interface Node {
  id: number;
  label: string;
  title?: string;
}

export interface Edge {
  from: number;
  to: number;
  arrows: 'to' | 'middle' | 'from' | 'none' | 'to, from'; // Ensure arrows property matches Graph.tsx
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

interface GraphsProps {
  graphData: GraphData;
}

const Graphs: React.FC<GraphsProps> = ({ graphData }) => {
  const reverseEdges = (edges: Edge[]): Edge[] => {
    return edges.map(edge => ({ from: edge.to, to: edge.from, arrows: edge.arrows }));
  };

  return (
    <Grid container spacing={gridSpacing}>
      {graphData && (
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
        </>
      )}
    </Grid>
  );
};

export default Graphs;


// import React from 'react';
// import Grid from '@mui/material/Grid';
// import { gridSpacing } from 'store/constant';
// import GraphA from './Graph';
// import { GraphData, Edge } from './Graph';
// import MainCard from 'ui-component/cards/MainCard';

// interface GraphsProps {
//     graphData: GraphData;
// }

// const Graphs: React.FC<GraphsProps> = ({ graphData }) => {
//     const reverseEdges = (edges: Edge[]): Edge[] => {
//         return edges.map(edge => ({ from: edge.to, to: edge.from }));
//     };

//     return (
//         <Grid container spacing={gridSpacing}>
//             {graphData && (
//                 <>
//                  <Grid item xs={12} md={6}>
//                     <MainCard title="Follow Connections">
//                         <GraphA nodes={graphData.nodes} edges={graphData.edges} />
//                     </MainCard>
//                     </Grid>
//                     <Grid item xs={12} md={6}>
//                     <MainCard title="Followed By Connections">
//                         <GraphA nodes={graphData.nodes} edges={reverseEdges(graphData.edges)} />
//                     </MainCard>
//                     </Grid>
//                 </>
//             )}
//         </Grid>
//     );
// };

// export default Graphs;
