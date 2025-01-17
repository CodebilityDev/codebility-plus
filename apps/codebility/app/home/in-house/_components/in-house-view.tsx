"use client";

import { useEffect, useState } from "react";
import { H1 } from "@/Components/shared/home";
import useMediaQuery from "@/hooks/use-media-query";
import usePagination from "@/hooks/use-pagination";
import { Codev } from "@/types/home/codev";

import { Pagination } from "@codevs/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";

import { InHouseCards } from "./cards/in-house-cards";
import { InHouseTable } from "./table/in-house-table";

interface InHouseViewProps {
  initialData: Codev[];
}

export default function InHouseView({ initialData }: InHouseViewProps) {
  // Data state management
  const [data, setData] = useState<Codev[]>(initialData);
  const [activeView, setActiveView] = useState<"table" | "cards">("table");

  // Media query for responsive design
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Set initial view based on screen size
  useEffect(() => {
    setActiveView(isDesktop ? "table" : "cards");
  }, [isDesktop]);

  // Pagination logic
  const {
    currentPage,
    totalPages,
    paginatedData,
    handlePreviousPage,
    handleNextPage,
  } = usePagination(data, 10);

  // Shared props for both views
  const sharedProps = {
    data: paginatedData,
    onDataChange: setData,
    pagination: {
      currentPage,
      totalPages,
      onNextPage: handleNextPage,
      onPreviousPage: handlePreviousPage,
    },
  };

  // Pagination status component
  const PaginationStatus = () => (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        {data.length === 1 ? "1 item" : `${data.length} items`}
      </p>
      <Pagination {...sharedProps.pagination} />
    </div>
  );

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4 p-4">
      <H1>In-House Codebility</H1>

      <Tabs
        defaultValue={activeView}
        value={activeView}
        onValueChange={(value) => setActiveView(value as "table" | "cards")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="table" disabled={!isDesktop}>
            Table View
          </TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <InHouseTable {...sharedProps} />
          <PaginationStatus />
        </TabsContent>

        <TabsContent value="cards" className="space-y-4">
          <InHouseCards {...sharedProps} />
          <PaginationStatus />
        </TabsContent>
      </Tabs>
    </div>
  );
}
