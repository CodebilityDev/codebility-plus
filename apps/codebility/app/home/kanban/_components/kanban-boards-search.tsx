"use client"

import { usePathname, useSearchParams, useRouter } from "next/navigation"

interface Props {
  className: string;
  placeholder: string;
}

export default function KanbanBoardsSearch({ className, placeholder }: Props) {
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
      placeholder={placeholder}
      onChange={(e) => handleSearch(e.target.value)}
      defaultValue={searchParams.get("query")?.toString()}
      className={className}
    />
  )
}
