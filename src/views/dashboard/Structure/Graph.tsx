// Graph.tsx
import React, { useEffect, useRef } from 'react';
import { Network, Options } from 'vis-network/standalone';
import 'vis-network/styles/vis-network.css';

export interface Node {
  id: number;
  label: string;
  title?: string;
  degreeCentrality?: number; // Optional degree centrality property
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

interface GraphAProps {
  nodes: Node[];
  edges: Edge[];
}

const GraphA: React.FC<GraphAProps> = ({ nodes, edges }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Calculate degree centrality for each node
      const nodeDegreeMap = new Map<number, number>();
      edges.forEach(edge => {
        nodeDegreeMap.set(edge.from, (nodeDegreeMap.get(edge.from) || 0) + 1);
        nodeDegreeMap.set(edge.to, (nodeDegreeMap.get(edge.to) || 0) + 1);
      });

      const maxDegree = Math.max(...Array.from(nodeDegreeMap.values()));

      const scaledNodes = nodes.map(node => ({
        ...node,
        size: (nodeDegreeMap.get(node.id) || 0) / maxDegree * 22, // Scale size based on degree centrality
        color: '#64B5F6',
        font: {
          size: 0, // Hide node labels
        },
      }));

      const data = {
        nodes: scaledNodes,
        edges,
      };

      const options: Options = {
        nodes: {
          shape: 'dot',
          font: {
            size: 0, // Hide node labels
          },
        },
        edges: {
          arrows: {
            to: { enabled: true, scaleFactor: 1, type: 'arrow' },
          },
          color: '#27292A',
        },
        layout: {
          hierarchical: {
            enabled: false, // Disable hierarchical layout
          },
        },
        interaction: {
          tooltipDelay: 100,
        },
        height: '500px',
      };

      const network = new Network(containerRef.current, data, options);
      
      // Optionally, if you need access to the network instance
      // you can use it in other parts of your component.
      // For example, you could add event handling or access methods like getPositions.
      // network.on("click", function(params) {
      //   console.log("clicked on node: ", params.nodes[0]);
      // });
    }
  }, [nodes, edges]);

  return <div ref={containerRef} style={{ height: '500px', width: '100%' }} />;
};

export default GraphA;
