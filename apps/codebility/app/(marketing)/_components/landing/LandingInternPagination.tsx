"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import InternCards from "./LandingInternCard";

type Person = {
  name: string;
  image?: string;
};

interface InternApiResponse {
  INTERNS: { name: string; image?: string }[];
  error?: string;
}

export default function LandingInternPagination() {
  const [page, setPage] = useState<number>(1);
  const [interns, setInterns] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 10;

  useEffect(() => {
    let mounted = true;

    const fetchInterns = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/all-active-interns");
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Failed to fetch interns: ${res.status} ${txt}`);
        }

        const data = (await res.json()) as InternApiResponse;

        if (!data || !Array.isArray(data.INTERNS)) {
          console.warn("Unexpected API response shape for /api/all-active-interns:", data);
          if (!mounted) return;
          setInterns([]);
        } else {
          const mapped = data.INTERNS.map((i) => ({
            name: i.name,
            image: i.image ?? "/avatars/default.png",
          }));
          if (!mounted) return;
          setInterns(mapped);
          setPage(1);
        }
      } catch (err: any) {
        console.error("Error fetching interns:", err);
        if (!mounted) return;
        setError(err?.message ?? "Unknown error");
        setInterns([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchInterns();

    return () => {
      mounted = false;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(interns.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const paginatedInterns = interns.slice((page - 1) * pageSize, page * pageSize);

  const goToPrevious = () => setPage((p) => Math.max(1, p - 1));
  const goToNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Intern Cards container */}
      <div className="w-full min-h-[300px] ">
        {loading ? (
          <div className="py-12 text-sm text-gray-500 flex items-center justify-center">Loading interns…</div>
        ) : error ? (
          <div className="py-12 text-sm text-red-500 flex items-center justify-center">Error: {error}</div>
        ) : paginatedInterns.length > 0 ? (
          <InternCards interns={paginatedInterns} />
        ) : (
          <div className="py-12 text-sm text-gray-400 flex items-center justify-center">No interns available</div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevious}
          disabled={page === 1 || loading}
          className="rounded-full w-9 h-9 p-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} className="shrink-0" />
        </Button>

        <div className="text-sm text-gray-600 dark:text-gray-300">
          Page {page} of {totalPages}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          disabled={page === totalPages || loading}
          className="rounded-full w-9 h-9 p-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} className="shrink-0" />
        </Button>
      </div>
    </div>
  );
}