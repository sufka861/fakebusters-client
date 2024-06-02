import React from 'react';
import Grid from '@mui/material/Grid';
import { gridSpacing } from 'store/constant';
import GraphA from './Graph';
import { GraphData, Edge } from './Graph';
import MainCard from 'ui-component/cards/MainCard';

interface GraphsProps {
    graphData: GraphData;
}

const Graphs: React.FC<GraphsProps> = ({ graphData }) => {
    const reverseEdges = (edges: Edge[]): Edge[] => {
        return edges.map(edge => ({ from: edge.to, to: edge.from }));
    };

    return (
        <Grid container spacing={gridSpacing}>
            {graphData && (
                <>
                    <MainCard title="Follow Connections">
                        <GraphA nodes={graphData.nodes} edges={graphData.edges} />
                    </MainCard>
                    {/* <Grid item xs={12} md={6}> */}
                    <MainCard title="Followed By Connections">
                        <GraphA nodes={graphData.nodes} edges={reverseEdges(graphData.edges)} />
                    </MainCard>
                </>
            )}
        </Grid>
    );
};

export default Graphs;
