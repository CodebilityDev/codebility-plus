"use client";

import "reactflow/dist/style.css";

import ReactFlow, { Background, useEdgesState, useNodesState } from "reactflow";

import "@/styles/marketing/ai-integration/ai-integration.css";

import {
  DevProcessInitialEdges,
  DevProcessInitialNodes,
} from "@/constants/marketing/ai-integration/dummy-data";
import Section from "@/components/global/marketing/MarketingSection";
import { CustomEdge } from "@/components/marketing/ai-integration/AiIntegrationEdgeTypes";
import GradientBackgroundWhite from "@/components/marketing/ai-integration/AiIntegrationGradientBgWhite";
import { DevProcessCard, DevProcessImage } from "@/components/marketing/ai-integration/AiIntegrationNodeTypes";

const nodeTypes = {
  devProcessCard: DevProcessCard,
  devProcessImage: DevProcessImage,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

const DevelopmentProcessReactFLow = () => {
  const [nodes, , onNodesChange] = useNodesState(DevProcessInitialNodes);
  const [edges, , onEdgesChange] = useEdgesState(DevProcessInitialEdges);

  return (
    <Section className="hidden lg:flex lg:flex-col lg:gap-10">
      <div className="flex flex-col gap-5">
        <h2 className="text-4xl font-semibold md:mx-auto md:w-2/3 md:text-center lg:w-full lg:text-start">
          Our Streamlined Development Process
        </h2>
        <p className="text-lg md:mx-auto md:w-2/3 md:text-center lg:w-full lg:text-start lg:text-xl">
          From Concept to Launch: Our Comprehensive Approach to Crafting
          Exceptional Websites{" "}
        </p>
      </div>
      <div className="floatingedges lg:relative lg:z-10 lg:mx-auto lg:h-[1054px] lg:w-[800px]">
        <GradientBackgroundWhite className="-left-56 -top-52 h-[800px] w-[800px]" />
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
          <div className="bg-backgroundColor absolute bottom-0 right-0 z-10 h-6 w-20"></div>
        </ReactFlow>
      </div>
    </Section>
  );
};

export default DevelopmentProcessReactFLow;
