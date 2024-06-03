// Graph.tsx
import React from "react";
import Graph from "react-graph-vis";

export interface Node {
  id: number;
  label: string;
  title: string;
}

export interface Edge {
  from: number;
  to: number;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

interface GraphAProps {
  nodes: Node[];
  edges: Edge[];
}

export default function GraphA({ nodes, edges }: GraphAProps) {
  const graph = { nodes, edges };

  const options = {
    layout: {
      hierarchical: false
    },
    edges: {
      color: "black"
    },
    height: "500px"
  };

  const events = {
    select: function (event: any) {
      var { nodes, edges } = event;
      console.log(edges);
      console.log(nodes);
    }
  };

  return (
    <Graph
      graph={graph}
      options={options}
      events={events}
      getNetwork={(network: any) => {
        //  if you want access to vis.js network api you can set the state in a parent component using this property
      }}
    />
  );
}
