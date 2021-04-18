import React, { useEffect, useState } from "react"

import * as d3 from "d3"
import { debounce } from "debounce"

import NodeWindow from "./NodeWindow"

interface KnowledgeGroup {
  name: string
  score: Number
}

interface KnowledgeDocument {
  abstract: string
  authors: string[]
  link: string
  title: string
}

export interface KnowledgeNode {
  doc: KnowledgeDocument
  groups: KnowledgeGroup[]
}

interface DataProps {
  nodes: KnowledgeNode[]
  links: d3.HierarchyLink<KnowledgeNode>[]
}

interface KnowledgeGraphProps {
  data: DataProps
}

const KnowledgeGraph = ({ data }: KnowledgeGraphProps) => {
  const [links, setLinks] = useState([] as d3.HierarchyLink<KnowledgeNode>[])
  const [nodes, setNodes] = useState([] as d3.HierarchyNode<KnowledgeNode>[])

  const [windowProps, setWindowProps] = useState({
    x: 0,
    y: 0,
    isVisible: false,
    nodeData: null,
    compareData: null,
  })

  const [selectedNodes, setSelectedNodes] = useState([])

  const handleNodeClick = (
    x: number,
    y: number,
    nodeData: d3.HierarchyNode<KnowledgeNode>
  ) => {
    setWindowProps({
      x,
      y,
      nodeData: Object.getPrototypeOf(nodeData),
      compareData: null,
      isVisible: true,
    })
  }

  const handleNodeSelect = (target: any) => {
    // @ts-ignore
    setSelectedNodes((oldSelection) => {
      if (oldSelection.length > 1) return oldSelection
      d3.select(target).style("fill", !oldSelection.length ? "red" : "orange")
      return [...oldSelection, target]
    })
  }

  const moveWindow = (event: React.DragEvent<HTMLDivElement>) => {
    const newPos = [event.pageX, event.pageY]
    setWindowProps((oldWindowProps) => ({
      ...oldWindowProps,
      x: newPos[0],
      y: newPos[1],
    }))
  }

  useEffect(() => {
    if (selectedNodes.length < 2) return
    console.log(selectedNodes)
    // @ts-ignore
    setWindowProps((oldWindowProps) => {
      return {
        ...oldWindowProps,
        isVisible: true,
        nodeData: null,
        compareData: {
          // @ts-ignore
          nodeA: Object.getPrototypeOf(selectedNodes[0].__data__),
          // @ts-ignore
          nodeB: Object.getPrototypeOf(selectedNodes[1].__data__),
          link: null,
        },
      }
    })
  }, [selectedNodes])

  useEffect(() => {
    setLinks(data.links.map((d) => Object.create(d)))
    setNodes(data.nodes.map((d) => Object.create(d)))
    d3.select("#graph").selectAll("*").remove()
  }, [data])

  useEffect(() => {
    const [width, height] = [690, 590]
    const svg = d3.select("#graph")
    if (!svg) return

    svg.on("click", (e: MouseEvent) => {
      if (e.target && "__data__" in e.target) return
      d3.select("svg").selectAll("circle").style("fill", "")
      setSelectedNodes([])
    })

    const simulation = d3
      .forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force(
        "link",
        d3
          .forceLink(links as d3.SimulationLinkDatum<d3.SimulationNodeDatum>[])
          .distance(40)
          .strength(0.2)
          .id((d) => (d as KnowledgeNode).doc.title)
      )
      .force("charge", d3.forceManyBody().strength(-100).distanceMax(100))
      .force("center", d3.forceCenter(width / 2, height / 2).strength(1.5))
      .force("forceX", d3.forceX(width / 2).strength(0.01))
      .force("forceY", d3.forceY(height / 2).strength(0.01))
      .force("collision", d3.forceCollide().radius(20))

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
      // @ts-ignore
      .data(nodes, (d) => d.doc.title)
      .join("circle")
      .attr("r", 10)
      // .attr("fill", color)
      // @ts-ignore
      .call(drag(simulation))
      .on("click", (e: MouseEvent) => {
        // console.log(e)
        if (e.ctrlKey || e.metaKey) return handleNodeSelect(e.target)

        // @ts-ignore
        handleNodeClick(e.x, e.y, e.target.__data__)
        // @ts-ignore
        d3.select("svg").selectAll("circle").style("fill", "")
        // @ts-ignore
        d3.select(e.target).style("fill", "red")
      })

    // @ts-ignore
    node.append("title").text((d) => d.doc)

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

    const zoom = d3
      .zoom()
      .extent([
        [0, 0],
        [width, height],
      ])
      .scaleExtent([0.5, 32])
      .on("zoom", (e) => {
        svg.selectAll("g").attr("transform", e.transform)
      })

    svg
      // @ts-ignore
      .call(zoom)
      // @ts-ignore
      .call(zoom.transform, d3.zoomIdentity)

    return () => {
      simulation.stop()
    }
  }, [nodes, links])

  return (
    <>
      <div style={{ border: "1px solid gray", borderRadius: 5 }}>
        <svg id="graph" width={690} height={590}></svg>
        <NodeWindow
          {...windowProps}
          setWindowProps={setWindowProps}
          onDragEnd={moveWindow}
        />
      </div>
    </>
  )
}

export default KnowledgeGraph
