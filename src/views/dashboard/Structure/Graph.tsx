// Graph.tsx
import React, { useEffect, useRef } from 'react';
import { DataSet, Network, Options } from 'vis-network/standalone';
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

      // Check if maxDegree is greater than 0 to avoid division by zero
      const minNodeSize = 10;
      const maxNodeSize = 50;
      const scaleFactor = maxDegree > 0 ? (maxNodeSize - minNodeSize) / maxDegree : 1;

      const scaledNodes = nodes.map(node => {
        const degree = nodeDegreeMap.get(node.id) || 0;
        const size = minNodeSize + degree * scaleFactor;
        return {
          ...node,
          size: Math.min(size, maxNodeSize),
          color: '#64B5F6',
        };
      });

      const data = {
        nodes: new DataSet(scaledNodes),
        edges: new DataSet(edges),
      };

      const options: Options = {
        nodes: {
          shape: 'dot', // Use 'dot' to reflect size
          scaling: {
            min: minNodeSize, // Minimum size
            max: maxNodeSize, // Maximum size
          },
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

      new Network(containerRef.current, data, options);
    }
  }, [nodes, edges]);

  return <div ref={containerRef} style={{ height: '500px', width: '100%' }} />;
};

export default GraphA;
