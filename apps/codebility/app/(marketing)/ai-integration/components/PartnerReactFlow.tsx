"use client"

import ReactFlow, { Background, useNodesState, useEdgesState } from "reactflow"
import { PartnerInitialNodes, PartnerInitialEdges } from "@/app/(marketing)/ai-integration/components/data"
import { PartnerTitle, PartnerCard } from "@/app/(marketing)/ai-integration/components/NodeTypes"
import { CustomEdge } from "@/app/(marketing)/ai-integration/components/EdgeTypes"
import "reactflow/dist/style.css"
import "@/app/(marketing)/ai-integration/components/index.css"
import GradientBackgroundWhite from "@/app/(marketing)/ai-integration/components/GradientBackgroundWhite"

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
