"use client"

import ReactFlow, { Background, useNodesState, useEdgesState } from "reactflow"
import { PartnerInitialNodes, PartnerInitialEdges } from "../_lib/dummy-data"
import { PartnerTitle, PartnerCard } from "./ai-integration-node-types"
import { CustomEdge } from "./ai-integration-edge-types"
import "reactflow/dist/style.css"
import "../_styles/index.css"
import GradientBackgroundWhite from "./ai-integration-gradient-bg-white"

const nodeTypes = {
  partnerTitle: PartnerTitle,
  partnerCard: PartnerCard,
}

const edgeTypes = {
  customEdge: CustomEdge,
}

const PartnerReactFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(PartnerInitialNodes)
  const [edges, , onEdgesChange] = useEdgesState(PartnerInitialEdges)

  return (
    <div className="floatingedges hidden lg:relative lg:z-10 lg:mx-auto lg:flex lg:h-[600px] lg:w-[800px]">
      <GradientBackgroundWhite className="h-full w-full" />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        zoomOnScroll={false}
      >
        <Background />
        <div className="absolute z-10 bottom-0 right-0 w-20 h-6 bg-[#030303]"></div>
      </ReactFlow>
    </div>
  )
}

export default PartnerReactFlow
