"use client"

import { useState } from "react"

export default function KanbanBoardsSearch() {
  const [isSearching, setIsSearching] = useState("")

  return (
    <input
      type="text"
      placeholder="Search board"
      className="h-10 w-full rounded-full border border-gray border-opacity-50 bg-inherit px-5 text-xs focus:outline-none md:w-80"
    />
  )
}
