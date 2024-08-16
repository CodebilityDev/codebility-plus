"use client"

import React from "react"

import { keepPreviousData, QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      placeholderData: keepPreviousData, // to use the previous data as placeholder while new data is being fetched
      refetchOnWindowFocus: true, // set to "true" to ensure the data is up to date
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: false, // to control the failed retries
      staleTime: 5 * 60 * 1000, // to improved performance and to reduce any unnecessary network request. This is set to 5 minutes
    },
  },
})

function ReactQueryProvider({ children }: React.PropsWithChildren) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
export default ReactQueryProvider
