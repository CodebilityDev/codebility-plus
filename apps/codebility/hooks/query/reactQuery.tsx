"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function ReactQueryProvider({ children }: React.PropsWithChildren) {
  // Created per provider instance rather than at module scope. A module-level
  // client is shared across requests in the server process, which would leak
  // one user's cached data to another as soon as any query is prefetched
  // during SSR.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: true,
            refetchOnMount: true,
            refetchOnReconnect: true,
            retry: false,
            // Components asking for the same queryKey within this window share
            // a single response instead of each issuing its own request.
            staleTime: 5 * 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
export default ReactQueryProvider;
