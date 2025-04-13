"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  className: string;
  placeholder: string;
  id?: string; // Optional ID property
}

export default function KanbanBoardsSearch({
  className,
  placeholder,
  id,
}: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) params.set("query", term);
    else params.delete("query");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      onChange={(e) => handleSearch(e.target.value)}
      defaultValue={searchParams.get("query")?.toString()}
      className={`${className} text-dark-400 dark:text-light-700`}
      id={id} // Assigning the optional id
    />
  );
}
