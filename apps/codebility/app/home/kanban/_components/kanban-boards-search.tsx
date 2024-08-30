"use client"

import { usePathname, useSearchParams, useRouter } from "next/navigation"

export default function KanbanBoardsSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams)

    if (term) params.set("query", term)
    else params.delete("query");
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <input
      type="text"
      placeholder="Search board"
      onChange={(e) => handleSearch(e.target.value)}
      defaultValue={searchParams.get("query")?.toString()}
      className="h-10 w-full rounded-full border border-gray border-opacity-50 bg-inherit px-5 text-xs focus:outline-none md:w-80"
    />
  )
}
