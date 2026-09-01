"use client";

import { Suspense, use, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { box } from "@/components/FramerAnimation/Framer";
import DefaultPagination from "@/components/ui/pagination";
import { getStableColor } from "@/utils/getRandomColor";
import type { CodevsProfilesPage } from "@/types/marketing/codevs-profiles";
import { fetchApiJson } from "@/utils/api-fetch";

import CodevCard from "../profiles/_components/CodevCard";
import CodevListFilter from "../profiles/_components/CodevListFilter";
import { CodevsProfilesSkeleton } from "./CodevsProfilesSkeleton";

const pagePromises = new Map<string, Promise<CodevsProfilesPage>>();

function loadPage(
  position: string,
  page: number,
  pageSize: number,
  initialData: CodevsProfilesPage,
): Promise<CodevsProfilesPage> {
  const key = `${position}:${page}:${pageSize}`;
  const cached = pagePromises.get(key);
  if (cached) return cached;

  if (
    page === initialData.pagination.page &&
    position === initialData.position
  ) {
    const resolved = Promise.resolve(initialData);
    pagePromises.set(key, resolved);
    return resolved;
  }

  const params = new URLSearchParams({
    page: String(page),
    limit: String(pageSize),
  });
  if (position) {
    params.set("position", position);
  }

  const promise = fetchApiJson<CodevsProfilesPage>(
    `/api/codevs-profiles?${params.toString()}`,
    { cache: "force-cache" },
  ).then((result) => {
    if (!result.ok) {
      console.error("Error fetching codevs profiles page:", result.error);
      return {
        codevs: [],
        pagination: {
          page,
          limit: pageSize,
          total: 0,
          totalPages: 0,
        },
        positions: initialData.positions,
        position,
      };
    }
    return result.data;
  });

  pagePromises.set(key, promise);
  return promise;
}

function CodevsPaginationSlot({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return <div className="mt-6 min-h-[4.5rem]" aria-hidden="true" />;
  }

  const currentPage = Math.min(page, totalPages);

  return (
    <div className="mt-6 text-white">
      <DefaultPagination
        currentPage={currentPage}
        totalPages={totalPages}
        handleNextPage={() => {
          onPageChange(Math.min(totalPages, currentPage + 1));
        }}
        handlePreviousPage={() => {
          onPageChange(Math.max(1, currentPage - 1));
        }}
        setCurrentPage={onPageChange}
      />
    </div>
  );
}

function CodevsGrid({ codevs }: { codevs: CodevsProfilesPage["codevs"] }) {
  if (codevs.length === 0) {
    return (
      <p className="text-center text-2xl text-gray-500 dark:text-gray-400">
        Sorry, no data found.
      </p>
    );
  }

  return (
    <motion.div
      variants={box}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      className="grid h-full w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      {codevs.map((codev) => (
        <CodevCard
          color={getStableColor(codev.id)}
          key={codev.id}
          codev={codev}
        />
      ))}
    </motion.div>
  );
}

function CodevsProfilesRemote({
  position,
  page,
  pageSize,
  initialData,
  onPageChange,
}: {
  position: string;
  page: number;
  pageSize: number;
  initialData: CodevsProfilesPage;
  onPageChange: (page: number) => void;
}) {
  const data = use(loadPage(position, page, pageSize, initialData));
  const totalPages = Math.max(0, data.pagination.totalPages);

  return (
    <>
      <CodevsGrid codevs={data.codevs} />
      <CodevsPaginationSlot
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}

function CodevsProfilesPageView({
  position,
  page,
  pageSize,
  initialData,
  onPageChange,
}: {
  position: string;
  page: number;
  pageSize: number;
  initialData: CodevsProfilesPage;
  onPageChange: (page: number) => void;
}) {
  if (
    page === initialData.pagination.page &&
    position === initialData.position
  ) {
    const totalPages = Math.max(0, initialData.pagination.totalPages);

    return (
      <>
        <CodevsGrid codevs={initialData.codevs} />
        <CodevsPaginationSlot
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </>
    );
  }

  return (
    <CodevsProfilesRemote
      position={position}
      page={page}
      pageSize={pageSize}
      initialData={initialData}
      onPageChange={onPageChange}
    />
  );
}

interface Props {
  initialData: CodevsProfilesPage;
  pageSize: number;
}

export default function CodevsProfilesPagination({
  initialData,
  pageSize,
}: Props) {
  const [position, setPosition] = useState(initialData.position);
  const [page, setPage] = useState(initialData.pagination.page);
  const [isPending, startTransition] = useTransition();

  const onPageChange = (nextPage: number) => {
    startTransition(() => {
      setPage(nextPage);
    });
  };

  const onPositionChange = (nextPosition: string) => {
    startTransition(() => {
      setPosition(nextPosition);
      setPage(1);
    });
  };

  return (
    <div className="m-auto h-full w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <CodevListFilter
        selectedPosition={position}
        setSelectedPosition={onPositionChange}
        users={initialData.codevs}
        positions={initialData.positions}
      />

      <div
        className={`transition-opacity duration-200 ${
          isPending ? "opacity-60" : "opacity-100"
        }`}
      >
        <Suspense
          key={`${position}:${page}`}
          fallback={
            <>
              <CodevsProfilesSkeleton count={pageSize} />
              <div className="mt-6 min-h-[4.5rem]" aria-hidden="true" />
            </>
          }
        >
          <CodevsProfilesPageView
            position={position}
            page={page}
            pageSize={pageSize}
            initialData={initialData}
            onPageChange={onPageChange}
          />
        </Suspense>
      </div>
    </div>
  );
}
