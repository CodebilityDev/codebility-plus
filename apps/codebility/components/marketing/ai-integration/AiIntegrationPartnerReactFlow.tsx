"use client";

import ReactFlow, { Background, useEdgesState, useNodesState } from "reactflow";

import { PartnerInitialEdges, PartnerInitialNodes } from "@/constants/marketing/ai-integration/dummy-data";
import { CustomEdge } from "@/components/marketing/ai-integration/AiIntegrationEdgeTypes";
import { PartnerCard, PartnerTitle } from "@/components/marketing/ai-integration/AiIntegrationNodeTypes";

import "reactflow/dist/style.css";
import "@/styles/marketing/ai-integration/ai-integration.css";

import GradientBackgroundWhite from "@/components/marketing/ai-integration/AiIntegrationGradientBgWhite";

const nodeTypes = {
  partnerTitle: PartnerTitle,
  partnerCard: PartnerCard,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

const PartnerReactFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(PartnerInitialNodes);
  const [edges, , onEdgesChange] = useEdgesState(PartnerInitialEdges);

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
        <div className="bg-black-400 absolute bottom-0 right-0 z-10 h-6 w-20"></div>
      </ReactFlow>
    </div>
  );
};

export default PartnerReactFlow;
