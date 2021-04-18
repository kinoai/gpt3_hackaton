import { map } from "d3-array"
import React, { useEffect, useRef } from "react"
import { debounce } from "debounce"

// import { HierarchyNode } from "d3"
import { KnowledgeNode } from "./KnowledgeGraph"

import { WindowContainer } from "./NodeWindow-styles"

interface NodeWindowProps {
  x: number
  y: number
  isVisible: boolean
  nodeData: KnowledgeNode | null
  setWindowProps: Function
}

const NodeWindow = ({
  x,
  y,
  isVisible,
  nodeData,
  setWindowProps,
}: NodeWindowProps) => {
  const windowRef = useRef(null)

  function hideOnClickOutside(element: HTMLElement) {
    const outsideClickListener = (event: MouseEvent) => {
      // @ts-ignore
      if ("__data__" in event.target) return
      // @ts-ignore
      if (!element.contains(event.target) && checkElementVisibility(element)) {
        setWindowProps({ x: 0, y: 0, isVisible: false, nodeData: null })
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
    if (isVisible)
      // @ts-ignore
      hideOnClickOutside(windowRef.current)
  }, [isVisible])

  if (!nodeData) return <WindowContainer x={x} y={y} isVisible={false} />

  return (
    // @ts-ignore
    <WindowContainer ref={windowRef} x={x} y={y} isVisible={isVisible}>
      <p>
        <b>Title:</b> {nodeData.doc}
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
