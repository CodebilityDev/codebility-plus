"use client"
import React, { useState } from "react"

type SearchProps = {
  onSubmit: (search: string) => void
  placeholder?: string
}

const Search = ({ onSubmit, placeholder = "Search" }: SearchProps) => {
  const [isSearching, setIsSearching] = useState<string>("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(isSearching)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={isSearching}
        placeholder={placeholder}
        onChange={(e) => setIsSearching(e.target.value)}
        className="text-black h-10 w-full rounded-full border border-gray border-opacity-50 bg-inherit px-5 focus:outline-none dark:text-white md:w-80"
      />
    </form>
  )
}

export default Search
