import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
  address: string;
  reputation: number;
}

interface Link {
  source: string;
  target: string;
  weight: number;
}

export default function GraphVisualization() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    // Sample data for visualization
    const sampleNodes: Node[] = [
      { id: '1', address: '0x1234...5678', reputation: 850 },
      { id: '2', address: '0x2345...6789', reputation: 720 },
      { id: '3', address: '0x3456...7890', reputation: 950 },
      { id: '4', address: '0x4567...8901', reputation: 680 },
      { id: '5', address: '0x5678...9012', reputation: 790 },
    ];

    const sampleLinks: Link[] = [
      { source: '1', target: '2', weight: 85 },
      { source: '1', target: '3', weight: 92 },
      { source: '2', target: '4', weight: 75 },
      { source: '3', target: '4', weight: 88 },
      { source: '3', target: '5', weight: 95 },
      { source: '4', target: '5', weight: 70 },
    ];

    setNodes(sampleNodes);
    setLinks(sampleLinks);
  }, []);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const width = 800;
    const height = 500;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        'link',
        d3.forceLink(links).id((d: any) => d.id)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Draw links
    const link = svg
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#8b5cf6')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d) => d.weight / 20);

    // Draw nodes
    const node = svg
      .append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', (d) => 10 + d.reputation / 100)
      .attr('fill', (d) => d3.interpolateRgb('#8b5cf6', '#ec4899')(d.reputation / 1000))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .call(drag(simulation) as any);

    // Add labels
    const label = svg
      .append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text((d) => d.address)
      .attr('font-size', 10)
      .attr('fill', '#e2e8f0')
      .attr('dx', 15)
      .attr('dy', 4);

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);

      label.attr('x', (d: any) => d.x).attr('y', (d: any) => d.y);
    });

    function drag(simulation: d3.Simulation<any, undefined>) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
    }
  }, [nodes, links]);

  return (
    <div className="w-full h-full bg-slate-900/50 rounded-lg overflow-hidden">
      <svg ref={svgRef} className="w-full" style={{ minHeight: '500px' }} />
    </div>
  );
}

