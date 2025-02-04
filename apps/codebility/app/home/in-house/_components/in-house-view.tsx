"use client";

import { useState } from "react";
import { H1 } from "@/Components/shared/home";
import useMediaQuery from "@/hooks/use-media-query";
import usePagination from "@/hooks/use-pagination";
import { Codev } from "@/types/home/codev";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";

import { InHouseCards } from "./cards/in-house-cards";
import { InHouseTable } from "./table/in-house-table";

interface InHouseViewProps {
  initialData: Codev[];
}

export default function InHouseView({ initialData }: InHouseViewProps) {
  const [data, setData] = useState<Codev[]>(initialData);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const {
    currentPage,
    totalPages,
    paginatedData,
    handleNextPage,
    handlePreviousPage,
  } = usePagination(data, 10);

  const sharedProps = {
    data: paginatedData,
    onDataChange: (newData: Codev[]) =>
      setData(Array.isArray(newData) ? newData : []),
    pagination: {
      currentPage,
      totalPages,
      onNextPage: handleNextPage,
      onPreviousPage: handlePreviousPage,
    },
  };

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4 p-4">
      <H1>In-House Codebility</H1>
      <Tabs defaultValue={isDesktop ? "table" : "cards"} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
        </TabsList>
        <TabsContent value="table" className="space-y-4">
          <InHouseTable {...sharedProps} />
        </TabsContent>
        <TabsContent value="cards" className="space-y-4">
          <InHouseCards {...sharedProps} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
