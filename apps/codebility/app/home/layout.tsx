import { ThemeProvider } from "@/store/providers/ThemeProvider";
import ReactQueryProvider from "@/hooks/query/reactQuery";
import { UserProvider } from "@/store/UserProvider";
import { getCurrentCodev } from "@/lib/server/current-codev";
import { getSidebarData } from "@/constants/sidebar";
import { getSidebarRoleId } from "@/components/shared/dashboard/LeftSidebarServer";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Toaster } from "sonner";

import { MuiStyleRoot } from "./(dashboard)/_components/DashboardRoadmapStyleRoot";
import HomeChrome from "./_components/HomeChrome";
import LeftSidebarServer from "@/components/shared/dashboard/LeftSidebarServer";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentCodev();
  // Fetched once here and passed to both the sidebar and the mobile nav, which
  // previously each ran their own query for the same role-filtered links.
  const sidebarData = await getSidebarData(getSidebarRoleId(currentUser));

  return (
    <AppRouterCacheProvider>
      <MuiStyleRoot>
        <ThemeProvider>
          <ReactQueryProvider>
            <UserProvider initialUser={currentUser}>
              <HomeChrome
                sidebar={<LeftSidebarServer />}
                sidebarData={sidebarData}
              >
                {children}
              </HomeChrome>
              <Toaster
                richColors
                position="top-right"
                toastOptions={{ className: "dark:bg-gray-800 dark:text-white" }}
              />
            </UserProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </MuiStyleRoot>
    </AppRouterCacheProvider>
  );
}
