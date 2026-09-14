import React from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/store/providers/ThemeProvider";
import ReactQueryProvider from "@/hooks/query/reactQuery";
import { UserProvider } from "@/store/UserProvider";
import { getCurrentCodev } from "@/lib/server/current-codev";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

import { MuiStyleRoot } from "./(dashboard)/_components/DashboardRoadmapStyleRoot";
import HomeChrome from "./_components/HomeChrome";
import LeftSidebarServer from "@/components/shared/dashboard/LeftSidebarServer";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read once here so the sidebar and the client store share one query.
  const currentUser = await getCurrentCodev();

  return (
    <ErrorBoundary>
      <ReactQueryProvider>
        <UserProvider initialUser={currentUser}>
          <ThemeProvider>
            <AppRouterCacheProvider>
              <MuiStyleRoot>
                {/*
                  Both `children` and the sidebar are rendered HERE, on the
                  server, and passed into the client chrome as element props.
                  Server Components may be async; the client `HomeChrome` may
                  not, so an async component must never be imported into it.

                  Passing elements as props also preserves re-render isolation:
                  these references are created on the server and are not
                  re-created when client state changes, so a sidebar toggle or
                  an incoming notification cannot re-render the page.
                */}
                <HomeChrome sidebar={<LeftSidebarServer />}>
                  {children}
                </HomeChrome>
              </MuiStyleRoot>
            </AppRouterCacheProvider>
          </ThemeProvider>
        </UserProvider>
      </ReactQueryProvider>
    </ErrorBoundary>
  );
}
