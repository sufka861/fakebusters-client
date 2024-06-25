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
        const minNodeSize = 10;
        const maxNodeSize = 50;
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

            const options: Options = 
            // {
            //     layout: {
            //         randomSeed: 1,
            //         hierarchical: false,
            //         improvedLayout: false
            //     },
            //     nodes: {
            //         shape: 'dot',
            //         font: {
            //             size: 12,
            //             face: 'Calibri'
            //         }
            //     },
            //     edges: {
            //         smooth: {
            //             enabled: true,
            //             type: 'continuous',
            //             forceDirection: 'none',
            //             roundness: 0.5
            //         },
            //         arrows: {
            //             to: { enabled: true, scaleFactor: 1, type: 'arrow' }
            //         }
            //     },
            //     autoResize: true,
            //     interaction: {
            //         zoomView: true
            //     },
            //     physics: {
            //         enabled: true,
            //         hierarchicalRepulsion: {
            //             avoidOverlap: 0.8,
            //             springConstant: 0.001,
            //             nodeDistance: 100,
            //             damping: 1.5
            //         },
            //         stabilization: {
            //             iterations: 2000,
            //             updateInterval: 100,
            //             onlyDynamicEdges: false,
            //             fit: true
            //         },
            //         solver: 'hierarchicalRepulsion'
            //     }
            // };
            {
              nodes: {
                shape: 'dot',
                                          font: {
                              size: 12,
                              face: 'Calibri'
                          },
                scaling: {
                  min: 12,
                  max: 60,
                },

              },
              edges: {
                arrows: {
                  to: { enabled: true, scaleFactor: 1, type: 'arrow' }},
                  smooth: {
                                enabled: true,
                                type: 'continuous',
                                forceDirection: 'none',
                                roundness: 0.5
                            },
                 color: '#27292A',
              },
                              autoResize: true,
                interaction: {
                    zoomView: true
                },
              layout: {
                        randomSeed: 1,
                       // hierarchical: false,
                        improvedLayout: true
                    },
              
      
              physics: {
                hierarchicalRepulsion: {
                               avoidOverlap: 0.8,
                               nodeDistance: 100,
                               springConstant: 0.001,},
                stabilization: {
                  enabled: true,
                  iterations: 2000,
                  onlyDynamicEdges: false,
                  fit: true
                }}
                         
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
