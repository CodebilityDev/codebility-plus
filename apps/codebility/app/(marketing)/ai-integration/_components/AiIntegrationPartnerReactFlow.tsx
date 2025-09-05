"use client";

import ReactFlow, { Background, useEdgesState, useNodesState } from "reactflow";

import { PartnerInitialEdges, PartnerInitialNodes } from "../_lib/dummy-data";
import { CustomEdge } from "./AiIntegrationEdgeTypes";
import { PartnerCard, PartnerTitle } from "./AiIntegrationNodeTypes";

import "reactflow/dist/style.css";
import "../_styles/index.css";

import GradientBackgroundWhite from "./AiIntegrationGradientBgWhite";

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
