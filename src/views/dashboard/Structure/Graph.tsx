import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Network, Options } from 'vis-network/standalone';
import 'vis-network/styles/vis-network.css';

export interface Node {
    id: number;
    label: string;
    title?: string;
    degreeCentrality?: number;
    size?: number;
    color?: string;
}

export interface Edge {
    from: number;
    to: number;
    arrows: 'to' | 'middle' | 'from' | 'none' | 'to, from';
}

interface GraphAProps {
    nodes: Node[];
    edges: Edge[];
}

const GraphA: React.FC<GraphAProps> = ({ nodes, edges }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [nodeDetails, setNodeDetails] = useState<any>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const scaledNodes = useMemo(() => {
        const nodeDegreeMap = new Map<number, number>();
        edges.forEach((edge) => {
            nodeDegreeMap.set(edge.from, (nodeDegreeMap.get(edge.from) || 0) + 1);
            nodeDegreeMap.set(edge.to, (nodeDegreeMap.get(edge.to) || 0) + 1);
        });

        const maxDegree = Math.max(...Array.from(nodeDegreeMap.values()));
        const minNodeSize = 12;
        const maxNodeSize = 60;
        const scaleFactor = maxDegree > 0 ? (maxNodeSize - minNodeSize) / maxDegree : 1;
        return nodes.map((node) => {
            const degree = nodeDegreeMap.get(node.id) || 0;
            const size = minNodeSize + degree * scaleFactor;
            console.log(`Node ID: ${node.id}, Degree: ${degree}, Size: ${size}`); // Debugging: Log node sizes
            return {
                ...node,
                size: Math.min(size, maxNodeSize),
                color: '#64B5F6'
            };
        });
    }, [nodes, edges]);

    useEffect(() => {
        if (containerRef.current) {
            const data = {
                nodes: scaledNodes,
                edges
            };

            const options: Options = {
                layout: {
                    randomSeed: 1,
                    hierarchical: false,
                    improvedLayout: true
                },
                nodes: {
                    shape: 'dot',
                    font: {
                        size: 12,
                        face: 'Calibri'
                    },
                    size: 20,  // Example size, adjust as needed
                    scaling: {
                        label: {
                            enabled: true
                        }
                    },
                    color: {
                        background: '#64B5F6', // Node background color
                        border: '#1E88E5',     // Node border color
                        highlight: {
                            background: '#1976D2',
                            border: '#1565C0'
                        },
                        hover: {
                            background: '#2196F3',
                            border: '#1E88E5'
                        }
                    }
                },
                edges: {
                    smooth: {
                        enabled: true,
                        type: 'continuous',
                        forceDirection: 'none',
                        roundness: 0.5
                    },
                    arrows: {
                        to: { enabled: true, scaleFactor: 1, type: 'arrow' }
                    },
                    length: 300  // Adjust edge length as needed
                },
                autoResize: true,
                interaction: {
                    dragNodes: true,  // Allow dragging of nodes
                    dragView: true,   // Allow dragging of the entire view (panning)
                    zoomView: true,    // Allow zooming
                    zoomSpeed: 0.1
                },
                physics: {
                    enabled: true,
                    hierarchicalRepulsion: {
                        avoidOverlap: 2,     // Increase to ensure nodes do not overlap
                        centralGravity: 0.1, // Example central gravity, adjust as needed
                        springLength: 300,   // Adjust spring length
                        springConstant: 0.05,// Adjust spring constant
                        nodeDistance: 400,   // Increase to spread nodes further apart
                        damping: 0.5
                    },
                    stabilization: {
                        iterations: 2000,
                        updateInterval: 200,
                        onlyDynamicEdges: false,
                        fit: true  // Disable automatic fitting of the graph
                    }
                }
            };
            

            const network = new Network(containerRef.current, data, options);
            return () => {
                network.destroy();
            };
        }
    }, [scaledNodes, edges]);

    return <div ref={containerRef} style={{ height: '500px', width: '100%' }} />;
};

export default GraphA;
