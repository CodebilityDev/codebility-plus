"use client";

import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Edge,
  EdgeTypes,
  Node,
  NodeTypes,
  useEdgesState,
  useNodesState,
} from "reactflow";

// @ts-ignore - CSS import
import "reactflow/dist/style.css";

import { Box } from "@/components/shared/dashboard";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { useUserStore } from "@/store/codev-store";
import { CodevPoints } from "@/types/home/codev";
import { createClientClientComponent } from "@/utils/supabase/client";

import { CustomRoadmapEdge } from "./DashboardRoadmapEdgeTypes";
import {
  RoadmapDecorativeIcon,
  RoadmapPhaseCard,
} from "./DashboardRoadmapNodeTypes";
import { PhaseDetailsModal } from "./PhaseDetailsModal";

const nodeTypes: NodeTypes = {
  phaseCard: RoadmapPhaseCard,
  decorativeIcon: RoadmapDecorativeIcon,
};

const edgeTypes: EdgeTypes = {
  customRoadmap: CustomRoadmapEdge,
};

export default function DashboardRoleRoadmap() {
  const user = useUserStore((state) => state.user);
  const supabase = createClientClientComponent();
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const roadmapData = [
    {
      id: "1",
      phase: "PHASE 1",
      title: "Intern",
      pointsRange: "0-100 points",
      minPoints: 0,
      maxPoints: 100,
      steps: [
        { id: "1", step: "Learn The Basics" },
        { id: "2", step: "Hands-On Practice" },
        { id: "3", step: "Version Control" },
      ],
    },
    {
      id: "2",
      phase: "PHASE 2",
      title: "Codev",
      pointsRange: "100-200 points",
      minPoints: 100,
      maxPoints: 200,
      steps: [
        { id: "1", step: "Deepen Language Proficiency" },
        { id: "2", step: "Explore Frameworks and Libraries" },
        { id: "3", step: "Work On Projects" },
        { id: "4", step: "Development Practices" },
      ],
    },
    {
      id: "3",
      phase: "PHASE 3",
      title: "Mentor",
      pointsRange: "200+ points",
      minPoints: 200,
      maxPoints: Infinity,
      steps: [
        { id: "1", step: "Specialize" },
        { id: "2", step: "Advanced Concepts" },
        { id: "3", step: "Collaborate" },
      ],
    },
  ];

  // Handler functions for modal
  const handlePhaseClick = (phaseId: string) => {
    setSelectedPhase(phaseId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhase(null);
  };

  // Determine the current phase based on user's role_id
  // role_id: 4 = Intern (Phase 1), 10 = Codev (Phase 2), 5 = Mentor (Phase 3)
  const getCurrentPhaseIndex = () => {
    const roleId = user?.role_id;
    if (roleId === 4) return 0; // Intern - Phase 1
    if (roleId === 10) return 1; // Codev - Phase 2
    if (roleId === 5) return 2; // Mentor - Phase 3

    // Fallback to points-based if role_id is not set
    return roadmapData.findIndex(
      (phase) => totalPoints >= phase.minPoints && totalPoints < phase.maxPoints,
    );
  };

  const currentPhaseIndex = getCurrentPhaseIndex();

  // Create initial nodes
  const createInitialNodes = (): Node[] => {
    return roadmapData.map((phase, index) => {
      const isCompleted = index < currentPhaseIndex;
      const isCurrent = index === currentPhaseIndex;
      const isPending = index > currentPhaseIndex;

      // Create zigzag pattern: left, center-right, left
      let xPosition = 10; // default left position
      if (index === 1) {
        xPosition = 280; // center-right for second card
      } else if (index === 2) {
        xPosition = 70; // back to left for third card
      }

      return {
        id: `phase-${phase.id}`,
        type: "phaseCard",
        position: { x: xPosition, y: index * 400 },
        data: {
          id: phase.id,
          phase: phase.phase,
          title: phase.title,
          pointsRange: phase.pointsRange,
          steps: phase.steps,
          isCompleted,
          isCurrent,
          isPending,
        },
      };
    });
  };

  // Create initial edges
  const createInitialEdges = (): Edge[] => {
    const edges: Edge[] = [];
    for (let i = 0; i < roadmapData.length - 1; i++) {
      const isActive = i < currentPhaseIndex;
      const currentPhase = roadmapData[i];
      const nextPhase = roadmapData[i + 1];

      if (currentPhase && nextPhase) {
        edges.push({
          id: `edge-${i}-${i + 1}`,
          source: `phase-${currentPhase.id}`,
          target: `phase-${nextPhase.id}`,
          type: "customRoadmap",
          sourceHandle: "bottom",
          targetHandle: "top",
          data: { isActive },
          animated: isActive,
        });
      }
    }
    return edges;
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(createInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(createInitialEdges());

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      // Extract phase id from node id (format: "phase-1", "phase-2", etc.)
      const phaseId = node.id.replace("phase-", "");
      handlePhaseClick(phaseId);
    },
    [],
  );

  useEffect(() => {
    const fetchPoints = async () => {
      if (!supabase) return;

      try {
        setLoading(true);

        // Fetch codev points
        const { data: codevData, error: codevError } = await supabase
          .from("codev_points")
          .select("points")
          .eq("codev_id", user?.id);

        if (codevError) {
          console.error("Error fetching codev points:", codevError);
        }

        // Sum up all codev points
        const skillCategoryPoints =
          codevData?.reduce(
            (sum: number, record: any) => sum + (record.points || 0),
            0,
          ) || 0;

        // Fetch attendance points
        const { data: attendanceData, error: attendanceError } = await supabase
          .from("attendance_points")
          .select("points")
          .eq("codev_id", user?.id)
          .maybeSingle();

        if (attendanceError) {
          console.error("Error fetching attendance points:", attendanceError);
        }

        const attendancePoints = attendanceData?.points || 0;

        // Fetch profile points via API
        let profilePoints = 0;
        try {
          const res = await fetch(`/api/profile-points/${user?.id}`);
          if (res.ok) {
            const data = (await res.json()) as { totalPoints?: number };
            profilePoints = data?.totalPoints || 0;
          }
        } catch (error) {
          console.error("Failed to fetch profile points:", error);
        }

        // Fetch social points via RPC
        const { data: socialData } = await supabase.rpc(
          "calculate_social_points",
          { codev_id: user?.id },
        );
        const socialPoints = socialData || 0;

        // Calculate total points
        const total =
          skillCategoryPoints + attendancePoints + profilePoints + socialPoints;
        setTotalPoints(total);
      } catch (error) {
        console.error("Error in fetchPoints:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchPoints();
    }
  }, [user?.id, supabase]);

  // Update nodes and edges when totalPoints changes
  useEffect(() => {
    if (!loading) {
      setNodes(createInitialNodes());
      setEdges(createInitialEdges());
    }
  }, [totalPoints, loading]);

  // Calculate overall progress percentage
  const overallProgress = Math.min((totalPoints / 200) * 100, 100);

  if (loading) {
    return (
      <Box>
        <Skeleton className="h-[600px] w-full rounded-xl" />
      </Box>
    );
  }

  return (
    <Box className="!before:absolute !before:inset-0 !before:bg-gradient-to-br !before:from-white/10 !before:to-transparent !before:pointer-events-none relative flex w-full flex-1 flex-col gap-6 overflow-hidden !border-white/10 !bg-white/5 !shadow-2xl !backdrop-blur-2xl dark:!border-slate-400/10 dark:!bg-slate-900/5">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Career Progression Roadmap
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your Progress: {totalPoints} points
          </p>

          {/* Progress Bar */}
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="from-customBlue-500 h-full bg-gradient-to-r to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="mt-2 text-right text-xs font-semibold text-gray-600 dark:text-gray-400">
            {overallProgress.toFixed(1)}% Complete
          </p>
        </div>

        {/* Interactive React Flow Roadmap */}
        {/* Interactive React Flow Roadmap */}
        <div className="h-[850px] w-full rounded-xl">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultViewport={{ x: 60, y: 20, zoom: 0.7 }}
            minZoom={0.5}
            maxZoom={1.3}
            nodesDraggable={true}
            nodesConnectable={false}
            elementsSelectable={true}
            panOnDrag={true}
            zoomOnScroll={true}
            zoomOnPinch={true}
            preventScrolling={true}
          >
            <Background color="#94a3b8" gap={16} className="opacity-30" />
          </ReactFlow>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          💡 Drag and zoom to explore your roadmap • Click phase cards to view details
        </p>
      </div>

      {/* Phase Details Modal */}
      <PhaseDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        phaseId={selectedPhase}
      />
    </Box>
  );
}
