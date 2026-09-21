import { Suspense } from "react";
import { ThemeProvider } from "@/store/providers/ThemeProvider";
import ReactQueryProvider from "@/hooks/query/reactQuery";
import { UserProvider } from "@/store/UserProvider";
import { getCurrentCodev } from "@/lib/server/current-codev";
import { getSidebarData } from "@/constants/sidebar";
import { Toaster } from "sonner";

import HomeChrome from "./_components/HomeChrome";
import MobileNav from "./_components/MobileNav";
import SurveyWidget, { type Survey } from "./_components/SurveyWidget";
import { getDismissedSurveys, getPendingSurveyForUser } from "@/actions/settings/surveys";
import LeftSidebarServer, {
  getSidebarRoleId,
} from "@/components/shared/dashboard/LeftSidebarServer";
import { SidebarSkeleton } from "@/components/shared/dashboard/SidebarSkeleton";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only the user blocks the shell.
  const currentUser = await getCurrentCodev();

  // Kick the sidebar query off but do NOT await it here: awaiting would hold
  // back the whole shell. The single promise is shared by both Suspense
  // boundaries, so the query still runs once (getSidebarData is a "use server"
  // action and is not cache()-deduped).
  const sidebarPromise = getSidebarData(getSidebarRoleId(currentUser));

  // Resolved on the server so the widget issues no client request on load.
  const surveyPromise = Promise.all([
    getPendingSurveyForUser(),
    getDismissedSurveys(),
  ]);

  return (
    <ThemeProvider>
      <ReactQueryProvider>
        <UserProvider initialUser={currentUser}>
          <HomeChrome
            sidebar={
              <Suspense fallback={<SidebarSkeleton />}>
                <SidebarSlot sidebarPromise={sidebarPromise} />
              </Suspense>
            }
            mobileNav={
              <Suspense fallback={null}>
                <MobileNavSlot sidebarPromise={sidebarPromise} />
              </Suspense>
            }
            survey={
              <Suspense fallback={null}>
                <SurveySlot surveyPromise={surveyPromise} />
              </Suspense>
            }
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
  );
}

type SidebarPromise = ReturnType<typeof getSidebarData>;

async function SidebarSlot({
  sidebarPromise,
}: {
  sidebarPromise: SidebarPromise;
}) {
  return <LeftSidebarServer sidebarData={await sidebarPromise} />;
}

/**
 * MobileNav is a client component needing resolved links. This server wrapper
 * awaits the shared promise so the layout itself never blocks on it.
 */
async function MobileNavSlot({
  sidebarPromise,
}: {
  sidebarPromise: SidebarPromise;
}) {
  return <MobileNav sidebarData={await sidebarPromise} />;
}

type SurveyPromise = Promise<
  [
    Awaited<ReturnType<typeof getPendingSurveyForUser>>,
    Awaited<ReturnType<typeof getDismissedSurveys>>,
  ]
>;

async function SurveySlot({ surveyPromise }: { surveyPromise: SurveyPromise }) {
  const [pending, dismissed] = await surveyPromise;

  return (
    <SurveyWidget
      pendingSurvey={"data" in pending ? pending.data : null}
      initialDismissed={
        ("data" in dismissed ? (dismissed.data ?? []) : []) as Survey[]
      }
    />
  );
}
