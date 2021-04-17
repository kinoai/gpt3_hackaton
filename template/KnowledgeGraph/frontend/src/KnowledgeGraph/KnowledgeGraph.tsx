import React, { useEffect, useState } from "react"

import * as d3 from "d3"

interface KnowledgeGroup {
  name: string
  score: Number
}
interface KnowledgeNode {
  doc: string
  groups: KnowledgeGroup[]
}

interface DataProps {
  nodes: KnowledgeNode[]
  links: d3.HierarchyLink<KnowledgeNode>[]
}

interface KnowledgeGraphProps {
  name: string
  data: DataProps
}

const KnowledgeGraph = ({ name, data }: KnowledgeGraphProps) => {
  const [links, setLinks] = useState([] as d3.HierarchyLink<KnowledgeNode>[])
  const [nodes, setNodes] = useState([] as d3.HierarchyNode<KnowledgeNode>[])

  useEffect(() => {
    setLinks(data.links.map((d) => Object.create(d)))
    setNodes(data.nodes.map((d) => Object.create(d)))
  }, [data])

  useEffect(() => {
    const [width, height] = [500, 400]
    const svg = d3.select("#graph")
    if (!svg) return

    const simulation = d3
      .forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force(
        "link",
        d3
          .forceLink(links as d3.SimulationLinkDatum<d3.SimulationNodeDatum>[])
          .id((d) => (d as KnowledgeNode).doc)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))

    const drag = (simulation: any) => {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
      }

      function dragged(event: any) {
        event.subject.fx = event.x
        event.subject.fy = event.y
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
      }

      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    }

    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
    // .attr("stroke-width", (d) => Math.sqrt(d.value))

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 5)
      // .attr("fill", color)
      // @ts-ignore
      .call(drag(simulation))

    node.append("title").text((d) => 'Title')

    simulation.on("tick", () => {
      link
        // @ts-ignore
        .attr("x1", (d) => d.source.x)
        // @ts-ignore
        .attr("y1", (d) => d.source.y)
        // @ts-ignore
        .attr("x2", (d) => d.target.x)
        // @ts-ignore
        .attr("y2", (d) => d.target.y)
      
      // @ts-ignore
      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y)
    })

    // @ts-ignore
    // d3.select(context.canvas).call(drag(simulation)).node()

    return () => {
      simulation.stop()
    }
  }, [nodes, links])

  return (
    <>
      <span>
        Hello, {name}! &nbsp;
        <button>Click Me!</button>
      </span>
      <div>
        <svg id="graph" width={500} height={400}></svg>
      </div>
    </>
  )
}

export default KnowledgeGraph
