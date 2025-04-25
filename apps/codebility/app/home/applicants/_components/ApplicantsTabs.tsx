"use client";

import { ReactNode } from "react";
import { ApplicantStatus } from "@/types/home/codev";

import { Badge } from "@codevs/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";

interface ApplicantsTabsProps {
  activeTab: ApplicantStatus;
  tabCounts: Record<ApplicantStatus, number>;
  onTabChange: (value: ApplicantStatus) => void;
  children: ReactNode;
}

const ApplicantsTabs = ({
  activeTab,
  tabCounts,
  onTabChange,
  children,
}: ApplicantsTabsProps) => {
  // Only show tabs with applicants or the active tab
  const visibleTabs: ApplicantStatus[] = [
    "applying",
    "testing",
    "onboarding",
    "denied",
  ];

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => onTabChange(value as ApplicantStatus)}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        <TabsTrigger value="applying" className="relative">
          <span>Applicants</span>
          {tabCounts.applying > 0 && (
            <Badge className="ml-2 bg-blue-500 text-white">
              {tabCounts.applying}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="testing" className="relative">
          <span>Testing</span>
          {tabCounts.testing > 0 && (
            <Badge className="ml-2 bg-amber-500 text-white">
              {tabCounts.testing}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="onboarding" className="relative">
          <span>Onboarding</span>
          {tabCounts.onboarding > 0 && (
            <Badge className="ml-2 bg-green-500 text-white">
              {tabCounts.onboarding}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="denied" className="relative">
          <span>Denied</span>
          {tabCounts.denied > 0 && (
            <Badge className="ml-2 bg-red-500 text-white">
              {tabCounts.denied}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      {visibleTabs.map((tab) => (
        <TabsContent key={tab} value={tab} className="mt-10 md:mt-4">
          {activeTab === tab && children}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ApplicantsTabs;
