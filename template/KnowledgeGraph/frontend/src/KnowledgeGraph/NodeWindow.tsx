import { map } from "d3-array"
import React, { useEffect, useRef, useState } from "react"
import { debounce } from "debounce"

import { compare_papers } from "./api"

// import { HierarchyNode } from "d3"
import { KnowledgeNode } from "./KnowledgeGraph"

import { WindowContainer, StyledSpinner } from "./NodeWindow-styles"

interface NodesPair {
  nodeA: KnowledgeNode
  nodeB: KnowledgeNode
  link: any | null
}

interface NodeWindowProps {
  x: number
  y: number
  isVisible: boolean
  nodeData: KnowledgeNode | null
  compareData: NodesPair | null
  setWindowProps: Function
  onDragEnd: Function
}

const NodeWindow = ({
  x,
  y,
  isVisible,
  nodeData,
  compareData,
  setWindowProps,
  onDragEnd,
}: NodeWindowProps) => {
  const windowRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [response, setResponse] = useState<string | null>(null)

  function hideOnClickOutside(element: HTMLElement) {
    const outsideClickListener = (event: MouseEvent) => {
      // @ts-ignore
      if ("__data__" in event.target) return
      // @ts-ignore
      if (!element.contains(event.target) && checkElementVisibility(element)) {
        setWindowProps({
          x: 0,
          y: 0,
          isVisible: false,
          nodeData: null,
          compareData: null,
        })
        removeClickListener()
      }
    }

    // TODO: Should be mousedown / drag here, but need to specify Canvas to overwrite priority
    const removeClickListener = () => {
      document.removeEventListener("click", outsideClickListener)
    }

    document.addEventListener("click", outsideClickListener)
  }
  const checkElementVisibility = (elem: HTMLElement) =>
    !!elem &&
    !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)

  useEffect(() => {
    if (isVisible && windowRef.current)
      // @ts-ignore
      hideOnClickOutside(windowRef.current)
  }, [isVisible])

  useEffect(() => {
    if (!compareData) return
    setLoading(true)
    compare_papers(
      compareData.nodeA.doc.title,
      compareData.nodeA.doc.abstract,
      compareData.nodeB.doc.title,
      compareData.nodeB.doc.abstract
    ).then((resp) => {
      setResponse(resp)
      setLoading(false)
    })
  }, [compareData])

  if (!nodeData && compareData)
    return (
      <WindowContainer
        ref={windowRef}
        x={x}
        y={y}
        isVisible={isVisible}
        draggable
        // @ts-ignore
        onDragEnd={onDragEnd}
      >
        <p>
          <b>
            Title (<span style={{ color: "red" }}>red</span>):
          </b>{" "}
          <br /> {compareData.nodeA.doc.title}
        </p>
        <p>
          <b>
            Title (<span style={{ color: "orange" }}>orange</span>):
          </b>{" "}
          <br /> {compareData.nodeB.doc.title}
        </p>
        <b>Summary:</b> <br />
        <span>
          {loading ? (
            <p>
              GPT-3 is thinking...
              <StyledSpinner viewBox="0 0 50 50">
                <circle
                  className="path"
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  strokeWidth="2"
                />
              </StyledSpinner>
            </p>
          ) : (
            response
              ?.split("\n")
              .map((str, i) => <p key={`comp-${i}`}>{str}</p>)
          )}
        </span>
      </WindowContainer>
    )

  if (!nodeData)
    return <WindowContainer ref={windowRef} x={x} y={y} isVisible={false} />

  return (
    // @ts-ignore
    <WindowContainer
      ref={windowRef}
      x={x}
      y={y}
      isVisible={isVisible}
      draggable
      // @ts-ignore
      onDragEnd={onDragEnd}
    >
      <p>
        <b>Title:</b> <br /> {nodeData.doc.title} <br />
      </p>
      <p>
        <b>Authors:</b> <br /> {nodeData.doc.authors.join(", ")}
      </p>
      <b>Categories: </b>
      <ul>
        {map(nodeData.groups, (group, i) => (
          <li key={"cat-" + i}>
            {group.name} | {group.score}
          </li>
        ))}
      </ul>
    </WindowContainer>
  )
}

export default NodeWindow
