"use client"

import { useState, useEffect } from "react"

const usePagination = <T>(data: T[], pageSize: number) => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const { length: lenghtOfData } = data

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1)
    }
  }
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  useEffect(() => {
    setTotalPages(Math.ceil(lenghtOfData / pageSize))

    if(data.length <= pageSize) {
      setCurrentPage(1)
    }
  }, [data])

  return { 
    currentPage,
    totalPages,
    paginatedData,
    setCurrentPage,
    handlePreviousPage,
    handleNextPage
  }
}

export default usePagination